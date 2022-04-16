import * as express from 'express';
import * as multer from 'multer';
import { isLoggedIn } from './middlewares';
import * as path from 'path'
import * as fs from 'fs';
import * as AWS from 'aws-sdk'
import * as multerS3 from 'multer-s3'
import { Product, Review, User, Image, Size, HistoryCart } from '../models';
import { Op } from 'sequelize';
const router = express.Router();

try{
    fs.accessSync('uploads');
}catch(error){
    console.log('uploads 폴더가 없으므로 생성합니다.');
    fs.mkdirSync('uploads');
}

AWS.config.update({
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
    region: 'ap-northeast-2',
})

const upload = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: 'reactshoppingmall-s3',
        key(rep,file,cb){
            cb(null, `orignal/${Date.now()}_${path.basename(file.originalname)}`)
        }
    }),
    limits : {fileSize: 20 * 1024 * 1024, files: 2}
});

router.post('/images', isLoggedIn, upload.array('image'), async(req, res, next) => {
    console.log('req.files',req.files);
    if(Array.isArray(req.files)){
    res.json(req.files.map((v:Express.Multer.File) => v.location))
    }
})

router.post('/',isLoggedIn, upload.none(), async(req, res, next)=>{
    try{
        const product = await Product.create({
            productName : req.body.productName,
            price : req.body.productPrice,
            stock : req.body.productStock,
            UserId : req.user!.id,
        })
        if(req.body.image){
            const promises:Promise<Image>[] = req.body.image.map((image:string)=> Image.create({
                    src: image
                }));
                const images = await Promise.all(promises)
                    
                await product.addImages(images)
            
        }
        if(req.body.productSize){
            if(Array.isArray(req.body.productSize)){
                const promises:Promise<Size>[] = req.body.productSize.map((size:string) => Size.create({
                    option: size
                }))
                const sizes =  await Promise.all(
                promises
            );
            await product.addSizes(sizes)
            }else{
                const size = await Size.create({
                    option: req.body.productSize
                })
                await product.addSize(size)
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

router.get('/name/:spelling', async(req, res, next) => {
    try{
        const SearchProducts =  await Product.findAll({
            where : {
                productName : {
                    [Op.like] : "%" + decodeURIComponent(req.params.spelling) + "%"
                }
            },
            attributes: ['id','productName']
        })
        res.status(202).json(SearchProducts)
    }catch(error){
        console.error(error);
        next(error);
    }
})

router.get('/:postId', async(req, res, next ) => {
    try{
        let where= {};
    if(parseInt(req.params.postId,10)){
        where ={
            id: parseInt(req.params.postId,10)
        }
    }
        const loadProduct = await Product.findOne({
        where,
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
            attributes: ['id','email'],
            as : 'Likers'
        },{
            model: Size,
            attributes: ['option']
        }]
    })
    res.status(202).json(loadProduct)
    }catch(error){
        console.error(error);
        next(error)
    }
})
router.post('/:productId/review',isLoggedIn, async(req, res, next) => {
    try{

        const exReview  = await Review.findOne({
            where : {[Op.and] : [{ProductId: parseInt(req.params.productId,10)}, {UserId : req.user!.id},{reviewUnique : req.body.reviewUnique}]},
        })
            if(exReview){
                return res.status(404).json('이미 작성하신 리뷰가 존재합니다.')
            }
        await Review.create({
            content : req.body.content,
            ProductId : parseInt(req.params.productId, 10),
            UserId : req.user!.id,
            rate : req.body.rate,
            reviewUnique : req.body.reviewUnique,
        })
//  사진. 
        const review = await Review.findOne({
            where : {
                [Op.and] : [{reviewUnique : req.body.reviewUnique},{ProductId: parseInt(req.params.productId,10)}, {UserId : req.user!.id}]
            },
            attributes : ['reviewUnique' , 'id']
        })
        res.status(201).json({Review : review,})
    }catch(error){
        console.error(error);
        next(error);
    }
})

export default router;
