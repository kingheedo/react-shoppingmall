import faker from 'faker'
import produce from 'immer'
import { dummyProduct } from './product';
export const initialState = {
    me: null,
    cart: [],
    logginLoading : false,
    logginDone : false,
    logginError : null,

    logoutLoaing: false,
    logoutDone: false,
    logoutError: null,

    addProductCartLoading: false,
    addProductCartDone: false,
    addProductCartError: null,


}
export const dummyUser = () => ({
    id: 5,
    User:{
        id:1,
        nickname:'사용자2'
    },
    Images: [{src:"https://cdn.pixabay.com/photo/2021/01/24/20/47/mountains-5946500_1280.jpg"},],
    Comments: ['댓글테스트'],
})

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_REQUEST';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_REQUEST';

export const ADD_PRODUCT_CART_REQUEST = 'ADD_PRODUCT_CART_REQUEST';
export const ADD_PRODUCT_CART_SUCCESS = 'ADD_PRODUCT_CART_SUCCESS';
export const ADD_PRODUCT_CART_FAILURE = 'ADD_PRODUCT_CART_FAILURE';


const reducer = (state = initialState, action) =>{
    return produce(state,(draft) => {
        switch (action.type) {
            case LOG_IN_REQUEST:
                draft.logginLoading = true;
                draft.logginDone = false;
                draft.logginError = null;
            break;
            case LOG_IN_SUCCESS:
                draft.logginLoading = false;
                draft.logginDone = true;
                draft.me = action.data;
            break;
            case LOG_IN_FAILURE:
                draft.logginLoading = false;
                draft.logginDone = false;
                draft.logginError = action.error;
            break;

            case LOG_OUT_REQUEST:
                draft.logginLoading = true;
                draft.logginDone = false;
                draft.logginError = null;
            break;
            case LOG_OUT_SUCCESS:
                draft.logginLoading = false;
                draft.logginDone = true;
                draft.me = action.data;
            break;
            case LOG_OUT_FAILURE:
                draft.logginLoading = false;
                draft.logginDone = false;
                draft.logginError = action.error;
            break;
            
            case ADD_PRODUCT_CART_REQUEST:
                draft.addProductCartLoading = true;
                draft.addProductCartDone = false;
                draft.addProductCartError = null;
            break;
            case ADD_PRODUCT_CART_SUCCESS:
                draft.addProductCartLoading = false;
                draft.addProductCartDone = true;
                draft.cart.push({Product: action.data});
            break;
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

export default reducer
