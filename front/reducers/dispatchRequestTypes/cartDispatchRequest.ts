import {
  AddProductCartRequest, ADD_PRODUCT_CART_REQUEST, CheckAllProducts, CheckCartProduct, CHECK_ALL_PRODUCTS, CHECK_CART_PRODUCT, DeleteCartProductRequest, DELETE_CART_PRODUCT_REQUEST, LoadCartProductsRequest, LOAD_CART_PRODUCTS_REQUEST, UncheckAllProducts, UncheckCartProduct, UNCHECK_ALL_PRODUCTS, UNCHECK_CART_PRODUCT,
} from '../asyncActionTypes/cartTypes';

export interface AddProductData{
        productId : number,
        size: string,
        quantity : number,
        totalPrice : number,
    }

export interface Addproduct extends AddProductCartRequest{
    data: AddProductData
}

export interface ProductData{
    id: number;
}

export interface DeleteCartProduct extends DeleteCartProductRequest{
  data : ProductData
}
export const addProduct = (data:AddProductData):Addproduct => {
  return {
    type: ADD_PRODUCT_CART_REQUEST,
    data,
  };
};

export const checkAllProduct = ():CheckAllProducts => {
  return {
    type: CHECK_ALL_PRODUCTS,
  };
};

export const unCheckAllProduct = ():UncheckAllProducts => {
  return {
    type: UNCHECK_ALL_PRODUCTS,
  };
};

export const checkCartProduct = (data:ProductData):CheckCartProduct => {
  return {
    type: CHECK_CART_PRODUCT,
    data,
  };
};

export const uncheckCartProduct = (data:ProductData):UncheckCartProduct => {
  return {
    type: UNCHECK_CART_PRODUCT,
    data,
  };
};
export const deleteCartProduct = (data : ProductData):DeleteCartProduct => {
  return {
    type: DELETE_CART_PRODUCT_REQUEST,
    data,
  };
};
export const loadCartProducts = ():LoadCartProductsRequest => {
  return {
    type: LOAD_CART_PRODUCTS_REQUEST,
  };
};
