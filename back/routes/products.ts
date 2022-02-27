import * as express from 'express';
import {Request} from 'express';
const { Op } = require('sequelize');
import { Product, Image, Review, User } from '../models';
const router = express.Router();

router.get('/', async (req: Request<any,any,any,{lastId : string}>, res, next) =>{
    try{
        let where = {};
        if(parseInt(req.query.lastId,10)){
            where = {
                id : {[Op.lt] : parseInt(req.query.lastId,10)}
            }
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
        },]
    })
    res.status(202).json(products);
    }catch(error){
        console.error(error);
        next(error)
    }
})

export default router;