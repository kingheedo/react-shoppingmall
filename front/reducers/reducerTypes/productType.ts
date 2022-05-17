export interface MainProduct {
    id:number;
  productName: string;
  price : number;
  stock : number;
  UserId: number;
  Images :{src : string}[]
  Likers : any[]
}
export interface RegisterProduct extends MainProduct {
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
  mainProducts: MainProduct[];
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
  searchProductsLoading : boolean;
  searchProductsDone : boolean;
  searchProductsError : any;
}
