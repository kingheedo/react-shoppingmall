import * as express from 'express';
import {Request} from 'express';
const { Op } = require('sequelize');
import { Product, Image, Review, User } from '../models';
const router = express.Router();

router.get('/', async (req: Request<any,any,any,{id : string}>, res, next) =>{
    try{
        let where = {};
        if(parseInt(req.query.id,10)){
            where = {
                id : {[Op.gt] : parseInt(req.query.id,10)}
            }
        }
    const products = await Product.findAll({
        where,
        limit: 4,
        order: [['id', 'ASC']],
        include: [{
            model: Image,
        },
        {
            model: User,
            through: { // 다대다 table의 모든정보 가져오지 않기(좋아요 누른 사람의 아이디만 가져오기 ex {id: 1})
                attributes: []
            },
            attributes: ['id'],
            as: 'Likers'
        }]
    })
    return res.status(202).json(products);
    }catch(error){
        console.error(error);
        next(error)
    }
})

export default router;