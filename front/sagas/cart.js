import { all, delay, fork, put, throttle } from "@redux-saga/core/effects";
import { ADD_PRODUCT_CART_FAILURE, ADD_PRODUCT_CART_REQUEST, ADD_PRODUCT_CART_SUCCESS, LOAD_ALL_PRICE_FAILURE, LOAD_ALL_PRICE_REQUEST, LOAD_ALL_PRICE_SUCCESS } from "../reducers/cart";
import { dummyProduct } from "../reducers/product";

function LoadAllPriceApi(data) { //hashtag/name
    return axios.get('api/product', data);
}
function* LoadAllPrice(action) {
    try {
        // const result = yield call(AddProductCartApi, action.data);
        yield delay(1000);
        yield put({
            type: LOAD_ALL_PRICE_SUCCESS,
            data: action.data
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: LOAD_ALL_PRICE_FAILURE,
            error: err.response.data,
        });
    }
}

function AddProductCartApi(data) { //hashtag/name
    return axios.get('api/product', data);
}
function* AddProductCart(action) {
    try {
        // const result = yield call(AddProductCartApi, action.data);
        yield delay(1000);
        yield put({
            type: ADD_PRODUCT_CART_SUCCESS,
            data: dummyProduct(parseInt(action.data.productId,10),action.data.size, action.data.quantity, parseInt(action.data.pluralPrice,10)),
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: ADD_PRODUCT_CART_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchAddProductCart() {
    
    yield throttle(3000, ADD_PRODUCT_CART_REQUEST, AddProductCart);
    
  }
  function* watchLoadAllPrice() {
    
    yield throttle(3000, LOAD_ALL_PRICE_REQUEST, LoadAllPrice);
  }

  export default function* productSaga() {
    yield all([
        fork(watchLoadAllPrice),
        fork(watchAddProductCart),
    ]);
}