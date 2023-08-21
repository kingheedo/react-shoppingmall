import { SizeOption } from "../product/schema";

export type AddItmToCartReq = {
    productId: number;
    size: SizeOption | '';
    totalPrice: number;
    quantity: number;
}

export type GetCartListRes = {
    id: number;
    quantity: number;
    size: string;
    totalPrice: number;
    Product : {
        Images: {
            src: string;
        }[];
        id: number;
        price: number;
        productName: string;
        stock:number;
    }
}