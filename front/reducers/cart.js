import produce from "immer";


export const initialState = {
    products : [],
    cartTotalPrice: 0,
    cartTotalDeliveryFee : 0,
    loadAllPriceLoading : false,
    loadAllPriceDone : false,
    loadAllPriceError : null,

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

export const LOAD_ALL_PRICE_REQUEST = 'LOAD_ALL_PRICE_REQUEST';
export const LOAD_ALL_PRICE_SUCCESS = 'LOAD_ALL_PRICE_SUCCESS';
export const LOAD_ALL_PRICE_FAILURE = 'LOAD_ALL_PRICE_FAILURE';


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
            case LOAD_ALL_PRICE_REQUEST:
                draft.loadAllPriceLoading = true;
                draft.loadAllPriceDone = false;
                draft.loadAllPriceError = null;
            break;
            case LOAD_ALL_PRICE_SUCCESS:{
                draft.loadAllPriceLoading = false;
                draft.loadAllPriceDone = true;
                draft.cartTotalPrice += action.data
            break;
        }
            case LOAD_ALL_PRICE_FAILURE:
                draft.loadAllPriceLoading = false;
                draft.loadAllPriceDone = false;
                draft.loadAllPriceError = action.error;
            break;

            case UNCHECK_CART_PRODUCT_REQUEST:
                draft.checkCartProductLoading = true;
                draft.checkCartProductDone = false;
                draft.checkCartProductError = null;
            break;
            case UNCHECK_CART_PRODUCT_SUCCESS:{
                draft.checkCartProductLoading = false;
                draft.checkCartProductDone = true;
                const product = draft.products.find(v => (v.id === action.data.id) && (v.Size === action.data.Size))
                draft.cartTotalPrice -= (product.totalPrice + product.DeliveryFee)
                draft.cartTotalDeliveryFee -= product.DeliveryFee
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
                 const product = draft.products.find(v => (v.id === action.data.id) && (v.Size === action.data.Size))
                draft.cartTotalPrice += (product.totalPrice + product.DeliveryFee)
                draft.cartTotalDeliveryFee += product.DeliveryFee
                
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
                const exproduct = draft.products.find(v => (v.id === action.data.id ) && (v.Size === action.data.Size))
                if(exproduct){
                    exproduct.quantity += action.data.quantity
                    exproduct.totalPrice += action.data.totalPrice
                     exproduct.totalPrice > 39900 ?  (exproduct.DeliveryFee  = 0) :  (exproduct.DeliveryFee = 2500)
                     
                }
                else {
                    draft.products.push(action.data)
                    action.data.totalPrice > 39900 ? action.data.DeliveryFee = 0 :  action.data.DeliveryFee =100
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