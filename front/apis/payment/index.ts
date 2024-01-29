import axios from 'axios';
import request from '../request';
import { CancelTossPmntOrderReq, GetAllPaymentsReq, GetAllPaymentsRes, GetPaymentsReq, GetPaymentsRes, GetTossPmntOrderReq, GetTossPmntOrderRes, PostPaymentReq, PostPaymentRes } from './schema';

/** 결제 내역 추가 */
const addPayment = async(data: PostPaymentReq) => {
  return await request.post<PostPaymentRes>('/payment', data).then(res => res.data);
};

/** orderId의 결재 내역 불러오기 */
const getPayments = async(orderId:GetPaymentsReq) => {
  return await request.get<GetPaymentsRes>(`/payment/${orderId}`).then(res => res.data);
};

/** 모든 결재내역 */
const getAllPayments = async(data: GetAllPaymentsReq) => {
  return await request.get<GetAllPaymentsRes>(`/payment/?startDate=${data.startDate}&endDate=${data.endDate}&page=${data.page}`).then(res => res.data);
};

/** 토스 결재내역조회
 * 
 * orderId로 조회
 */
const getTossPmntOrder = (orderId: GetTossPmntOrderReq) => {
  return axios.get<GetTossPmntOrderRes>(`https://api.tosspayments.com/v1/payments/orders/${orderId}`, {
    headers: {
      Authorization: 'Basic dGVzdF9za192Wm5qRUplUVZ4S2tOUjZMNGJlRDNQbU9vQk4wOg=='
    }
  }).then(res => res.data);
};

/** 토스 결제 취소
 * 
 * paymentKey로 취소
 */
const cancelTossPmntOrder = (paymentKey:CancelTossPmntOrderReq) => {
  return axios.post(`https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`,
    {
      cancelReason: '고객요청'
    },
    {
      headers: {
        Authorization: 'Basic dGVzdF9za192Wm5qRUplUVZ4S2tOUjZMNGJlRDNQbU9vQk4wOg==',
      }  
    }).then(res => res.data);
};

export default {
  addPayment,
  getPayments,
  getAllPayments,
  getTossPmntOrder,
  cancelTossPmntOrder
};