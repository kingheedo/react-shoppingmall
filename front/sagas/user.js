import { LOAD_PRODUCTS_FAILURE, LOAD_PRODUCTS_REQUEST, LOAD_PRODUCTS_SUCCESS,} from "../reducers/product";
import axios from 'axios'
import { all, call, delay, fork, put, takeLatest, throttle } from "redux-saga/effects";
import { ADD_PAYMENT_FAILURE, ADD_PAYMENT_REQUEST, ADD_PAYMENT_SUCCESS, ADD_PRODUCT_CART_FAILURE, ADD_PRODUCT_CART_REQUEST, ADD_PRODUCT_CART_SUCCESS, LOAD_PAYMENT_LISTS_FAILURE, LOAD_PAYMENT_LISTS_REQUEST, LOAD_PAYMENT_LISTS_SUCCESS, LOAD_USER_FAILURE, LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOG_IN_FAILURE, LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_OUT_FAILURE, LOG_OUT_REQUEST, LOG_OUT_SUCCESS, SIGN_UP_FAILURE, SIGN_UP_REQUEST, SIGN_UP_SUCCESS } from "../reducers/user";

function LoadPaymentListsApi() {
    return axios.get('/user/paymentsList');
}
function* LoadPaymentLists() {
    try {
        const result = yield call(LoadPaymentListsApi);
        yield put({
            type: LOAD_PAYMENT_LISTS_SUCCESS,
            data: result.data,
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: LOAD_PAYMENT_LISTS_FAILURE,
            error: err.response.data,
        });
    }
}

function AddpaymentApi(data) {
    return axios.post('/user/payment',data);
}
function* Addpayment(action) {
    try {
        const result = yield call(AddpaymentApi, action.data);
        yield put({
            type: ADD_PAYMENT_SUCCESS,
            data: result.data,
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: ADD_PAYMENT_FAILURE,
            error: err.response.data,
        });
    }
}

function LoadUserApi() {
    return axios.get('/user');
}
function* LoadUser(action) {
    try {
        const result = yield call(LoadUserApi);
        yield put({
            type: LOAD_USER_SUCCESS,
            data: result.data,
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: LOAD_USER_FAILURE,
            error: err.response.data,
        });
    }
}

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

function LoginApi(data) {
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

function SignUpApi(data) {
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

  function* watchLoadPaymentLists() {
    yield takeLatest(LOAD_PAYMENT_LISTS_REQUEST, LoadPaymentLists);
  }

  function* watchAddPayment() {
    yield takeLatest(ADD_PAYMENT_REQUEST, Addpayment);
  }
  function* watchLoadUser() {
    yield takeLatest(LOAD_USER_REQUEST, LoadUser);
  }
  function* watchLogin() {
    yield takeLatest(LOG_IN_REQUEST, Login);
  }
  function* watchLogout() {
    yield throttle(3000, LOG_OUT_REQUEST, Logout);
  }
  function* watchSignUp() {
    yield throttle(3000, SIGN_UP_REQUEST, SignUp);
  }
  export default function* productSaga() {
    yield all([
        fork(watchLoadPaymentLists),
        fork(watchAddPayment),
        fork(watchLoadUser),
        fork(watchLogin),
        fork(watchLogout),
        fork(watchSignUp),
    ]);
}