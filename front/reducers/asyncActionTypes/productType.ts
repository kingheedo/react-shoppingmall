export const REMOVE_IMAGE = 'REMOVE_IMAGE' as const;
export const SEARCH_PRODUCTS_REQUEST = 'SEARCH_PRODUCTS_REQUEST' as const;
export const SEARCH_PRODUCTS_SUCCESS = 'SEARCH_PRODUCTS_SUCCESS' as const;
export const SEARCH_PRODUCTS_FAILURE = 'SEARCH_PRODUCTS_FAILURE' as const;
export const REGISTER_PRODUCT_REQUEST = 'REGISTER_PRODUCT_REQUEST' as const;
export const REGISTER_PRODUCT_SUCCESS = 'REGISTER_PRODUCT_SUCCESS' as const;
export const REGISTER_PRODUCT_FAILURE = 'REGISTER_PRODUCT_FAILURE' as const;
export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST' as const;
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS' as const;
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE' as const;
export const LOAD_PRODUCTS_REQUEST = 'LOAD_PRODUCTS_REQUEST' as const;
export const LOAD_PRODUCTS_SUCCESS = 'LOAD_PRODUCTS_SUCCESS' as const;
export const LOAD_PRODUCTS_FAILURE = 'LOAD_PRODUCTS_FAILURE' as const;
export const LOAD_PRODUCT_REQUEST = 'LOAD_PRODUCT_REQUEST' as const;
export const LOAD_PRODUCT_SUCCESS = 'LOAD_PRODUCT_SUCCESS' as const;
export const LOAD_PRODUCT_FAILURE = 'LOAD_PRODUCT_FAILURE' as const;

export interface MainProducts {
    id:number;
  productName: string;
  price : number;
  stock : number;
  UserId: number;
  Images :{src : string}[]
  Likers : any[]
}
export interface RegisterProduct extends MainProducts {
  Sizes : {option:string}[]
}
export interface SingleProduct extends RegisterProduct{
  Reviews : {id:number, email:string, rate :number}[]
}
export interface SearchProducts {
  id:number;
  productName : string;
}
export interface ProductState {
  mainProducts: MainProducts[];
  singleProduct: null | SingleProduct;
  imagePath: string[];
  searchProductsList: SearchProducts[];
  hasMoreProducts: boolean;
  registerProductLoading: boolean;
  registerProductDone: boolean;
  registerProductError: any;
  uploadImagesLoading: boolean;
  uploadImagesDone: boolean;
  uploadImagesError: any;
  loadProductsLoading: boolean;
  loadProductsDone: boolean;
  loadProductsError: any;
  loadProductLoading: boolean;
  loadProductDone: boolean;
  loadProductError: any;
  searchProductLoading : boolean;
  searchProductDone : boolean;
  searchProductError : any;
}

export interface SearchProductsRequest {
  type: typeof SEARCH_PRODUCTS_REQUEST;
}
export interface SearchProductsSuccess {
  type: typeof SEARCH_PRODUCTS_SUCCESS;
  data: SearchProducts[];
}
export interface SearchProductsFailure {
  type: typeof SEARCH_PRODUCTS_FAILURE;
  error: Error;
}
export interface RegisterProductRequest {
  type: typeof REGISTER_PRODUCT_REQUEST;
}
export interface RegisterProductSuccess {
  type: typeof REGISTER_PRODUCT_SUCCESS;
  data: RegisterProduct;
}
export interface RegisterProductFailure {
  type: typeof REGISTER_PRODUCT_FAILURE;
  error: Error;
}
export interface UploadImagesRequest {
  type: typeof UPLOAD_IMAGES_REQUEST;
}
export interface UploadImagesSuccess {
  type: typeof UPLOAD_IMAGES_SUCCESS;
  data: string[];
}
export interface UploadImagesFailure {
  type: typeof UPLOAD_IMAGES_FAILURE;
  error: Error;
}

export interface LoadProductsRequest {
  type: typeof LOAD_PRODUCTS_REQUEST;
}
export interface LoadProductsSuccess {
  type: typeof LOAD_PRODUCTS_SUCCESS;
  data: MainProducts[];
}
export interface LoadProductsFailure {
  type: typeof LOAD_PRODUCTS_FAILURE;
  error: Error
}
export interface LoadProductRequest {
  type: typeof LOAD_PRODUCT_REQUEST;
}
export interface LoadProductSuccess {
  type: typeof LOAD_PRODUCT_SUCCESS;
  data: SingleProduct;
}
export interface LoadProductFailure {
  type: typeof LOAD_PRODUCT_FAILURE;
  error: Error
}

export interface RemoveImage {
  type: typeof REMOVE_IMAGE;
  data: number;
}

export type ProductAction = SearchProductsRequest | SearchProductsSuccess | SearchProductsFailure | RegisterProductRequest | RegisterProductSuccess | RegisterProductFailure | UploadImagesRequest | UploadImagesSuccess | UploadImagesFailure | LoadProductsRequest | LoadProductsSuccess | LoadProductsFailure | LoadProductRequest | LoadProductSuccess | LoadProductFailure | RemoveImage
