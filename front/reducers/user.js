import faker from 'faker'
import produce from 'immer'
import { dummyProduct } from './product';
export const initialState = {
    me: null,
    paymentLists: null,
    loadUserLoading : false,
    loadUserDone : false,
    loadUserError : null,
    
    loginLoading : false,
    loginDone : false,
    loginError : null,

    logoutLoaing: false,
    logoutDone: false,
    logoutError: null,

    signUpLoading :false,
    signUpSuccess :false,
    signUpError :null,

    addPaymentLoading :false,
    addPaymentDone :false,
    addPaymentError :null,

    loadPaymentListsLoading :false,
    loadPaymentListsDone :false,
    loadPaymentListsError :null,
   


}
export const dummyUser = () => ({
    id: 5,
    User:{
        id:1,
        name:'사용자2'
    },
    Images: [{src:"https://cdn.pixabay.com/photo/2021/01/24/20/47/mountains-5946500_1280.jpg"},],
    Comments: ['댓글테스트'],
})



export const LOAD_PAYMENT_LISTS_REQUEST = 'LOAD_PAYMENT_LISTS_REQUEST';
export const LOAD_PAYMENT_LISTS_SUCCESS = 'LOAD_PAYMENT_LISTS_SUCCESS';
export const LOAD_PAYMENT_LISTS_FAILURE = 'LOAD_PAYMENT_LISTS_FAILURE';

export const ADD_PAYMENT_REQUEST = 'ADD_PAYMENT_REQUEST';
export const ADD_PAYMENT_SUCCESS = 'ADD_PAYMENT_SUCCESS';
export const ADD_PAYMENT_FAILURE = 'ADD_PAYMENT_FAILURE';

export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_RESET = 'SIGN_UP_RESET';
export const RESET_ADD_PAYMENT = 'RESET_ADD_PAYMENT';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';



const reducer = (state = initialState, action) =>{
    return produce(state,(draft) => {
        switch (action.type) {
            case LOAD_PAYMENT_LISTS_REQUEST:
                draft.loadPaymentListsLoading = true;
                draft.loadPaymentListsDone = false;
                draft.loadPaymentListsError = null;
            break;
            case LOAD_PAYMENT_LISTS_SUCCESS:
                draft.loadPaymentListsLoading = false;
                draft.loadPaymentListsDone = true;
                draft.paymentLists = action.data;
            break;
            case LOAD_PAYMENT_LISTS_FAILURE:
                draft.loadPaymentListsLoading = false;
                draft.loadPaymentListsError = action.error;
            break;

            case ADD_PAYMENT_REQUEST:
                draft.addPaymentLoading = true;
                draft.addPaymentDone = false;
                draft.addPaymentError = null;
            break;
            case ADD_PAYMENT_SUCCESS:
                draft.addPaymentLoading = false;
                draft.addPaymentDone = true;
            break;
            case ADD_PAYMENT_FAILURE:
                draft.addPaymentLoading = false;
                draft.addPaymentError = action.error;
            break;

            case LOAD_USER_REQUEST:
                draft.loadUserLoaing = true;
                draft.loadUserDone = false;
                draft.loadUserError = null;
            break;
            case LOAD_USER_SUCCESS:
                draft.loadUserLoading = false;
                draft.loadUserDone = true;
                draft.me = action.data;
            break;
            case LOAD_USER_FAILURE:
                draft.loadUserLoading = false;
                draft.loadUserError = action.error;
            break;

            case LOG_OUT_REQUEST:
                draft.logoutLoaing = true;
                draft.logoutDone = false;
                draft.logoutError = null;
            break;
            case LOG_OUT_SUCCESS:
                draft.logoutLoading = false;
                draft.logoutDone = true;
                draft.me = null;
            break;
            case LOG_OUT_FAILURE:
                draft.logoutLoading = false;
                draft.logoutError = action.error;
            break;

            case LOG_IN_REQUEST:
                draft.loginLoading = true;
                draft.loginDone = false;
                draft.loginError = null;
            break;
            case LOG_IN_SUCCESS:
                draft.loginLoading = false;
                draft.loginDone = true;
                draft.me = action.data;
            break;
            case LOG_IN_FAILURE:
                draft.loginLoading = false;
                draft.loginError = action.error;
            break;

            case SIGN_UP_REQUEST:
                draft.signUpLoading = true;
                draft.signUpDone = false;
                draft.signUpError = null;
            break;
            case SIGN_UP_SUCCESS:
                draft.signUpLoading = false;
                draft.signUpDone = true;
            break;
            case SIGN_UP_FAILURE:
                draft.signUpLoading = false;
                draft.signUpError = action.error;
            break;

            case SIGN_UP_RESET:
                draft.signUpDone = false;

            case RESET_ADD_PAYMENT:
                draft.addPaymentDone = false;
                break;

            default:
                break;
            
        }
    })
}

export default reducer
