import request from '../request';
import { GetAddressesRes, GetUserRes, PatchAddressReq, PatchAddressRes, PostAddAddressReq, PostAddAddressRes, PostLoginReq, PostLoginRes } from './schema';

export const addAddress = async(data: PostAddAddressReq) => {
  return await request.post<PostAddAddressRes>('/user/address',data).then(res => res.data);
};

export const updateAddress = async(data: PatchAddressReq) => {
  return await request.patch<PatchAddressRes>('/user/address',data).then(res => res.data);
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
  updateAddress,
  getAddresses,
  getUser,
  logIn,
  logout,
};