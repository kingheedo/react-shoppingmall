import produce from "immer";


export const initialState = {
    userCart : [],
    cartTotalPrice: 0,
    cartTotalDeliveryFee : 0,
    loadCartProductsLoading : false,
    loadCartProductsDone : false,
    loadCartProductsError : null,

    addProductCartLoading: false,
    addProductCartDone: false,
    addProductCartError: null,
}

export const LOAD_CART_PRODUCTS_REQUEST = 'LOAD_CART_PRODUCTS_REQUEST';
export const LOAD_CART_PRODUCTS_SUCCESS = 'LOAD_CART_PRODUCTS_SUCCESS';
export const LOAD_CART_PRODUCTS_FAILURE = 'LOAD_CART_PRODUCTS_FAILURE';


export const CHECK_CART_PRODUCT = 'CHECK_CART_PRODUCT';
export const UNCHECK_CART_PRODUCT = 'UNCHECK_CART_PRODUCT';
export const CHECK_ALL_PRODUCTS = 'CHECK_ALL_PRODUCTS';
export const UNCHECK_ALL_PRODUCTS = 'UNCHECK_ALL_PRODUCTS';

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
                draft.cartTotalDeliveryFee = draft.userCart.reduce((prev,curr) => (prev.totalPrice > 3000 ? 0 : 2500) + (curr.totalPrice > 3000 ? 0 : 2500),0);
                draft.cartTotalPrice = draft.userCart.reduce((prev, curr) => prev + curr.totalPrice, draft.cartTotalDeliveryFee);
            break;
        
            case UNCHECK_ALL_PRODUCTS:
                draft.cartTotalPrice = 0
                draft.cartTotalDeliveryFee = 0
            break;
        
            case UNCHECK_CART_PRODUCT:{
                const product = draft.userCart.find(v => v.id === action.data.id);
                const productDeliveryFee = product.totalPrice > 3000 ? 0 : 2500
                draft.cartTotalDeliveryFee -= productDeliveryFee
                draft.cartTotalPrice -=(product.totalPrice + productDeliveryFee);
            break;
        }
            case CHECK_CART_PRODUCT:{
                const product = draft.userCart.find(v => v.id === action.data.id);
                const productDeliveryFee = product.totalPrice > 3000 ? 0 : 2500
                draft.cartTotalDeliveryFee += productDeliveryFee
                draft.cartTotalPrice += (product.totalPrice + productDeliveryFee);
            break;
        }
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