import request from '../request';
import { AddItmToCartReq, ChangeOption, GetCartListRes } from './schema';

/** 장바구니에 추가하기 */
const addItmtoCart = async (data: AddItmToCartReq) => {
  return await request.post<any>('/cart', data).then((res) => res.data);
};

/** 장바구니 리스트 가져오기 */
const getCartList = async () => {
  return await request.get<GetCartListRes[]>('/cart').then((res) => res.data);
};

/* 장바구니 아이템 삭제 */
const deleteItem = async (id: number) => {
  return await request.delete(`/cart/${id}`).then((res) => res.data);
};

/** 옵션 변경 */
const changeOption = async(data: ChangeOption) => {
  return await request.post('/cart/change', data).then(res => res.data);
};

export default {
  addItmtoCart,
  getCartList,
  deleteItem,
  changeOption
};
