import { SizeOption } from "../product/schema";

export type AddItmToCartReq = {
    productId: number;
    size: SizeOption | '';
    totalPrice: number;
    quantity: number;
}