import {
  LoadProductRequest, LoadProductsRequest, LOAD_PRODUCTS_REQUEST, LOAD_PRODUCT_REQUEST, RegisterProductRequest, REGISTER_PRODUCT_REQUEST, RemoveImage, REMOVE_IMAGE, SearchProductsRequest, SEARCH_PRODUCTS_REQUEST, UploadImagesRequest, UPLOAD_IMAGES_REQUEST,
} from '../asyncActionTypes/productType';

export interface SearchProducts extends SearchProductsRequest {
  name : string
}
export interface RegisterProduct extends RegisterProductRequest {
  data : FormData
}
export interface UploadImages extends UploadImagesRequest{
    data : FormData;
}

export interface LoadProducts extends LoadProductsRequest{
    lastId? : number
}
export interface LoadProduct extends LoadProductRequest{
    id: string
}

export const searchProduct = (name:string):SearchProducts => {
  return {
    type: SEARCH_PRODUCTS_REQUEST,
    name,
  };
};

export const registerProduct = (data:FormData):RegisterProduct => {
  return {
    type: REGISTER_PRODUCT_REQUEST,
    data,
  };
};

export const uploadImages = (data:FormData):UploadImages => {
  return {
    type: UPLOAD_IMAGES_REQUEST,
    data,
  };
};

export const removeImages = (data:number):RemoveImage => {
  return {
    type: REMOVE_IMAGE,
    data,
  };
};

export const loadProducts = (lastId?: number):LoadProducts => {
  if (lastId) {
    return {
      type: LOAD_PRODUCTS_REQUEST,
      lastId,
    };
  }
  return {
    type: LOAD_PRODUCTS_REQUEST,
  };
};

export const loadProduct = (id: string):LoadProduct => {
  return {
    type: LOAD_PRODUCT_REQUEST,
    id,
  };
};
