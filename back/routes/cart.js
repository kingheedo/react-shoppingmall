const express = require('express');
const { Op } = require('sequelize');
const Sequelize = require('sequelize')
const { Product, Cart, User, Image } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/', isLoggedIn, async(req, res, next) => {
    try{
        const exCartItem = await Cart.findOne({
            where : {[Op.and]: [{UserId: req.user.id, ProductId : req.body.productId}, {size: req.body.size}]},
        })
        exCartItem 
        ?
            await exCartItem.increment({
            totalPrice : req.body.totalPrice,
            quantity : req.body.quantity
        })
        :
        await Cart.create({
            UserId : req.user.id,
            ProductId : parseInt(req.body.productId,10),
            size: req.body.size,
            totalPrice : req.body.totalPrice,
            quantity: req.body.quantity
        })
        const fullCartitem = await Cart.findOne({
            where : {[Op.and]: [{UserId: req.user.id, ProductId : req.body.productId}, {size: req.body.size}]},
            include: [{
                model: Product,
                include: [{
                    model: Image,
                }]
            }]
        })
        res.status(202).json(fullCartitem)
    }catch(error){
        console.error(error);   
        next(error)
    }
})

module.exports = router;