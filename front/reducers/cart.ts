import { createSlice } from '@reduxjs/toolkit';
import { addProductToCart, deleteProductInCart, loadProductsInCart } from './asyncRequest/cart';
import { CartState, UserCart } from './reducerTypes/cartTypes';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    userCart: [],
    cartTotalPrice: 0,
    cartTotalDeliveryFee: 0,
    loadProductsInCartLoading: false,
    loadProductsInCartDone: false,
    loadProductsInCartError: null,
    addProductToCartLoading: false,
    addProductToCartDone: false,
    addProductToCartError: null,
    deleteProductInCartLoading: false,
    deleteProductInCartDone: false,
    deleteProductInCartError: null
  } as CartState,
  reducers: {
    checkProduct: (state, action) => {
      const product = state.userCart.find((v) => v.id === action.payload.id) as UserCart;
      const productDeliveryFee = product.totalPrice > 39900 ? 0 : 2500;
      state.cartTotalDeliveryFee += productDeliveryFee;
      state.cartTotalPrice += (product.totalPrice + productDeliveryFee);
    },
    uncheckProduct: (state, action) => {
      const product = state.userCart.find((v: UserCart) => v.id === action.payload.id);
      const productDeliveryFee = product!.totalPrice > 39900 ? 0 : 2500;
      state.cartTotalDeliveryFee -= productDeliveryFee;
      state.cartTotalPrice -= (product!.totalPrice + productDeliveryFee);
    },
    checkAllProducts: (state) => {
      if (state.userCart) {
        state.cartTotalDeliveryFee = state.userCart.reduce((acc, curr) => acc + (curr.totalPrice > 39900 ? 0 : 2500), 0);
        state.cartTotalPrice = state.userCart.reduce((acc, curr) => acc + curr.totalPrice, state.cartTotalDeliveryFee);
      }
    },
    unCheckAllProducts: (state) => {
      state.cartTotalPrice = 0;
      state.cartTotalDeliveryFee = 0;
    }
  },
  extraReducers: {
    [deleteProductInCart.pending as any]: (state) => {
      state.deleteProductInCartLoading = true;
      state.deleteProductInCartDone = false;
      state.deleteProductInCartError = false;
    },
    [deleteProductInCart.fulfilled as any]: (state, action) => {
      state.deleteProductInCartLoading = false;
      state.deleteProductInCartDone = true;
      const product = state.userCart.find((v) => v.id === action.payload.CartItemId) as UserCart;
      const productDeliveryFee = product.totalPrice > 39900 ? 0 : 2500;
      state.cartTotalDeliveryFee -= productDeliveryFee;
      state.cartTotalPrice -= (product.totalPrice + productDeliveryFee);
      const newUserCart = state.userCart.filter((v) => v.id !== action.payload.CartItemId);
      state.userCart = newUserCart;
    },
    [deleteProductInCart.rejected as any]: (state, action) => {
      state.deleteProductInCartLoading = false;
      state.deleteProductInCartDone = false;
      state.deleteProductInCartError = action.error.message;
    },
    [loadProductsInCart.pending as any]: (state) => {
      state.loadProductsInCartLoading = true;
      state.loadProductsInCartDone = false;
      state.loadProductsInCartError = false;
    },
    [loadProductsInCart.fulfilled as any]: (state, action) => {
      state.loadProductsInCartLoading = false;
      state.loadProductsInCartDone = true;
      state.userCart = action.payload;
    },
    [loadProductsInCart.rejected as any]: (state, action) => {
      state.loadProductsInCartLoading = false;
      state.loadProductsInCartDone = false;
      state.loadProductsInCartError = action.error.message;
    },

    [addProductToCart.pending as any]: (state) => {
      state.addProductToCartLoading = true;
      state.addProductToCartDone = false;
      state.addProductToCartError = false;
    },
    [addProductToCart.fulfilled as any]: (state, action) => {
      state.addProductToCartLoading = false;
      state.addProductToCartDone = true;
      const exproduct = state.userCart.find((v) => (v.UserId === action.payload.UserId) && (v.ProductId === action.payload.ProductId) && (v.size === action.payload.size));
      if (exproduct) {
        exproduct.quantity = action.payload.quantity;
        exproduct.totalPrice = action.payload.totalPrice;
      } else {
        state.userCart.push(action.payload);
      }
    },
    [addProductToCart.rejected as any]: (state, action) => {
      state.addProductToCartLoading = false;
      state.addProductToCartDone = false;
      state.addProductToCartError = action.error.message;
    }
  }
});
export const {
  checkProduct, uncheckProduct, checkAllProducts, unCheckAllProducts
} = cartSlice.actions;
export default cartSlice.reducer;
