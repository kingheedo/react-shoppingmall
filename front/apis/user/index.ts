import { AxiosRequestConfig } from 'axios';
import request from '../request';
import { GetAddressesRes, GetUserRes, PatchAddressReq, PatchAddressRes, PostAddAddressReq, PostAddAddressRes, PostLoginReq, PostLoginRes, PostSignUpReq, PostSignUpRes } from './schema';

const addAddress = async(data: PostAddAddressReq) => {
  return await request.post<PostAddAddressRes>('/user/address',data).then(res => res.data);
};

const updateAddress = async(data: PatchAddressReq) => {
  return await request.patch<PatchAddressRes>('/user/address',data).then(res => res.data);
};

const getAddresses = async() => {
  return await request.get<GetAddressesRes>('/user/address').then(res => res.data);
};

const getUser = async(options?: AxiosRequestConfig) => {
  return await request.get<GetUserRes>('/user', options).then(res => res.data);
};

const signUp = (data: PostSignUpReq) => {
  return request.post<PostSignUpRes>('/user', data).then(res => res.data);
};

const logIn = async(data: PostLoginReq) => {
  return await request.post<PostLoginRes>('/user/login', data).then(res => res.data);
};
const logout = async() => {
  return await request.post('/user/logout').then((res) => res.data);
};

export default {
  addAddress,
  updateAddress,
  getAddresses,
  getUser,
  signUp,
  logIn,
  logout,
};