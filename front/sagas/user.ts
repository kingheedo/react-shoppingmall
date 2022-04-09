import axios, { AxiosResponse } from 'axios';
import {
  all, call, fork, put, takeLatest, throttle,
} from 'redux-saga/effects';
import {
  ADD_PAYMENT_FAILURE, ADD_PAYMENT_REQUEST, ADD_PAYMENT_SUCCESS, LOAD_PAYMENT_LISTS_FAILURE, LOAD_PAYMENT_LISTS_REQUEST, LOAD_PAYMENT_LISTS_SUCCESS, LOAD_USER_FAILURE, LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOG_IN_FAILURE, LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_OUT_FAILURE, LOG_OUT_REQUEST, LOG_OUT_SUCCESS, SIGN_UP_FAILURE, SIGN_UP_REQUEST, SIGN_UP_SUCCESS,
} from '../reducers/reducerTypes/userTypes';
import { AddPaymentLists, LogIn, SignUp } from '../reducers/dispatchRequestTypes/userDispatchRequest';

function loadPaymentListsApi() {
  return axios.get('/user/paymentsList');
}
function* loadPaymentLists() {
  try {
    const result:AxiosResponse = yield call(loadPaymentListsApi);
    yield put({
      type: LOAD_PAYMENT_LISTS_SUCCESS,
      data: result.data,
    });
  } catch (err:any) {
    console.error(err);
    yield put({
      type: LOAD_PAYMENT_LISTS_FAILURE,
      error: err.response.data,
    });
  }
}

function addpaymentApi(data:{
    CartItemId? : number,
    CartItemsId?: number[],
    payment : any
  }) {
  return axios.post('/user/payment', data);
}
function* addpayment(action:AddPaymentLists) {
  try {
    const result:AxiosResponse = yield call(addpaymentApi, action.data);
    yield put({
      type: ADD_PAYMENT_SUCCESS,
      data: result.data,
    });
  } catch (err:any) {
    console.error(err);
    yield put({
      type: ADD_PAYMENT_FAILURE,
      error: err.response.data,
    });
  }
}

function loadUserApi() {
  return axios.get('/user');
}
function* loadUser() {
  try {
    const result:AxiosResponse = yield call(loadUserApi);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
    });
  } catch (err:any) {
    console.error(err);
    yield put({
      type: LOAD_USER_FAILURE,
      error: err.response.data,
    });
  }
}

function logoutApi() { // hashtag/name
  return axios.post('/user/logout');
}
function* logout() {
  try {
    yield call(logoutApi);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (err:any) {
    console.error(err);
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response.data,
    });
  }
}

function loginApi(data : {email : string, password : string, }) {
  return axios.post('/user/login', data);
}
function* login(action:LogIn) {
  try {
    const result:AxiosResponse = yield call(loginApi, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (err:any) {
    console.error(err);
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data,
    });
  }
}

function signUpApi(data: {email : string, name : string, password : string, }) {
  return axios.post('/user', data);
}
function* signUp(action:SignUp) {
  try {
    yield call(signUpApi, action.data);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (err:any) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLoadPaymentLists() {
  yield takeLatest(LOAD_PAYMENT_LISTS_REQUEST, loadPaymentLists);
}

function* watchAddPayment() {
  yield takeLatest(ADD_PAYMENT_REQUEST, addpayment);
}
function* watchLoadUser() {
  yield takeLatest(LOAD_USER_REQUEST, loadUser);
}
function* watchLogin() {
  yield takeLatest(LOG_IN_REQUEST, login);
}
function* watchLogout() {
  yield throttle(3000, LOG_OUT_REQUEST, logout);
}
function* watchSignUp() {
  yield throttle(3000, SIGN_UP_REQUEST, signUp);
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
