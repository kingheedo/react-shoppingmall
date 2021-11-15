import produce from "immer";


export const initialState = {
    products : [],
    total: 0,

    loadAllPriceLoading : false,
    loadAllPriceDone : false,
    loadAllPriceError : null,

    addProductCartLoading: false,
    addProductCartDone: false,
    addProductCartError: null,
}

export const LOAD_ALL_PRICE_REQUEST = 'LOAD_ALL_PRICE_REQUEST';
export const LOAD_ALL_PRICE_SUCCESS = 'LOAD_ALL_PRICE_SUCCESS';
export const LOAD_ALL_PRICE_FAILURE = 'LOAD_ALL_PRICE_FAILURE';

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
                draft.total += action.data
            break;
        }
            case LOAD_ALL_PRICE_FAILURE:
                draft.loadAllPriceLoading = false;
                draft.loadAllPriceDone = false;
                draft.loadAllPriceError = action.error;
            break;

            case ADD_PRODUCT_CART_REQUEST:
                draft.addProductCartLoading = true;
                draft.addProductCartDone = false;
                draft.addProductCartError = null;
            break;
            case ADD_PRODUCT_CART_SUCCESS:{
                draft.addProductCartLoading = false;
                draft.addProductCartDone = true;
                draft.total = draft.total += action.data.pluralPrice;
                const exproduct = draft.products.find(v => (v.id === action.data.id ) && (v.Size === action.data.Size))
                if(exproduct){
                    exproduct.quantity += action.data.quantity
                    exproduct.pluralPrice += action.data.pluralPrice
                }
                else draft.products.push(action.data)
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