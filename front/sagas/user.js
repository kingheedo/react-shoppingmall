import { LOAD_PRODUCTS_FAILURE, LOAD_PRODUCTS_REQUEST, LOAD_PRODUCTS_SUCCESS,dummyProducts } from "../reducers/product";
import axios from 'axios'
import { all, delay, fork, put, throttle } from "@redux-saga/core/effects";
import { ADD_PRODUCT_CART_FAILURE, ADD_PRODUCT_CART_REQUEST, ADD_PRODUCT_CART_SUCCESS, dummyUser, LOG_IN_FAILURE, LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_OUT_FAILURE, LOG_OUT_REQUEST, LOG_OUT_SUCCESS } from "../reducers/user";



function AddProductCartApi(data) { //hashtag/name
    return axios.get('api/product', data);
}
function* AddProductCart(action) {
    try {
        // const result = yield call(LoadProductsApi, action.data);
        yield delay(1000);
        yield put({
            type: ADD_PRODUCT_CART_SUCCESS,
            data: dummyProducts(),
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: ADD_PRODUCT_CART_FAILURE,
            error: err.response.data,
        });
    }
}

function LogoutApi(data) { //hashtag/name
    return axios.get('api/product', data);
}
function* Logout(action) {
    try {
        // const result = yield call(LoadProductsApi, action.data);
        yield delay(1000);
        yield put({
            type: LOG_OUT_SUCCESS,
            data: null,
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: LOG_OUT_FAILURE,
            error: err.response.data,
        });
    }
}

function LoginApi(data) { //hashtag/name
    return axios.get('api/product', data);
}
function* Login(action) {
    try {
        // const result = yield call(LoadProductsApi, action.data);
        yield delay(1000);
        yield put({
            type: LOG_IN_SUCCESS,
            data: dummyUser(),
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: LOG_IN_FAILURE,
            error: err.response.data,
        });
    }
}

  function* watchLogin() {
    yield throttle(3000, LOG_IN_REQUEST, Login);
  }
  function* watchLogout() {
    yield throttle(3000, LOG_OUT_REQUEST, Logout);
  }
  function* watchAddProductCart() {
    yield throttle(3000, ADD_PRODUCT_CART_REQUEST, AddProductCart);
  }
  export default function* productSaga() {
    yield all([
        fork(watchLogin),
        fork(watchLogout),
        fork(watchAddProductCart),
    ]);
}