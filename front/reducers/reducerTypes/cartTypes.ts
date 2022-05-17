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
  loadProductsInCartLoading: boolean,
  loadProductsInCartDone: boolean,
  loadProductsInCartError: any,
  addProductToCartLoading: boolean,
  addProductToCartDone: boolean,
  addProductToCartError: any,
  deleteProductInCartLoading:boolean,
  deleteProductInCartDone:boolean,
  deleteProductInCartError: any,
}
