import {
  call, all, fork, put, throttle, StrictEffect,
} from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import {
  ADD_PRODUCT_CART_FAILURE,
  ADD_PRODUCT_CART_REQUEST,
  ADD_PRODUCT_CART_SUCCESS,
  DELETE_CART_PRODUCT_FAILURE, DELETE_CART_PRODUCT_REQUEST, DELETE_CART_PRODUCT_SUCCESS, LOAD_CART_PRODUCTS_FAILURE, LOAD_CART_PRODUCTS_REQUEST, LOAD_CART_PRODUCTS_SUCCESS,
} from '../reducers/asyncActionTypes/cartTypes';
import {
  Addproduct, AddProductData, DeleteCartProduct,
} from '../reducers/dispatchRequestTypes/cartDispatchRequest';

function deleteCartProductApi(data:any) {
  return axios.delete(`/cart/${data.id}`, data);
}
function* deleteCartProduct(action:DeleteCartProduct) {
  try {
    const result:AxiosResponse = yield call(deleteCartProductApi, action.data);
    yield put({
      type: DELETE_CART_PRODUCT_SUCCESS,
      data: result.data,
    });
  } catch (err: any) {
    console.error(err);
    yield put({
      type: DELETE_CART_PRODUCT_FAILURE,
      error: err.response.data,
    });
  }
}

function LoadCartProductsApi() {
  return axios.get('/cart');
}
function* LoadCartProducts() {
  try {
    const result:AxiosResponse = yield call(LoadCartProductsApi);
    yield put({
      type: LOAD_CART_PRODUCTS_SUCCESS,
      data: result.data,
    });
  } catch (err:any) {
    console.error(err);
    yield put({
      type: LOAD_CART_PRODUCTS_FAILURE,
      error: err.response.data,
    });
  }
}

function AddProductCartApi(data:AddProductData) {
  return axios.post('/cart', data);
}
function* AddProductCart(action:Addproduct) {
  try {
    const result:AxiosResponse = yield call(AddProductCartApi, action.data);
    yield put({
      type: ADD_PRODUCT_CART_SUCCESS,
      data: result.data,
    });
  } catch (err:any) {
    console.error(err);
    yield put({
      type: ADD_PRODUCT_CART_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchDeleteCartProduct():Generator<StrictEffect> {
  yield throttle(3000, DELETE_CART_PRODUCT_REQUEST, deleteCartProduct);
}
function* watchLoadCartProducts():Generator<StrictEffect> {
  yield throttle(3000, LOAD_CART_PRODUCTS_REQUEST, LoadCartProducts);
}
function* watchAddProductCart():Generator<StrictEffect> {
  yield throttle(3000, ADD_PRODUCT_CART_REQUEST, AddProductCart);
}

export default function* productSaga() {
  yield all([
    fork(watchDeleteCartProduct),
    fork(watchLoadCartProducts),
    fork(watchAddProductCart),
  ]);
}
