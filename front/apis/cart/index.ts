import request from "../request"
import { AddItmToCartReq } from "./schema"

const addItmtoCart = async(data: AddItmToCartReq) => {
 return await request.post<any>('/cart',data).then(res => res.data);
}

export default {
    addItmtoCart
}