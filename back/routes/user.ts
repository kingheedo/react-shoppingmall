import * as express from 'express'
import { User, Payment, Product, Image, HistoryCart, Review, Cart, sequelize, Address } from '../models';
const router = express.Router();
import * as bcrypt from 'bcrypt';
import * as passport from 'passport';
import {isLoggedIn, isNotLoggedIn} from './middlewares';
import { Op } from 'sequelize';


router.post('/login',isNotLoggedIn, (req, res, next) =>{
   try{
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

router.post('/logout',isLoggedIn, (req, res, next) => {
    req.logout((err) => {
		if (err) {
			return res.redirect("/");
		} else {
			return res.status(200).send("server ok: 로그아웃 완료");
		}
	});
    // req.session.destroy(() =>{
    //     return res.status(201).send('로그아웃 완료.')
    // });
    
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
            return res.status(202).json(paymentLists)
    } catch (error) {
        console.error(error);
        next(error);
    }
})

router.get('/address', isLoggedIn, async(req, res, next) => {
    try{
        const getAddresses = await Address.findAll({
            where: {
                UserId: req.user?.id
            }
        })
        
        return res.status(200).json(getAddresses);
    }
    catch(error){
        console.error(error);
        next(error);
    }
})

router.post('/address', isLoggedIn, async(req, res, next) => {
    try{
        if(req.body.rcPostNum && req.body.rcPostBase && req.body.rcPostDetail){
            const address =  await Address.findOne({
                where: {
                    [Op.and]: [
                        {rcPostNum: req.body.rcPostNum}, 
                        {rcPostBase: req.body.rcPostBase}, 
                        {rcPostDetail: req.body.rcPostDetail}
                    ]
                }
            })
            if(address){
                return res.status(200).send('이미 존재하는 주소입니다.');
            }
        };

        const createdAddress =  await Address.create({
            rcName: req.body.rcName,
            rcPhone: req.body.rcPhone,
            rcPostNum: req.body.rcPostNum,
            rcPostBase: req.body.rcPostBase,
            rcPostDetail: req.body.rcPostDetail,
            UserId: req.user!.id
        });

        if(req.body.base && createdAddress){
            await User.update({
                addressId: createdAddress.id
            },{
                where: {
                    id: req.user!.id
                }
            })
        }

        return res.status(200).send('주소 추가 완료');
    }
    catch(error){
        console.error(error);
        next(error);
    }
})

router.patch('/address', isLoggedIn, async (req, res, next) => {
    try{
        await Address.update({
            rcName: req.body.rcName,
            rcPhone: req.body.rcPhone,
            rcPostNum: req.body.rcPostNum,
            rcPostBase: req.body.rcPostBase,
            rcPostDetail: req.body.rcPostDetail,
        },{
            where: {
                id: req.body.id,
                UserId: req.user!.id
            }
        });

        if(req.body.base && req.body.id){
            await User.update({
                addressId: req.body.id
            }, {
                where: {
                    id: req.user!.id
                }
            })
        }

        return res.status(200).send('배송지 수정완료');
    }
    catch(error){
        console.error(error);
        next(error);
    }
})

router.get('/', async(req, res, next) =>{
    try{
        if(req.user){
            let userInfo = {};
            let address;
            const info = await User.findOne({
                where : {id : req.user.id},
                attributes: {
                    exclude : ['password','createdAt','updatedAt']
                }
            });
            const cartLength = await Cart.count({
                where: {UserId: req.user.id}
            });
            if(info?.addressId){
                address = await Address.findOne({
                    where: {
                        id: info?.addressId,
                        UserId: req.user.id
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'UserId']
                    }
                });
            }
            if(address){
                userInfo = {
                   info,
                   cartLength,
                   address
               };
            }else{
                userInfo = {
                   info,
                   cartLength,
               };
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
        return res.status(201).send('회원가입 성공');
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
