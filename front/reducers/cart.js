import produce from "immer";


export const initialState = {
    products : [],
    total: 0,

}

export const ADD_PRODUCT_CART_REQUEST = 'ADD_PRODUCT_CART_REQUEST';
export const ADD_PRODUCT_CART_SUCCESS = 'ADD_PRODUCT_CART_SUCCESS';
export const ADD_PRODUCT_CART_FAILURE = 'ADD_PRODUCT_CART_FAILURE';


const reducer = (state = initialState, action) => {
    return produce(state,(draft) => {
switch (action.type) {
            case ADD_PRODUCT_CART_REQUEST:
                draft.addProductCartLoading = true;
                draft.addProductCartDone = false;
                draft.addProductCartError = null;
            break;
            case ADD_PRODUCT_CART_SUCCESS:{
                draft.addProductCartLoading = false;
                draft.addProductCartDone = true;
                draft.products.push(action.data);
                draft.total = draft.total += action.data.pluralPrice;
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