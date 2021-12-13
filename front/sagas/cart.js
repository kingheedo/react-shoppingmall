import {call,all, delay, fork, put, throttle } from "redux-saga/effects";
import { ADD_PRODUCT_CART_FAILURE, ADD_PRODUCT_CART_REQUEST, ADD_PRODUCT_CART_SUCCESS, CHECK_CART_PRODUCT_FAILURE, CHECK_CART_PRODUCT_REQUEST, CHECK_CART_PRODUCT_SUCCESS, LOAD_CART_PRODUCTS_REQUEST, LOAD_CART_PRODUCTS_SUCCESS, UNCHECK_CART_PRODUCT_FAILURE, UNCHECK_CART_PRODUCT_REQUEST, UNCHECK_CART_PRODUCT_SUCCESS } from "../reducers/cart";
import axios from 'axios'

function LoadCartProductsApi(data) { //hashtag/name
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
    function* watchUnCheckCartProduct() {
    yield throttle(1000, UNCHECK_CART_PRODUCT_REQUEST, UnCheckCartProduct);
  }
    function* watchCheckCartProduct() {
    yield throttle(1000, CHECK_CART_PRODUCT_REQUEST, CheckCartProduct);
  }

  export default function* productSaga() {
    yield all([
        fork(watchLoadCartProducts),
        fork(watchUnCheckCartProduct),
        fork(watchCheckCartProduct),
        fork(watchAddProductCart),
    ]);
}