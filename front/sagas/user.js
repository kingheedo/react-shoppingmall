import { LOAD_PRODUCTS_FAILURE, LOAD_PRODUCTS_REQUEST, LOAD_PRODUCTS_SUCCESS,dummyProducts } from "../reducers/product";
import axios from 'axios'
import { all, call, delay, fork, put, throttle } from "@redux-saga/core/effects";
import { ADD_PRODUCT_CART_FAILURE, ADD_PRODUCT_CART_REQUEST, ADD_PRODUCT_CART_SUCCESS, dummyUser, LOG_IN_FAILURE, LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_OUT_FAILURE, LOG_OUT_REQUEST, LOG_OUT_SUCCESS, SIGN_UP_FAILURE, SIGN_UP_REQUEST, SIGN_UP_SUCCESS } from "../reducers/user";



function LogoutApi() { //hashtag/name
    return axios.post('/user/logout');
}
function* Logout() {
    try {
        yield call(LogoutApi);
        yield put({
            type: LOG_OUT_SUCCESS,
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
    return axios.post('/user/login', data);
}
function* Login(action) {
    try {
        const result = yield call(LoginApi, action.data);
        yield put({
            type: LOG_IN_SUCCESS,
            data: result.data,
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: LOG_IN_FAILURE,
            error: err.response.data,
        });
    }
}

function SignUpApi(data) { //hashtag/name
    return axios.post('/user',data);
}
function* SignUp(action) {
    try {
        const result = yield call(SignUpApi, action.data);
        yield put({
            type: SIGN_UP_SUCCESS,
        });
    } catch (err) {
        yield put({
            type: SIGN_UP_FAILURE,
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
  function* watchSignUp() {
    yield throttle(3000, SIGN_UP_REQUEST, SignUp);
  }
  export default function* productSaga() {
    yield all([
        fork(watchLogin),
        fork(watchLogout),
        fork(watchSignUp),
    ]);
}