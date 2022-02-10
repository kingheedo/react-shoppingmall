export interface UserCart {
 id: number;
 quantity: number;
 totalPrice : number;
 size :number;
 Product: {
     productName: string
price: number
stock: number
     Images:{
         src: string
     }[]
 }
 UserId: number;
 ProductId : number;
}
export interface CartState {
  userCart: UserCart[],
  cartTotalPrice: number,
  cartTotalDeliveryFee: number,
  loadCartProductsLoading: boolean,
  loadCartProductsDone: boolean,
  loadCartProductsError: any,
  addProductCartLoading: boolean,
  addProductCartDone: boolean,
  addProductCartError: any,
  deleteCartProductLoading:boolean,
deleteCartProductDone:boolean,
deleteCartProductError: any,
}
export const DELETE_CART_PRODUCT_REQUEST = 'DELETE_CART_PRODUCT_REQUEST' as const;
export const DELETE_CART_PRODUCT_SUCCESS = 'DELETE_CART_PRODUCT_SUCCESS' as const;
export const DELETE_CART_PRODUCT_FAILURE = 'DELETE_CART_PRODUCT_FAILURE' as const;

export const LOAD_CART_PRODUCTS_REQUEST = 'LOAD_CART_PRODUCTS_REQUEST' as const;
export const LOAD_CART_PRODUCTS_SUCCESS = 'LOAD_CART_PRODUCTS_SUCCESS' as const;
export const LOAD_CART_PRODUCTS_FAILURE = 'LOAD_CART_PRODUCTS_FAILURE' as const;

export const CHECK_CART_PRODUCT = 'CHECK_CART_PRODUCT' as const;
export const UNCHECK_CART_PRODUCT = 'UNCHECK_CART_PRODUCT' as const;
export const CHECK_ALL_PRODUCTS = 'CHECK_ALL_PRODUCTS' as const;
export const UNCHECK_ALL_PRODUCTS = 'UNCHECK_ALL_PRODUCTS' as const;

export const ADD_PRODUCT_CART_REQUEST = 'ADD_PRODUCT_CART_REQUEST' as const;
export const ADD_PRODUCT_CART_SUCCESS = 'ADD_PRODUCT_CART_SUCCESS' as const;
export const ADD_PRODUCT_CART_FAILURE = 'ADD_PRODUCT_CART_FAILURE' as const;

export interface DeleteCartProductRequest{
    type : typeof DELETE_CART_PRODUCT_REQUEST;
}
export interface DeleteCartProductSuccess{
  type : typeof DELETE_CART_PRODUCT_SUCCESS;
  data : {CartItemId: number}
}
export interface DeleteCartProductFailure{
  type : typeof DELETE_CART_PRODUCT_FAILURE;
  error : Error
}

export interface LoadCartProductsRequest{
  type : typeof LOAD_CART_PRODUCTS_REQUEST;
}
export interface LoadCartProductsSuccess{
  type : typeof LOAD_CART_PRODUCTS_SUCCESS;
  data : UserCart[];
}
export interface LoadCartProductsFailure{
  type : typeof LOAD_CART_PRODUCTS_FAILURE;
  error : Error;
}

export interface CheckCartProduct{
  type : typeof CHECK_CART_PRODUCT;
  data: {id: number};
}
export interface UncheckCartProduct{
  type : typeof UNCHECK_CART_PRODUCT
  data : {id: number};
}
export interface CheckAllProducts{
  type : typeof CHECK_ALL_PRODUCTS
}
export interface UncheckAllProducts{
  type : typeof UNCHECK_ALL_PRODUCTS
}
export interface AddProductCartRequest{
  type : typeof ADD_PRODUCT_CART_REQUEST
}
export interface AddProductCartSuccess{
  type : typeof ADD_PRODUCT_CART_SUCCESS;
  data : UserCart
}
export interface AddProductCartFailure{
  type : typeof ADD_PRODUCT_CART_FAILURE;
  error :Error
}
export type CartAction = DeleteCartProductRequest | DeleteCartProductSuccess | DeleteCartProductFailure | LoadCartProductsRequest | LoadCartProductsSuccess | LoadCartProductsFailure | CheckCartProduct | UncheckCartProduct | CheckAllProducts | UncheckAllProducts | AddProductCartRequest | AddProductCartSuccess | AddProductCartFailure;
