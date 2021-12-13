import produce from "immer";


export const initialState = {
    userCart : [],
    cartTotalPrice: 0,
    cartTotalDeliveryFee : 0,
    loadCartProductsLoading : false,
    loadCartProductsDone : false,
    loadCartProductsError : null,

    uncheckCartProductLoading: false,
    uncheckCartProductDone: false,
    uncheckCartProductError: null,

    checkCartProductLoading: false,
    checkCartProductDone: false,
    checkCartProductError: null,

    addProductCartLoading: false,
    addProductCartDone: false,
    addProductCartError: null,
}

export const LOAD_CART_PRODUCTS_REQUEST = 'LOAD_CART_PRODUCTS_REQUEST';
export const LOAD_CART_PRODUCTS_SUCCESS = 'LOAD_CART_PRODUCTS_SUCCESS';
export const LOAD_CART_PRODUCTS_FAILURE = 'LOAD_CART_PRODUCTS_FAILURE';


export const CHECK_CART_PRODUCT_REQUEST = 'CHECK_CART_PRODUCT_REQUEST';
export const CHECK_CART_PRODUCT_SUCCESS = 'CHECK_CART_PRODUCT_SUCCESS';
export const CHECK_CART_PRODUCT_FAILURE = 'CHECK_CART_PRODUCT_FAILURE';

export const UNCHECK_CART_PRODUCT_REQUEST = 'UNCHECK_CART_PRODUCT_REQUEST';
export const UNCHECK_CART_PRODUCT_SUCCESS = 'UNCHECK_CART_PRODUCT_SUCCESS';
export const UNCHECK_CART_PRODUCT_FAILURE = 'UNCHECK_CART_PRODUCT_FAILURE';

export const ADD_PRODUCT_CART_REQUEST = 'ADD_PRODUCT_CART_REQUEST';
export const ADD_PRODUCT_CART_SUCCESS = 'ADD_PRODUCT_CART_SUCCESS';
export const ADD_PRODUCT_CART_FAILURE = 'ADD_PRODUCT_CART_FAILURE';


const reducer = (state = initialState, action) => {
    return produce(state,(draft) => {
        switch (action.type) {
            case LOAD_CART_PRODUCTS_REQUEST:
                draft.loadCartProductsLoading = true;
                draft.loadCartProductsDone = false;
                draft.loadCartProductsError = null;
            break;
            case LOAD_CART_PRODUCTS_SUCCESS:{
                draft.loadCartProductsLoading = false;
                draft.loadCartProductsDone = true;
                draft.userCart = action.data;
            break;
        }
            case LOAD_CART_PRODUCTS_FAILURE:
                draft.loadCartProductsLoading = false;
                draft.loadCartProductsDone = false;
                draft.loadCartProductsError = action.error;
            break;

            case UNCHECK_CART_PRODUCT_REQUEST:
                draft.checkCartProductLoading = true;
                draft.checkCartProductDone = false;
                draft.checkCartProductError = null;
            break;
            case UNCHECK_CART_PRODUCT_SUCCESS:{
                draft.checkCartProductLoading = false;
                draft.checkCartProductDone = true;
                const product = draft.userCart.find(v => (v.id === action.data.id) && (v.size === action.data.size));
                draft.cartTotalDeliveryFee -= (product.totalPrice > 3000) ? 0 : 2500;
                draft.cartTotalPrice -= (product.totalPrice + draft.cartTotalDeliveryFee);
            break;
        }
            case UNCHECK_CART_PRODUCT_FAILURE:
                draft.checkCartProductLoading = false;
                draft.checkCartProductDone = false;
                draft.checkCartProductError = action.error;
            break;

            case CHECK_CART_PRODUCT_REQUEST:
                draft.uncheckCartProductLoading = true;
                draft.uncheckCartProductDone = false;
                draft.uncheckCartProductError = null;
            break;
            case CHECK_CART_PRODUCT_SUCCESS:{
                draft.uncheckCartpLoading = false;
                draft.uncheckCartProductDone = true;
                 const product = draft.userCart.find(v => (v.id === action.data.id) && (v.size === action.data.size));
                draft.cartTotalDeliveryFee += (product.totalPrice > 3000) ? 0 : 2500;
                draft.cartTotalPrice += (product.totalPrice + draft.cartTotalDeliveryFee);
                
            break;
        }
            case CHECK_CART_PRODUCT_FAILURE:
                draft.uncheckCartpLoading = false;
                draft.uncheckCartProductDone = false;
                draft.uncheckCartProductError = action.error;
            break;

            case ADD_PRODUCT_CART_REQUEST:
                draft.addProductCartLoading = true;
                draft.addProductCartDone = false;
                draft.addProductCartError = null;
            break;
            case ADD_PRODUCT_CART_SUCCESS:{
                draft.addProductCartLoading = false;
                draft.addProductCartDone = true;
                const exproduct = draft.userCart.find(v => (v.UserId === action.data.UserId ) &&(v.ProductId === action.data.ProductId ) && (v.size === action.data.size))
                if(exproduct){
                    exproduct.quantity =  action.data.quantity;
                    exproduct.totalPrice =  action.data.totalPrice;
                }
                else {
                    draft.userCart.push(action.data)
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
    })
}

export default reducer;