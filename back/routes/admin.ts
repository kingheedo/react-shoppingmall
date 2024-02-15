import * as express from 'express';
import * as bcrypt from 'bcrypt';
import * as passport from 'passport';
import { isLoggedIn, isNotLoggedIn } from './middlewares';
import {  Image, Product, Size, User } from '../models';
const router = express.Router();

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