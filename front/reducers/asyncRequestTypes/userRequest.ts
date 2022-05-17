export interface AddProductReview {
  data :{
    reviewUnique: string,
    historyCartId : number,
    productId : number,
    content : string,
    rate : number,
    paymentToken : string,
  }
}
export interface LogIn{
    data : {
        email : string,
        password : string,
    }
}
export interface SignUp{
    data: {
        email : string,
        name : string,
        password : string,
    }
}
export interface AddPaymentLists{
  data: {
    CartItemId? : number,
    CartItemsId? : number[],
    payment : any
  }
}
