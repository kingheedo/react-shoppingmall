import request from '../request';
import { GetAddressesRes, GetUserRes, PostAddressReq, PostAddressRes, PostLoginReq, PostLoginRes } from './schema';

export const addAddress = async(data: PostAddressReq) => {
  return await request.post<PostAddressRes>('/user/address',data).then(res => res.data);
};

export const getAddresses = async() => {
  return await request.get<GetAddressesRes>('/user/address').then(res => res.data);
};

export const getUser = async() => {
  return await request.get<GetUserRes>('/user').then(res => res.data);
};

export const logIn = async(data: PostLoginReq) => {
  return await request.post<PostLoginRes>('/user/login', data).then(res => res.data);
};
export const logout = async() => {
  return await request.post('/user/logout').then((res) => res.data);
};

export default {
  addAddress,
  getAddresses,
  getUser,
  logIn,
  logout,
};