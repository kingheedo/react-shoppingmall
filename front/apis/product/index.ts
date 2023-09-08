import request from '../request';
import { GetProductsReq, GetProductsRes, GetSingleProductReq, GetSingleProductRes, PostAddLikeReq, PostAddLikeRes } from './schema';

const addLike = async(productId:PostAddLikeReq) => await request.post<PostAddLikeRes>(`/product/like/${productId}`).then(res => res.data);
const unLike = async(productId: number) => await request.post(`/product/unlike/${productId}`).then(res => res.data);
const getSingleProduct = async(id: GetSingleProductReq) => await request.get<GetSingleProductRes>(`/product/${id}`).then(res => res.data);
const getProducts = async (id?: GetProductsReq) => await request.get<GetProductsRes[]>(`/products?id=${id || 0}`, { baseURL: process.env.NEXT_PUBLIC_SERVER_URL }).then(res => res.data);

export default {
  getProducts,
  getSingleProduct,
  addLike,
  unLike
};