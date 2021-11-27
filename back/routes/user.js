const express = require('express');
const { User } = require('../models');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

router.post('/logout',(req, res, next) => {
    req.logout();
    req.session.destroy();
    res.status(201).send('로그아웃 완료.')
})

router.post('/login', (req, res, next) =>{
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
    
router.post('/',  async(req, res, next) => {
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


module.exports = router;
