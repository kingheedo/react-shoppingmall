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

    signUpLoading :false,
    signUpSuccess :false,
    signUpError :null,
   


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

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';



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

            default:
                break;
        }
    })
}

export default reducer
