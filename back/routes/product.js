const express = require('express');
const router = express.Router();
const multer = require('multer');
const { isLoggedIn } = require('./middlewares');
const path = require('path')
const fs = require('fs');
const { Product, Review, User, Image } = require('../models');

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
        const fullProduct = await Product.findOne({
            where: {id: product.id},
            include:[{
                model: Image,
            },{
                model: Review,
                include:[{
                    model: User,
                    attributes: ['id','name'],
                }]
            },{
                model: User,
                attributes: ['id'],
                as: 'Likers',
            }]
        })
        res.status(202).json(fullProduct);
    }catch(error){
        console.error(error);
        next(error);
    }
})

router.get('/', (req,res) => {
    res.send('hello express');
})


module.exports = router;
