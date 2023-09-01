import { SizeOption } from '../product/schema';

export enum Size {
  SM = 'SM',
  M = 'M' ,
  L = 'L' ,
  XL = 'XL'
}

export type AddItmToCartReq = {
  productId: number;
  size: SizeOption | '';
  totalPrice: number;
  quantity: number;
};

export type GetCartListRes = {
  id: number;
  quantity: number;
  size: Size;
  totalPrice: number;
  Product: {
    Sizes: {
      option: Size;
    }[];
    Images: {
      src: string;
    }[];
    id: number;
    price: number;
    productName: string;
    stock: number;
  };
};

export type ChangeOption = {
  id: number;
  productId: number;
  quantity: number;
  size: Size;
  totalPrice: number;
}