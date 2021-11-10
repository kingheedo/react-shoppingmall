import faker from 'faker'
import produce from 'immer'
export const initialState = {
    user: null,

    logginLoading : false,
    logginDone : false,
    logginFailure : null,

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


const reducer = (state = initialState, action) =>{
    return produce(state,(draft) => {
        switch (action.type) {
            case LOG_IN_REQUEST:
                draft.logginLoading = true;
                draft.logginDone = false;
                draft.logginFailure = null;
            break;
            case LOG_IN_SUCCESS:
                draft.logginLoading = false;
                draft.logginDone = true;
                draft.user = action.data;
            break;
            case LOG_IN_FAILURE:
                draft.logginLoading = false;
                draft.logginDone = false;
                draft.logginFailure = action.error;
            break;
        
            default:
                break;
        }
    })
}

export default reducer
