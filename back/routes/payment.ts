import * as express from 'express';
import { isLoggedIn } from './middlewares';
import { Address, HistoryCart, Image, Payment, Product } from '../models';
import { Op } from 'sequelize';
const router = express.Router();

/** 결제내역 생성 */
router.post('/', isLoggedIn, async(req, res, next) => {
  try{
    const { 
      cartIds,
      orderId,
      paymentKey,
      paymentType,
      rcName,
      rcPhone,
      rcPostNum,
      rcPostBase,
      rcPostDetail
      } = req.body;

      const addPayments = cartIds.map((cartId:number) => 
        Payment.create({
          orderId,
          paymentKey,
          paymentType,
          rcName,
          rcPhone,
          rcPostNum,
          rcPostBase,
          rcPostDetail,
          HistoryCartId : cartId,
          UserId: req.user!.id,
          isReviewed: false
        })
      )
      await Promise.all(addPayments);

      return res.status(201).send('결제 완료');
      
  }
  catch(error){
    console.error(error);
    next(error);
  }
});

/** orderId에 해당하는 결재 내역 */
router.get('/:orderId', isLoggedIn, async (req, res ,next) => {
  try{
    const payment = await Payment.findAll({
      where: {
        orderId: req.params.orderId
      },
      attributes: {
        exclude: ['HistoryCartId', 'ProductId']
      },
      include: [{
        model: HistoryCart,
        include: [{
          model: Product
        }]
      }]
    });

    return res.status(200).json(payment);
  }
  catch(error){
    console.error(error);
    next(error);
  }
})

/** 모든 결제 내역 조회*/
router.get('/', isLoggedIn,async (req, res, next) => {
  try{
    const startDate = new Date(req.query.startDate as string).setHours(0,0,0,0);
    const endDate = new Date(req.query.endDate as string);
    const payments = await Payment.findAll({
    where: {
      UserId: req.user!.id,
      createdAt: {
        [Op.between]: [new Date(startDate).toISOString(), new Date(endDate).toISOString()]
      }
    },
    limit: 10,
    offset: parseInt((req.query.page as string), 10) * 10,
    order: [
      ['createdAt', 'DESC']
    ],
    attributes: {
      exclude: ['HistoryCartId'],
    },
    include: [{
      model: HistoryCart,
      attributes: {
        exclude: ['ProductId','createdAt', 'updatedAt']
      },
      include: [{
        model: Product,
          attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: [{
          model: Image,
          attributes: {
            exclude: ['ProductId','createdAt', 'updatedAt']
          },
        }]
      }]
    }]
  })
  return res.status(200).json(payments);
  }
catch(error){
  console.error(error);
  next(error);
}
})


export default router;