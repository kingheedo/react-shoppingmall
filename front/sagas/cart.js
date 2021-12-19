import {call,all, delay, fork, put, throttle, takeLatest } from "redux-saga/effects";
import { ADD_PRODUCT_CART_FAILURE, ADD_PRODUCT_CART_REQUEST, ADD_PRODUCT_CART_SUCCESS, CHECK_CART_PRODUCT_FAILURE, CHECK_CART_PRODUCT_REQUEST, CHECK_CART_PRODUCT_SUCCESS, LOAD_CART_PRODUCTS_FAILURE, LOAD_CART_PRODUCTS_REQUEST, LOAD_CART_PRODUCTS_SUCCESS, UNCHECK_CART_PRODUCT_FAILURE, UNCHECK_CART_PRODUCT_REQUEST, UNCHECK_CART_PRODUCT_SUCCESS } from "../reducers/cart";
import axios from 'axios'

function LoadCartProductsApi(data) {
    return axios.get('/cart', data);
}
function* LoadCartProducts(action) {
    try {
        const result = yield call(LoadCartProductsApi, action.data);
        yield put({
            type: LOAD_CART_PRODUCTS_SUCCESS,
            data: result.data
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: LOAD_CART_PRODUCTS_FAILURE,
            error: err.response.data,
        });
    }
}



function AddProductCartApi(data) {
    return axios.post('/cart',data);
}
function* AddProductCart(action) {
    try {
        const result = yield call(AddProductCartApi, action.data);
        yield put({
            type: ADD_PRODUCT_CART_SUCCESS,
            data: result.data
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: ADD_PRODUCT_CART_FAILURE,
            error: err.response.data,
        });
    }
}

    function* watchLoadCartProducts() {
    yield throttle(3000, LOAD_CART_PRODUCTS_REQUEST, LoadCartProducts);
  }
    function* watchAddProductCart() {
    yield throttle(3000, ADD_PRODUCT_CART_REQUEST, AddProductCart);
  }

  export default function* productSaga() {
    yield all([
        fork(watchLoadCartProducts),
        fork(watchAddProductCart),
    ]);
}