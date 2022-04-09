import produce from 'immer';
import {
  ADD_PRODUCT_CART_FAILURE,
  ADD_PRODUCT_CART_REQUEST,
  ADD_PRODUCT_CART_SUCCESS,
  CartAction, CartState, CHECK_ALL_PRODUCTS, CHECK_CART_PRODUCT, DELETE_CART_PRODUCT_FAILURE, DELETE_CART_PRODUCT_REQUEST, DELETE_CART_PRODUCT_SUCCESS, LOAD_CART_PRODUCTS_FAILURE, LOAD_CART_PRODUCTS_REQUEST, LOAD_CART_PRODUCTS_SUCCESS, UNCHECK_ALL_PRODUCTS, UNCHECK_CART_PRODUCT, UserCart,
} from './reducerTypes/cartTypes';

export const initialState:CartState = {
  userCart: [],
  cartTotalPrice: 0,
  cartTotalDeliveryFee: 0,
  loadCartProductsLoading: false,
  loadCartProductsDone: false,
  loadCartProductsError: null,
  addProductCartLoading: false,
  addProductCartDone: false,
  addProductCartError: null,
  deleteCartProductLoading: false,
  deleteCartProductDone: false,
  deleteCartProductError: null,
};

const reducer = (state = initialState, action:CartAction) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case DELETE_CART_PRODUCT_REQUEST:
        draft.deleteCartProductLoading = true;
        draft.deleteCartProductDone = false;
        draft.deleteCartProductError = null;
        break;
      case DELETE_CART_PRODUCT_SUCCESS:
        draft.deleteCartProductLoading = false;
        draft.deleteCartProductDone = true;
        const product = draft.userCart.find((v) => v.id === action.data.CartItemId) as UserCart;
        const productDeliveryFee = product.totalPrice > 39900 ? 0 : 2500;
        draft.cartTotalDeliveryFee -= productDeliveryFee;
        draft.cartTotalPrice -= (product.totalPrice + productDeliveryFee);
        draft.userCart = draft.userCart.filter((v) => v.id !== action.data.CartItemId);
        break;

      case DELETE_CART_PRODUCT_FAILURE:
        draft.deleteCartProductLoading = false;
        draft.deleteCartProductDone = false;
        draft.deleteCartProductError = action.error;
        break;

      case LOAD_CART_PRODUCTS_REQUEST:
        draft.loadCartProductsLoading = true;
        draft.loadCartProductsDone = false;
        draft.loadCartProductsError = null;
        break;
      case LOAD_CART_PRODUCTS_SUCCESS:
        draft.loadCartProductsLoading = false;
        draft.loadCartProductsDone = true;
        draft.userCart = action.data;
        break;

      case LOAD_CART_PRODUCTS_FAILURE:
        draft.loadCartProductsLoading = false;
        draft.loadCartProductsDone = false;
        draft.loadCartProductsError = action.error;
        break;

      case CHECK_ALL_PRODUCTS:
        draft.cartTotalDeliveryFee = draft.userCart.reduce((acc, curr) => acc + (curr.totalPrice > 39900 ? 0 : 2500), 0);
        draft.cartTotalPrice = draft.userCart.reduce((acc, curr) => acc + curr.totalPrice, draft.cartTotalDeliveryFee);
        break;

      case UNCHECK_ALL_PRODUCTS:
        draft.cartTotalPrice = 0;
        draft.cartTotalDeliveryFee = 0;
        break;

      case UNCHECK_CART_PRODUCT: {
        const product = draft.userCart.find((v:UserCart) => v.id === action.data.id);
        const productDeliveryFee = product!.totalPrice > 39900 ? 0 : 2500;
        draft.cartTotalDeliveryFee -= productDeliveryFee;
        draft.cartTotalPrice -= (product!.totalPrice + productDeliveryFee);
        break;
      }
      case CHECK_CART_PRODUCT: {
        const product = draft.userCart.find((v) => v.id === action.data.id) as UserCart;
        const productDeliveryFee = product.totalPrice > 39900 ? 0 : 2500;
        draft.cartTotalDeliveryFee += productDeliveryFee;
        draft.cartTotalPrice += (product.totalPrice + productDeliveryFee);
        break;
      }
      case ADD_PRODUCT_CART_REQUEST:
        draft.addProductCartLoading = true;
        draft.addProductCartDone = false;
        draft.addProductCartError = null;
        break;
      case ADD_PRODUCT_CART_SUCCESS: {
        draft.addProductCartLoading = false;
        draft.addProductCartDone = true;
        const exproduct = draft.userCart.find((v) => (v.UserId === action.data.UserId) && (v.ProductId === action.data.ProductId) && (v.size === action.data.size));
        if (exproduct) {
          exproduct.quantity = action.data.quantity;
          exproduct.totalPrice = action.data.totalPrice;
        } else {
          draft.userCart.push(action.data);
        }
        break;
      }
      case ADD_PRODUCT_CART_FAILURE:
        draft.addProductCartLoading = false;
        draft.addProductCartDone = false;
        draft.addProductCartError = action.error;
        break;

      default:
        break;
    }
  });
};

export default reducer;
