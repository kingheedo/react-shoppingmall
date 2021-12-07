const express = require('express');
const { Op } = require('sequelize');
const { Product, Image, Review, User } = require('../models');
const router = express.Router();

router.get('/', async (req, res, next) =>{
    try{
        const where = {};
        if(parseInt(req.query.lastId,10)){
            where.id = {[Op.lt] : parseInt(req.query.lastId,10)}
        }
    const products = await Product.findAll({
        where,
        limit: 4,
        order: [['createdAt', 'DESC']],
        include: [{
            model: Image,
        },{
            model: Review,
            include:[{
                model: User,
                attributes: ['id','email']
            }]
        }]
    })
    res.status(202).json(products);
    }catch(error){
        console.error(error);
        next(error)
    }
})

module.exports = router;