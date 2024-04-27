import * as express from 'express';
import { isLoggedIn } from './middlewares';
import { Product, Review, User, Image, Size, HistoryCart, Payment, ReviewImage } from '../models';
import { Op } from 'sequelize';
const router = express.Router();

router.get('/search', async(req, res, next) => {
    try{
        
        const SearchProducts =  await Product.findAll({
            where : {
                productName : {
                    [Op.like] : "%" + (req.query.keyword as string) + "%"
                }
            },
            attributes: ['id','productName']
        })
        return res.status(202).json(SearchProducts)
    }catch(error){
        console.error(error);
        next(error);
    }
})

router.get('/:productId', async(req, res, next ) => {
    try{
        let where= {};
    if(parseInt(req.params.productId,10)){
        where ={
            id: parseInt(req.params.productId,10)
        }
    }

    let result = [];
        const loadProduct = await Product.findOne({
        where,
        include: [{
            model: Image
        },
        {
            model: User,
            attributes: ['id','email'],
            as : 'Likers'
        },{
            model: Size,
            attributes: ['option']
        }],
    });

    
    const reviews = await Review.findAll({
        where: {
            ProductId: parseInt(req.params.productId,10)
        },
        include: [{
            model: User,
            attributes: ['email'],
            include: [{
                model: HistoryCart,
                attributes: ['quantity','totalPrice','size'],
                where: {
                    ProductId: parseInt(req.params.productId,10)
                },
                through:{
                   attributes: [
                    'isReviewed'
                   ],
                   where: {
                    isReviewed: true
                   }
                }
            }],
        },{
            model: ReviewImage,
            attributes: ['src']
        }]
    })


    return res.status(202).json({...loadProduct?.get(),Reviews: reviews});
    }catch(error){
        console.error(error);
        next(error)
    }
})

// router.post('/review/images', isLoggedIn, upload.array('image'), async(req, res, next) => {
//     console.log('req.files', req.files);
//     if(Array.isArray(req.files)){
//         return res.json((req.files as Express.Multer.File[]).map(v => v.filename))
//     }
// })

router.post('/:productId/review', isLoggedIn, async(req, res,next) => {
    try{
        const review = await Review.create({
            content: req.body.content,
            rate: req.body.rate,
            ProductId: req.params.productId,
            UserId: req.user?.id
        });

        if(review && Array.isArray(req.body.image) && req.body.image.length > 0){
            const promise: Promise<ReviewImage>[] = req.body.image.map((src: string) => ReviewImage.create({
                src: src
            }))
            
            const reviewImages = await Promise.all(promise);

            await review.addReviewImages(reviewImages);
        }
        const payment = await Payment.findOne({
            where: {
                id: req.body.paymentId
            }
        });

        await payment?.update({
            isReviewed: true
        })
        

        return res.status(202).send('리뷰 작성 완료');
    }
    catch(error){
        console.error(error);
        next(error);
    }
})

router.post('/like/:productId', isLoggedIn, async(req,res,next) => {
    try{
        const productId = parseInt(req.params.productId, 10);

        const product = await Product.findOne({
            where: {
                id: productId
            }
        })

        product?.addLikers(req.user?.id)

        return res.status(201).json('좋아요를 눌렀습니다.')
    }

    catch(error){
        console.error(error);
        next(error);
    }
})

router.post('/unlike/:productId', isLoggedIn, async(req, res, next) => {
    try{
        const productId = parseInt(req.params.productId,10);
        const product = await Product.findOne({
            where: {
                id: productId
            }
        })
        if(product){
            await product.removeLikers(req.user!.id);
            return res.status(201).json('좋아요 취소');
        }
    }
    catch(error){
        console.error(error);
        next(error);
    }
})

export default router;
