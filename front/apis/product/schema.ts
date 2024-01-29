export enum SizeOption {
  SM = 'SM',
  M = 'M',
  L = 'L',
  XL = 'XL',
}

export type ReviewType = {
    id: number;
    content: string;
    rate: number;
    createdAt: string;
    updatedAt: string;
    UserId: number;
    ProductId: number;
    User: {
        email: string;
        HistoryCart: {
            size: string;
            quantity: number;
        }[];
    },
    ReviewImages: {
        src: string;
    }[]
}
export type GetProductsReq = number;
export type GetProductsRes = Omit<GetSingleProductRes,'Likers' & 'Sizes'>

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
    Reviews: ReviewType[];
}

export type PostReviewReq = {
  content: string;
  rate: number;
  productId: number;
  paymentId: number;
  image: string[];
}

export type PostReviewRes = string;