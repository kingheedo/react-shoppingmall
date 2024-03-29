import * as express from 'express';
import { Op, Model } from 'sequelize';
import {Product, Cart, Image, HistoryCart, Size} from '../models';
import { isLoggedIn } from './middlewares';

const router = express.Router();

router.get('/', isLoggedIn, async(req, res, next) => {
    try{
        const fullCartitem = await Cart.findAll({
            where : {UserId: req.user!.id},
            order : [['updatedAt', 'DESC']],
            attributes: ['id', 'quantity', 'size', 'totalPrice'],
            include: [{
                model: Product,
                attributes: {
                    exclude: ['UserId', 'createdAt', 'updatedAt'],
                },
                include: [{
                    model: Image,
                    attributes: ['src']
                }
                ,{
                    model: Size,
                    attributes: ['option']
                }
            ]
            }]
        })
        return res.status(202).json(fullCartitem)
    }catch(error){
        console.error(error);   
        next(error)
    }
})

router.post('/', isLoggedIn, async(req, res, next) => {
    try{
        if(req.body.buyNow){
            // 지금 바로 구매 시
            const exCartItem = await Cart.findOne({
            where : {[Op.and]: [{UserId: req.user!.id, ProductId : req.body.productId}, {size: req.body.size}]},
        })
        if(exCartItem){
            const findHistoryCart = await HistoryCart.findOne({
                where : {
                            quantity : exCartItem!.quantity,
                            totalPrice : exCartItem!.totalPrice,
                            size : exCartItem!.size,
                            UserId : exCartItem!.UserId,
                            ProductId : exCartItem!.ProductId, 
                }
            })
            await Cart.update({
            totalPrice : req.body.totalPrice,
            quantity : req.body.quantity
        },{
            where :{[Op.and]: [{UserId: req.user!.id, ProductId : req.body.productId}, {size: req.body.size},]},
        }),
            await HistoryCart.update({
            totalPrice : req.body.totalPrice,
            quantity : req.body.quantity
        },{
            where :{[Op.and]: [{UserId: req.user!.id, ProductId : req.body.productId}, {size: req.body.size},{id: findHistoryCart!.id}]},
        })
        }else{
        await Cart.create({
            UserId : req.user!.id,
            ProductId : parseInt(req.body.productId,10),
            size: req.body.size,
            totalPrice : req.body.totalPrice,
            quantity: req.body.quantity
        })
        await HistoryCart.create({
            UserId : req.user!.id,
            ProductId : parseInt(req.body.productId,10),
            size: req.body.size,
            totalPrice : req.body.totalPrice,
            quantity: req.body.quantity
        })
        }
        const fullCartitem = await Cart.findOne({
            where : {[Op.and]: [{UserId: req.user!.id, ProductId : req.body.productId}, {size: req.body.size}]},
            include: [{
                model: Product,
                include: [{
                    model: Image,
                }]
            }]
        })
        return res.status(202).json(fullCartitem)
        } else{
            //장바구니에 담을 시
        const exCartItem = await Cart.findOne({
            where : {
                [Op.and]: [{
                    UserId: req.user!.id, 
                    ProductId : req.body.productId
                }, {
                    size: req.body.size
                }]},
        })
        if(exCartItem){
            const findHistoryCart = await HistoryCart.findOne({
                where : {
                            quantity : exCartItem!.quantity,
                            totalPrice : exCartItem!.totalPrice,
                            size : exCartItem!.size,
                            UserId : exCartItem!.UserId,
                            ProductId : exCartItem!.ProductId, 
                }
        })
            await Cart.increment({
                totalPrice : req.body.totalPrice,
                quantity : req.body.quantity
        },{
            where :{[Op.and]: [{UserId: req.user!.id, ProductId : req.body.productId}, {size: req.body.size},]},
        })
            await HistoryCart.increment({
                totalPrice : req.body.totalPrice,
                quantity : req.body.quantity
        },{
            where :{[Op.and]: [{UserId: req.user!.id, ProductId : req.body.productId}, {size: req.body.size},{id: findHistoryCart!.id}]},
        })
        }else{
            // Cart와 HistoryCart에 새로운 상품 추가
             await Cart.create({
            UserId : req.user!.id,
            ProductId : parseInt(req.body.productId,10),
            size: req.body.size,
            totalPrice : req.body.totalPrice,
            quantity: req.body.quantity
        }),
        await HistoryCart.create({
            UserId : req.user!.id,
            ProductId : parseInt(req.body.productId,10),
            size: req.body.size,
            totalPrice : req.body.totalPrice,
            quantity: req.body.quantity
        })
        }
        const fullCartitem = await Cart.findOne({
            where : {[Op.and]: [{UserId: req.user!.id, ProductId : req.body.productId}, {size: req.body.size}]},
            include: [{
                model: Product,
                include: [{
                    model: Image,
                }]
            }]
        })
        res.status(202).json(fullCartitem)
        }
    }catch(error){
        console.error(error);   
        next(error)
    }
})

router.post('/change', isLoggedIn, async(req, res, next) => {
    try{

        const exCart = await Cart.findOne({
            where: {
                id: req.body.id,
                ProductId: req.body.productId,
                UserId: req.user?.id
            }
        })

        const exHistoryCart = await HistoryCart.findOne({
            where: {
                id: req.body.id,
                ProductId: req.body.productId,
                UserId: req.user?.id
            }
        })

        await exCart?.update({
            size: req.body.size,
            quantity: req.body.quantity,
            totalPrice: req.body.totalPrice
        })
        await  exHistoryCart?.update({
            size: req.body.size,
            quantity: req.body.quantity,
            totalPrice: req.body.totalPrice
        })

        res.status(200).send('정상 변경되었습니다.')        
    }
    catch(error){
        console.error(error);
        next(error)
    }
})

router.delete('/', isLoggedIn, async(req, res, next) => {
    try{
        console.log('req.body.ids',req.body);
        
        await Cart.destroy({
            where: {[Op.and] : [{id : [...req.body.ids]},{UserId : req.user!.id}]},
        })
        
        res.status(200).send('아이템이 삭제되었습니다')
    }catch(error){
        console.error(error);   
        next(error)
    }
})

export default router;