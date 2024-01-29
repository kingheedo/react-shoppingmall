import request from '../request';
import { GetProductsReq, GetProductsRes, GetSingleProductReq, GetSingleProductRes, PostAddLikeReq, PostAddLikeRes, PostReviewReq, PostReviewRes } from './schema';

/** 좋아요 클릭 */
const addLike = async(productId:PostAddLikeReq) => await request.post<PostAddLikeRes>(`/product/like/${productId}`).then(res => res.data);
/** 좋아요 취소 */
const unLike = async(productId: number) => await request.post(`/product/unlike/${productId}`).then(res => res.data);
/** 단일 상품 불러오기 */
const getSingleProduct = async(id: GetSingleProductReq) => await request.get<GetSingleProductRes>(`/product/${id}`).then(res => res.data);
/** 여러 상품 불러오기 */
const getProducts = async (id?: GetProductsReq) => await request.get<GetProductsRes[]>(`/products?id=${id || 0}`, { baseURL: process.env.NEXT_PUBLIC_SERVER_URL }).then(res => res.data);
/** 리뷰 불러오기 */
const getReviews = async() => await request.get('product/lists').then(res => res.data);
/** 리뷰 작성하기 */
const postReview = async(data: PostReviewReq) => await request.post<PostReviewRes>(`/product/${data.productId}/review`,data).then(res => res.data);
/** 리뷰 이미지 등록 */
const postReviewImage = (data: FormData) => request.post<string>('/product/review/images', data).then(res => res.data);
export default {
  getProducts,
  getSingleProduct,
  addLike,
  unLike,
  getReviews,
  postReview,
  postReviewImage
};