import request from '../request';
import { GetPaymentsReq, GetPaymentsRes, PostPaymentReq, PostPaymentRes } from './schema';

/** 결제 내역 추가 */
const addPayment = async(data: PostPaymentReq) => {
  return await request.post<PostPaymentRes>('/payment', data).then(res => res.data);
};

/** 결재 내역 불러오기 */
const getPayments = async(orderId:GetPaymentsReq) => {
  return await request.get<GetPaymentsRes>(`/payment/${orderId}`).then(res => res.data);
};

export default {
  addPayment,
  getPayments
};