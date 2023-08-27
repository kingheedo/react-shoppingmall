import request from '../request';
import { AddItmToCartReq, GetCartListRes } from './schema';

const addItmtoCart = async (data: AddItmToCartReq) => {
  return await request.post<any>('/cart', data).then((res) => res.data);
};

const getCartList = async () => {
  return await request.get<GetCartListRes[]>('/cart').then((res) => res.data);
};

/* 카트 아이템 삭제 */
const deleteItem = async (id: number) => {
  return await request.delete(`/cart/${id}`).then((res) => res.data);
};

export default {
  addItmtoCart,
  getCartList,
  deleteItem,
};
