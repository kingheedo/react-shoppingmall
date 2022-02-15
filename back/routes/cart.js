const express = require('express');
const { Op } = require('sequelize');
const Sequelize = require('sequelize')
const { Product, Cart, User, Image, HistoryCart } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', isLoggedIn, async(req, res, next) => {
    try{
        const fullCartitem = await Cart.findAll({
            where : {UserId: req.user.id,},
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

        const exHistoryCartItem = await HistoryCart.findOne({
            where : {[Op.and]: [{UserId: req.user.id, ProductId : req.body.productId}, {size: req.body.size}]},
        })
        exHistoryCartItem 
        ?
            await exHistoryCartItem.increment({
            totalPrice : req.body.totalPrice,
            quantity : req.body.quantity
        })
        :
        await HistoryCart.create({
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

router.delete('/:cartItemId', isLoggedIn, async(req, res, next) => {
    try{
        await Cart.destroy({
            where: {id : req.params.cartItemId},
            UserId : req.user.id
        })
        res.status(200).json({CartItemId: parseInt(req.params.cartItemId,10)})
    }catch(error){
        console.error(error);   
        next(error)
    }
})

module.exports = router;