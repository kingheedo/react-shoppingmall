export enum SizeOption {
  SM = 'SM',
  M = 'M',
  L = 'L',
  XL = 'XL',
}

export type GetProductsReq = number;
export type GetProductsRes = {
  id : number;
  UserId: number;
  price: number;
  productName: string;
  stock: number,
  Images: {
    src: string
  }[];
  Likers: {
  id: number;
}[]
};

export type PostAddLikeReq = number;
export type PostAddLikeRes = string;

export type PostUnlLikeReq = number;
export type PostUnlLikeRes = string;

export type GetSingleProductReq = string;
export type GetSingleProductRes = {
    id: number;
    productName: string;
    price: number;
    stock: number;
    Sizes: {
        option: SizeOption;
    }[];
    Likers: {
        id:number;
        email: string;
    }[];
    Images:{
        id: number;
        src: string;
        ProductId: number;
    }[];
}