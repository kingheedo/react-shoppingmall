const express = require('express');
const { User, Payment, Cart, Product, Image } = require('../models');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const {} = require('./middlewares')
const {isLoggedIn, isNotLoggedIn} = require('./middlewares')
const { Op } = require('sequelize');
const { findAll } = require('../models/cart');

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

router.post('/logout',isLoggedIn, (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.status(201).send('로그아웃 완료.')
})

router.post('/login',isNotLoggedIn, (req, res, next) =>{
    passport.authenticate('local', (err, user, info) =>{
    if(err){
        console.error(err);
        return next(err)
    }
    if(info){
        return res.status(401).send(info.reason);
    }
    return req.logIn(user, async (loginErr) => {
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
             await Promise.all(
                req.body.CartItemsId.map(cartItemId => 
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
                    UserId : req.user.id,
                    CartId : cartItemId,
                    })
                )
            )
        res.status(200).send('결제성공')
    } catch (error) {
        console.error(error);
        next(error);
    }
})

router.get('/paymentsList', isLoggedIn,  async(req, res, next) => {
    try{
             const paymentLists = await Payment.findAll({
                 where : {UserId: req.user.id},
                 include: [{
                     model: Cart,
                     include : [{
                         model : Product,
                         attributes : ['id','productName'],
                         include:[{
                             model: Image
                         }]
                     }]
                 }]
             })
             res.status(202).json(paymentLists)
    } catch (error) {
        console.error(error);
        next(error);
    }
})


module.exports = router;
