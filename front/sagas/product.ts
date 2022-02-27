import axios, { AxiosResponse } from 'axios';
import {
  all, call, delay, fork, put, throttle, takeLatest, StrictEffect,
} from 'redux-saga/effects';
import {
  LOAD_PRODUCTS_FAILURE,
  LOAD_PRODUCTS_REQUEST,
  LOAD_PRODUCTS_SUCCESS,
  LOAD_PRODUCT_FAILURE,
  LOAD_PRODUCT_REQUEST,
  LOAD_PRODUCT_SUCCESS,
  REGISTER_PRODUCT_FAILURE, REGISTER_PRODUCT_REQUEST, REGISTER_PRODUCT_SUCCESS, UPLOAD_IMAGES_FAILURE, UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_SUCCESS,
} from '../reducers/asyncActionTypes/productType';
import { ADD_PRODUCT_REVIEW_FAILURE, ADD_PRODUCT_REVIEW_REQUEST, ADD_PRODUCT_REVIEW_SUCCESS } from '../reducers/asyncActionTypes/userTypes';
import {
  LoadProduct, LoadProducts, RegisterProduct, UploadImages,
} from '../reducers/dispatchRequestTypes/productDispatchRequest';
import { AddProductReview } from '../reducers/dispatchRequestTypes/userDispatchRequest';

function registerProductAPI(data:FormData) {
  return axios.post('/product', data);
}

function* registerProduct(action:RegisterProduct) {
  try {
    const result:AxiosResponse = yield call(registerProductAPI, action.data);
    yield put({
      type: REGISTER_PRODUCT_SUCCESS,
      data: result.data,
    });
  } catch (err:any) {
    console.error(err);
    yield put({
      type: REGISTER_PRODUCT_FAILURE,
      error: err.response.data,
    });
  }
}

function UploadImagesAPI(data:FormData) {
  return axios.post('/product/images', data);
}

function* uploadImages(action:UploadImages) {
  try {
    const result:AxiosResponse = yield call(UploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (err:any) {
    console.error(err);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: err.response.data,
    });
  }
}
function addProductReviewApi(data:{reviewUnique: string, historyCartId: number, productId: number, content: string, paymentToken:string, }) {
  return axios.post(`/product/${data.productId}/review`, data);
}
function* addProductReview(action:AddProductReview) {
  try {
    const result:AxiosResponse = yield call(addProductReviewApi, action.data);
    yield put({
      type: ADD_PRODUCT_REVIEW_SUCCESS,
      data: result.data,
    });
  } catch (err:any) {
    console.error(err);
    yield put({
      type: ADD_PRODUCT_REVIEW_FAILURE,
      error: err.response.data,
    });
  }
}

function loadProductsApi(lastId?: number) {
  return axios.get(`/products?lastId=${lastId || 0}`);
}
function* loadProducts(action:LoadProducts) {
  try {
    const result:AxiosResponse = yield call(loadProductsApi, action.lastId);
    yield put({
      type: LOAD_PRODUCTS_SUCCESS,
      data: result.data,
    });
  } catch (err:any) {
    console.error(err);
    yield put({
      type: LOAD_PRODUCTS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadSingleProductApi(id:string) {
  return axios.get(`/product/${id}`);
}
function* loadSingleProduct(action: LoadProduct) {
  try {
    const result:AxiosResponse = yield call(loadSingleProductApi, action.id);
    yield delay(1000);
    yield put({
      type: LOAD_PRODUCT_SUCCESS,
      data: result.data,
    });
  } catch (err:any) {
    console.error(err);
    yield put({
      type: LOAD_PRODUCT_FAILURE,
      error: err.response.data,
    });
  }
}
function* watchRegisterProduct():Generator<StrictEffect> {
  yield takeLatest(REGISTER_PRODUCT_REQUEST, registerProduct);
}
function* watchUploadImages():Generator<StrictEffect> {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}
function* watchAddProductReview():Generator<StrictEffect> {
  yield throttle(3000, ADD_PRODUCT_REVIEW_REQUEST, addProductReview);
}

function* watchLoadProducts():Generator<StrictEffect> {
  yield throttle(3000, LOAD_PRODUCTS_REQUEST, loadProducts);
}

function* watchLoadProduct():Generator<StrictEffect> {
  yield throttle(3000, LOAD_PRODUCT_REQUEST, loadSingleProduct);
}

export default function* productSaga() {
  yield all([
    fork(watchRegisterProduct),
    fork(watchUploadImages),
    fork(watchAddProductReview),
    fork(watchLoadProducts),
    fork(watchLoadProduct),
  ]);
}
