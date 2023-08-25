export type TmainProduct = {
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
}
// export interface RegisterProduct extends MainProduct {
//   Sizes : {option:string}[]
// }
// export interface SingleProduct extends RegisterProduct{
//   Reviews : {id:number, email:string, rate :number}[]
// }
// export interface SearchProducts {
//   id:number;
//   productName : string;
// }
// export interface ProductState {
//   mainProducts: MainProduct[];
//   singleProduct: null | SingleProduct;
//   imagePath: string[];
//   searchProductsList: SearchProducts[];
//   hasMoreProducts: boolean;
//   registerProductLoading: boolean;
//   registerProductDone: boolean;
//   registerProductError: any;
//   uploadImagesLoading: boolean;
//   uploadImagesDone: boolean;
//   uploadImagesError: any;
//   loadProductsLoading: boolean;
//   loadProductsDone: boolean;
//   loadProductsError: any;
//   loadProductLoading: boolean;
//   loadProductDone: boolean;
//   loadProductError: any;
//   searchProductsLoading : boolean;
//   searchProductsDone : boolean;
//   searchProductsError : any;
// }
