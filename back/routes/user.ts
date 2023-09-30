import * as express from 'express'
import { User, Payment, Product, Image, HistoryCart, Review, Cart, sequelize, Address } from '../models';
const router = express.Router();
import * as bcrypt from 'bcrypt';
import * as passport from 'passport';
import {isLoggedIn, isNotLoggedIn} from './middlewares';
import { Op } from 'sequelize';




router.get('/paymentsList', isLoggedIn,  async(req, res, next) => {
    try{
            const paymentLists = await Payment.findAll({
                order : [['createdAt', 'DESC']],
                where : {UserId: req.user!.id},
                include:[{
                    model : HistoryCart,
                    include: [{
                        model : Product,
                        include: [{
                        model : Image
                    },]
                    },{
                        model : User,
                        include: [{
                            model : Review,
                            
                        }],
                        attributes: ['id', 'email']
                    }]
                    
                }]
            })
            return res.status(202).json(paymentLists)
    } catch (error) {
        console.error(error);
        next(error);
    }
})
router.post('/logout',isLoggedIn, (req, res, next) => {
    req.logOut((err) => {
        if(err){
            console.error(err);
            return next(err);
        }else{
            res.redirect('/')
        }
    });
    // req.session.destroy(() =>{
    //     return res.status(201).send('로그아웃 완료.')
    // });
    
})

router.get('/address', isLoggedIn, async(req, res, next) => {
    try{
        const getAddresses=  await Address.findAll({
            where: {
                id: req.user?.id
            }
        })
        
        res.status(200).json(getAddresses);
    }
    catch(error){
        console.error(error);
        next(error);
    }
})

router.post('/address', isLoggedIn, async(req, res, next) => {
    try{
        if(req.user){
            await Address.create({
                postNum: req.body.postNum,
                base: req.body.base,
                detail: req.body.detail,
                UserId: req.user.id
            })
        }

        return res.status(201).send('배송지 추가 완료')
    }
    catch(error){
        console.error(error);
        next(error);
    }
})

router.get('/', async(req, res, next) =>{
    try{
        if(req.user){
    const info = await User.findOne({
        where : {id : req.user.id},
        attributes: {
            exclude : ['password']
        }
        })
        const cartLength = await Cart.count({
            where: {UserId: req.user.id}
        })

        const userInfo = {
            info,
            cartLength
        }
        

        return res.status(200).json(userInfo);
        }else{
            return res.status(200).json(null);
        }
        
    }catch(error){
        console.error(error);
        next(error);
    }
});

router.post('/login',isNotLoggedIn, (req, res, next) =>{
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
});

router.post('/', isNotLoggedIn,  async(req, res, next) => {
    try{
        const exUser = await User.findOne({
            where: {email : req.body.email}
        })
        if(exUser){
            return res.status(403).send('이미 존재하는 이메일 입니다.')
        }
        const exName = await User.findOne({
            where: {name: req.body.name}
        })
        if(exName){
            return res.status(403).send('이미 존재하는 이름 입니다.')
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        await User.create({ //await을 붙이지 않으면 비동기가 되어서 res.json이 먼저 실행됨
            email : req.body.email,
            name : req.body.name,
            password : hashedPassword,
        })
        res.status(201).send('회원가입 성공');
    } catch (error) {
        console.error(error);
        next(error);
    }
})
router.post('/payment', isLoggedIn,  async(req, res, next) => {
    try{
        if(req.body.CartItemId){
        const findCart = await Cart.findOne({
            where: {id : req.body.CartItemId}
        })
            console.log('findCart',findCart)
            if(findCart){
            const findHistoryCart = await HistoryCart.findOne({
                where : {
                            quantity : findCart.quantity,
                            totalPrice : findCart.totalPrice,
                            size : findCart.size,
                            UserId : findCart.UserId,
                            ProductId : findCart.ProductId, 
                }
            })
            if(findHistoryCart){
                         await Payment.create({
                        cancelled : req.body.payment.cancelled,
                        email : req.body.payment.email,
                        paid : req.body.payment.paid,
                        payerID :req.body.payment.payerID,
                        paymentID : req.body.payment.paymentID,
                        paymentToken : req.body.payment.paymentToken,
                        returnUrl : req.body.payment.returnUrl,
                        createdAt : req.body.payment.createdAt,
                        updatedAt : req.body.payment.updatedAt,
                        UserId : req.user!.id,
                        HistoryCartId : findHistoryCart.id
                        })
                }
                await Cart.destroy({
                    where : {[Op.and] : [{id : req.body.CartItemId },{UserId : req.user!.id}]},
                })
            return res.status(200).send('결제성공')
            }
        }
        if(req.body.CartItemsId){
            const findCarts = await Cart.findAll({
                where : {[Op.and] : [{id :  req.body.CartItemsId },{UserId : req.user!.id}]},
                order : [['id', 'DESC']],
            });
            
            const findHistoryCarts = await HistoryCart.findAll({
                where:{
                    [Op.or] : findCarts.map(v => ({
                        quantity : v.quantity,
                        totalPrice:  v.totalPrice,
                        size:  v.size,
                        UserId : req.user!.id,
                        ProductId: v.ProductId,
                        createdAt: v.createdAt,
                    }))
                },
                attributes: ['id'],
                order : [['id', 'DESC']],
            })
            if(findHistoryCarts){
                    
                    await Promise.all(findHistoryCarts.map((cartItemId: HistoryCart, i:number) => {
                    Payment.create({
                        cancelled : req.body.payment.cancelled,
                        email : req.body.payment.email,
                        paid : req.body.payment.paid,
                        payerID :req.body.payment.payerID,
                        paymentID : req.body.payment.paymentID,
                        paymentToken : req.body.payment.paymentToken,
                        returnUrl : req.body.payment.returnUrl,
                        createdAt : req.body.payment.createdAt,
                        updatedAt : req.body.payment.updatedAt,
                        UserId : req.user!.id,
                        HistoryCartId : findHistoryCarts[i]!.id
                    });
                }))
                await Cart.destroy({
                    where : {[Op.and] : [{id :  req.body.CartItemsId },{UserId : req.user!.id}]},
                })
            return res.status(200).send('결제성공')
            }
            }
    }
         catch (error) {
        console.error(error);
        next(error);
    }
})


export default router;
