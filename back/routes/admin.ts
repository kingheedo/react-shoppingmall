import * as express from 'express';
import * as bcrypt from 'bcrypt';
import * as passport from 'passport';
import * as path from 'path'
import * as fs from 'fs';
import { isLoggedIn, isNotLoggedIn } from './middlewares';
import {  Image, Product, Size, User } from '../models';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3'
import { S3Client } from '@aws-sdk/client-s3';

const router = express.Router();

try{
    fs.accessSync('uploads');
}catch(error){
    console.log('uploads 폴더가 없으므로 생성합니다.');
    fs.mkdirSync('uploads');
}

// 이미지 로컬 저장
// const upload = multer({
//     storage: multer.diskStorage({
//         destination: (req,file,cb) => {
//             cb(null, 'uploads')
//         },
//         filename: (req,file,cb) => {
//             cb(null, `${file.fieldname} - ${Date.now()}`)
//         },
//     }),
//     limits: {
//         fileSize : 20 * 1024 * 1024, files: 2
//     }
// })

/** multer에서 s3접근 */
const s3 = new S3Client({
    credentials:{
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    region: 'ap-northeast-2',
});

/** multer에서 s3업로드 설정 */
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME!,
        key: (req,file,cb) => {
            cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`)
        }
    }),
    limits: {fileSize: 20 * 1024 * 1024},
});

/** 이미지 s3 추가 */
router.post('/product/images', isLoggedIn, upload.array('image'), async(req, res, next) => {
    // console.log('req.files',req.files);
    if(Array.isArray(req.files)){
     return res.json((req.files as Express.MulterS3.File[]).map((v) => v.location))
    }
})

/** 상품 추가 */
router.post('/product', isLoggedIn, upload.none(), async(req, res, next)=>{
    try{
      let product;
      if(req.user?.id){
          product = await Product.create({
            productName : req.body.productName,
            price : req.body.price,
            stock : req.body.stock,
            sex: req.body.sex,
            UserId : req.user!.id,
        })
      }

        console.log('req.body',req.body)
        if(req.body.images && product){
            const promises:Promise<Image>[] = req.body.images.map((image:string)=> Image.create({
                    src: image
                }));
            const images = await Promise.all(promises)
                
            await product.addImages(images)
            
        }
        if(req.body.sizes && product){
            if(Array.isArray(req.body.sizes)){
                const promises:Promise<Size>[] = req.body.sizes.map((size:string) => Size.create({
                    option: size
                }))
                const sizes =  await Promise.all(
                promises
            );
            await product.addSizes(sizes)
            }else{
                const size = await Size.create({
                    option: req.body.sizes
                })
                await product.addSize(size)
            }
        }
        let fullProduct;
        if(product?.id){
          fullProduct = await Product.findOne({
            where: {id : product.id},
            include:[{
            model : Image,
            },
            {
            model: Size,
            attributes: ['option'],
            },]
          })
        }
        
         return res.status(202).json(fullProduct);
    }catch(error){
        console.error(error);
        next(error);
    }
})

/** 상품 정보 수정 */
router.patch('/product', isLoggedIn, async(req, res, next) => {
  try{
    if(req.body.sizes.length === 0){
      return res.status(404).send('사이즈를 선택해주세요')
    }
    if(req.body.images.length === 0){
      return res.status(404).send('이미지를 선택해주세요')
    }
    const product = await Product.findOne({
      where: {
        id: req.body.id
      }
    });

    /** 상품 이름, 가격, 재고, 성별 수정 */
    await product?.update({
        productName: req.body.productName,
        price: req.body.price,
        stock: req.body.stock,
        sex: req.body.sex,
      })

      /** 사이즈 수정 */
    const sizes = await Size.findAll({
      where: {
        ProductId: product?.id
      }
    });
    const options = sizes.map(val => val.option);

    const addSizePromises = (req.body.sizes as string[]).map(size => {
      if(!options.includes(size)){
        return Size.create({
          option: size,
          ProductId: product?.id
        })
      }
    });
    const destroySizePromises = options.map(option => {
      if(!req.body.sizes.includes(option)){
        return Size.destroy({
          where: {
            option: option,
            ProductId: product?.id
          }
        })
      }
    });
    await Promise.all([...addSizePromises, ...destroySizePromises]);
    
    /** 이미지 경로 수정 */
    const images = await Image.findAll({
      where: {
        ProductId: product?.id
      }
    });

    const updateImagePromises = images.map((image,idx) => {
      if(req.body.images[idx] !== image.src){
        return Image.update({
          src: req.body.images[idx],
        },{
          where: {
            src: image.src,
            ProductId: product?.id
          },
        })
      }
    })

    await Promise.all([...updateImagePromises]);
    return res.status(200).send('수정 완료');
  }
  catch(error){
    next(error);
    console.error(error);
  }
})

/** 상품 정보들 가져오기 */
router.get('/products', isLoggedIn, async(req,res,next) => {
  try{
    const productList = await Product.findAll({
      include: [{
        model: Image,
        attributes: ['src']
      }, 
      {
        model: Size,
        attributes: ['option']
      }],
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });

    return res.status(200).json(productList);
  }
  catch(error){
    console.error(error);
    next(error);
  }
})

/** 관리자 정보 가져오기*/
router.get('/user', async(req, res, next) => {
  try{
    if(req.user){
      const user = await User.findOne({
      where:{
        id: req.user?.id
      },
      attributes: ['id', 'email', 'name', 'level', ]
    })

    return res.status(200).json(user);
    }else{
    return res.status(200).json(null);
    }
  }
  catch(error){
    next(error);
    console.error(error);
  }
})

/** 로그인 요청 */
router.post('/user/login', isNotLoggedIn, async(req, res, next) => {
  try{
    if(req.body.email !== 'admin@admin.com'){
      return res.status(404).send('이메일을 다시 확인해주세요');
    }

    passport.authenticate('local', (err:Error, user:User, info:{message: string}) =>{
      if(err){
          console.error(err);
          return next(err)
      }
      if(info){
          return res.status(401).send(info.message);
      }
      return req.logIn(user, async (loginErr:Error) => {
          if(loginErr){
              console.error(loginErr)
              return next(loginErr)
          }
          const withOutPasswordUser = await User.findOne({
              where: {id: user.id},
              attributes: {
                  exclude : ['password']
              }
          })
          return res.status(201).json(withOutPasswordUser);
      })
      })(req, res, next)
  }
  catch(error){
    next(error);
    console.error(error);
  }
});

/** 로그아웃 */
router.post('/user/logout', isLoggedIn, async(req,res,next) => {
  try{
    req.logOut((err) => {
      if(err){
        console.error(err);
        return next(err);
      }else{
        res.redirect('/');
      }
    })
  }
  catch(error){
    console.error(error)
    next(error);
  }
})

export default router;