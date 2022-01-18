const express = require('express');
const router = express.Router();
const multer = require('multer');
const { isLoggedIn } = require('./middlewares');
const path = require('path')
const fs = require('fs');
const { Product, Review, User, Image, Size } = require('../models');

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
                attributes: ['email']
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




module.exports = router;
