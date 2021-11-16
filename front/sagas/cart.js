import { all, delay, fork, put, throttle } from "@redux-saga/core/effects";
import { ADD_PRODUCT_CART_FAILURE, ADD_PRODUCT_CART_REQUEST, ADD_PRODUCT_CART_SUCCESS, CHECK_CART_PRODUCT_FAILURE, CHECK_CART_PRODUCT_REQUEST, CHECK_CART_PRODUCT_SUCCESS,LOAD_ALL_PRICE_FAILURE, LOAD_ALL_PRICE_REQUEST, LOAD_ALL_PRICE_SUCCESS, UNCHECK_CART_PRODUCT_FAILURE, UNCHECK_CART_PRODUCT_REQUEST, UNCHECK_CART_PRODUCT_SUCCESS } from "../reducers/cart";
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

function UnCheckCartProductApi(data) { //hashtag/name
    return axios.get('api/product', data);
}
function* UnCheckCartProduct(action) {
    try {
        // const result = yield call(AddProductCartApi, action.data);
        yield put({
            type: UNCHECK_CART_PRODUCT_SUCCESS,
            data: action.data
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: UNCHECK_CART_PRODUCT_FAILURE,
            error: err.response.data,
        });
    }
}

function CheckCartProductApi(data) { //hashtag/name
    return axios.get('api/product', data);
}
function* CheckCartProduct(action) {
    try {
        // const result = yield call(AddProductCartApi, action.data);
        yield put({
            type: CHECK_CART_PRODUCT_SUCCESS,
            data: action.data
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: CHECK_CART_PRODUCT_FAILURE,
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
   function* watchUnCheckCartProduct() {
    
    yield throttle(1000, UNCHECK_CART_PRODUCT_REQUEST, UnCheckCartProduct);
  }
  function* watchCheckCartProduct() {
    
    yield throttle(1000, CHECK_CART_PRODUCT_REQUEST, CheckCartProduct);
  }

  export default function* productSaga() {
    yield all([
        fork(watchLoadAllPrice),
        fork(watchUnCheckCartProduct),
        fork(watchCheckCartProduct),
        fork(watchAddProductCart),
    ]);
}