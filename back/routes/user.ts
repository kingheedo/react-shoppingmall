import * as express from 'express'
import { User, Payment, Product, Image, HistoryCart, Review } from '../models';
const router = express.Router();
import * as bcrypt from 'bcrypt';
import * as passport from 'passport';
import {isLoggedIn, isNotLoggedIn} from './middlewares';
import { Op } from 'sequelize';

router.get('/', async(req, res, next) =>{
     try{
         if(req.user){
        const user = await User.findOne({
         where : {id : req.user.id},
         attributes: {
             exclude : ['password']
         }
        })
        res.status(200).json(user);
         }else{
             res.status(200).json(null);
         }
         
     }catch(error){
         console.error(error);
         next(error);
     }
})

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
             res.status(202).json(paymentLists)
    } catch (error) {
        console.error(error);
        next(error);
    }
})
router.post('/logout',isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy(() =>{
        return res.status(201).send('로그아웃 완료.')
    });
    
})

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
            const findHistoryCartId = await HistoryCart.findOne({
                where : {id : req.body.CartItemId}
            })
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
                    HistoryCartId : findHistoryCartId!.id
                    })
        }

        
        if(req.body.CartItemsId){
            const findHistoryCart = await HistoryCart.findAll({
                where : {[Op.and] : [{id : {[Op.or]: req.body.CartItemsId }},{UserId : req.user!.id}]},
            })
            await Promise.all(
                req.body.CartItemsId.map((cartItemId:number,i:number) => 
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
                    HistoryCartId : findHistoryCart[i].id
                    })
                )
            )
            // await findHistoryCart.addPayments(payments)
        }
             
        res.status(200).send('결제성공')
    } catch (error) {
        console.error(error);
        next(error);
    }
})


export default router;
