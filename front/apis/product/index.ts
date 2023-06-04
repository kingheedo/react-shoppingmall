import request from "../request";
import { PostAddLikeReq, PostAddLikeRes } from "./schema";

const addLike = async(productId:PostAddLikeReq) => await request.post<PostAddLikeRes>(`/product/like/${productId}`).then(res => res.data);
const unLike = async(productId: number) => await request.post(`/product/unlike/${productId}`).then(res => res.data);

export default {
    addLike,
    unLike
}