export interface AddProductData{
        buyNow? : boolean,
        productId : number,
        size: string,
        quantity : number,
        totalPrice : number,
    }

export interface Addproduct{
    data: AddProductData
}

export interface ProductData{
    id: number;
}

export interface DeleteCartProduct{
  data : ProductData
}
