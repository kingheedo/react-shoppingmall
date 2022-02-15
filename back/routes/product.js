const express = require('express');
const router = express.Router();
const multer = require('multer');
const { isLoggedIn } = require('./middlewares');
const path = require('path')
const fs = require('fs');
const { Product, Review, User, Image, Size, Payment, HistoryCart } = require('../models');
const { Op } = require('sequelize/dist');

try{
    fs.accessSync('uploads');
}catch(error){
    console.log('uploads 폴더가 없으므로 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done){
            done(null, 'uploads')
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname)
            const basename = path.basename(file.originalname,ext)
            done(null, basename + '_' + new Date().getTime() + ext);;
        },
    }),
    limits : {fileSize: 20 * 1024 * 1024, files: 2}
});

router.get('/', async(req, res, next ) => {
    const loadProduct = await Product.findOne({
        where: {id : req.query.id},
        include: [{
            model: Image
        },{
            model : Review,
            include: [{
                model : User,
                attributes : ['id','email'],
                include: [{
                    model : HistoryCart,
                    attributes: [
                        'size','quantity'
                    ],
                }]
            }]
        },{
            model: User,
            attributes: ['id'],
            as : 'Likers'
        },{
            model: Size,
            attributes: ['option']
        }]
    })
    res.status(202).json(loadProduct)
})

router.post('/images', isLoggedIn, upload.array('image'), async(req, res, next) => { //Post /post/images
    console.log('req.files',req.files);
    res.json(req.files.map((v) => v.filename))
})

router.post('/',isLoggedIn, upload.none(), async(req, res, next)=>{
    try{
        const product = await Product.create({
            productName : req.body.productName,
            price : req.body.productPrice,
            stock : req.body.productStock,
            UserId : req.user.id,
        })
        if(req.body.image){
                const images = await Promise.all(
                    req.body.image.map(image => Image.create({
                    src: image
                })));
                await product.addImages(images)
            
        }
        if(req.body.productSize){
            if(Array.isArray(req.body.productSize)){
                const sizes = await Promise.all(
                req.body.productSize.map(size => Size.create({
                    option: size
                }))
            );
            await product.addSizes(sizes)
            }else{
                const size = await Size.create({
                    option: req.body.productSize
                })
                await product.addSizes(size)
            }
        }
        const fullProduct = await Product.findOne({
            where: {id : product.id},
            include:[{
            model : Image,
            },
            {
            model: Size,
            attributes: ['option'],
            },]
        })
        res.status(202).json(fullProduct);
    }catch(error){
        console.error(error);
        next(error);
    }
})
router.post('/:productId/review',isLoggedIn, async(req, res, next) => {
    try{

        const exReview  = await Review.findOne({
            where : {[Op.and] : [{ProductId: parseInt(req.params.productId,10)}, {UserId : req.user.id},{reviewUnique : req.body.reviewUnique}]},
        })
            if(exReview){
                return res.status(404).json('이미 작성하신 리뷰가 존재합니다.')
            }
        // const findPayment = await Payment.findOne({
        // where: {[Op.and] : [{id : req.body.historyCartId},{UserId : req.user.id}, {paymentToken : req.body.paymentToken}]},
        //  //로그인한 유저의 payment 만 부르기
        // })
        // const findHistoryCart = await HistoryCart.findOne({ //히스토리카트를 찾는다. 
        //     where : {[Op.and] : [{id : findPayment.HistoryCartId}, {UserId: req.user.id}, {ProductId : parseInt(req.params.productId,10)}]}
        // })
        await Review.create({
            content : req.body.content,
            ProductId : parseInt(req.params.productId, 10),
            UserId : req.user.id,
            rate : req.body.rate,
            reviewUnique : req.body.reviewUnique,
        })
//  사진. 
        const review = await Review.findOne({
            where : {
                [Op.and] : [{reviewUnique : req.body.reviewUnique},{ProductId: parseInt(req.params.productId,10)}, {UserId : req.user.id}]
            },
            attributes : ['reviewUnique' , 'id']
        })
        res.status(201).json({Review : review,})
    }catch(error){
        console.error(error);
        next(error);
    }
})

module.exports = router;
