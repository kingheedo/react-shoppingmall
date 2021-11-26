const express = require('express');
const { User } = require('../models');
const router = express.Router();
const bcrypt = require('bcrypt')
router.post('/',  async(req, res, next) => {
    try{
        const exUser = await User.findOne({
            where: {email : req.body.email}
        })
        if(exUser){
            return res.status(404).send('이미 존재하는 이메일 입니다.')
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
