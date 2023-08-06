import request from "../request";
import { GetSingleProductReq, GetSingleProductRes, PostAddLikeReq, PostAddLikeRes } from "./schema";

const addLike = async(productId:PostAddLikeReq) => await request.post<PostAddLikeRes>(`/product/like/${productId}`).then(res => res.data);
const unLike = async(productId: number) => await request.post(`/product/unlike/${productId}`).then(res => res.data);
const getSingleProduct = async(id: GetSingleProductReq) => await request.get<GetSingleProductRes>(`/product/${id}`).then(res => res.data);

export default {
    addLike,
    unLike,
    getSingleProduct
}