import * as express from 'express';
import { isLoggedIn } from './middlewares';
import { Address, Payment } from '../models';
const router = express.Router();

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
          UserId: req.user!.id
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

router.get('/:orderId', isLoggedIn, async (req, res ,next) => {
  try{
    const payment = await Payment.findOne({
      where: {
        orderId: req.params.orderId
      }
    });

    return res.status(200).json(payment);
  }
  catch(error){
    console.error(error);
    next(error);
  }
})


export default router;