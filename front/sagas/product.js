import { LOAD_PRODUCTS_FAILURE, LOAD_PRODUCTS_REQUEST, LOAD_PRODUCTS_SUCCESS,LOAD_PRODUCT_SUCCESS, LOAD_PRODUCT_FAILURE, LOAD_PRODUCT_REQUEST, fakerProducts, ADD_PRODUCT_REVIEW_REQUEST, ADD_PRODUCT_REVIEW_SUCCESS, ADD_PRODUCT_REVIEW_FAILURE, UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_FAILURE, REGISTER_PRODUCT_REQUEST, REGISTER_PRODUCT_SUCCESS, REGISTER_PRODUCT_FAILURE } from "../reducers/product";
import axios from 'axios'
import { all,call, delay, fork, put, throttle,takeLatest } from "redux-saga/effects";

function RegisterProductAPI(data) {
  return axios.post('/product', data); //patch 게시글의 일부분을 수정
}

function* RegisterProduct(action) {
  try {
    const result = yield call(RegisterProductAPI, action.data);
    yield put({
      type: REGISTER_PRODUCT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
      console.error(err);
    yield put({
      type: REGISTER_PRODUCT_FAILURE,
      error: err.response.data,
    });
  }
}

function UploadImagesAPI(data) {
  return axios.post('/product/images', data); //patch 게시글의 일부분을 수정
}

function* UploadImages(action) {
  try {
    const result = yield call(UploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (err) {
      console.error(err);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: err.response.data,
    });
  }
}

function AddProductReviewApi(data) { //hashtag/name
    return axios.get('api/product', data);
}
function* AddProductReview(action) {
    try {
        // const result = yield call(LoadProductsApi, action.data);
        yield delay(1000);
        yield put({
            type: ADD_PRODUCT_REVIEW_SUCCESS,
            data:  {
                id :1,
                content: action.data.Content,
                User : {
                    id: action.data.userId,
                    email: 'gmlehdhkd@naver.com'
                },
                rate: action.data.Rate,
            }
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: ADD_PRODUCT_REVIEW_FAILURE,
            error: err.response.data,
        });
    }
}

function LoadProductsApi(lastId) { //hashtag/name
    return axios.get(`/products?lastId=${lastId || 0}`);
}
function* LoadProducts(action) {
    try {
        const result = yield call(LoadProductsApi, action.lastId)
        yield put({
            type: LOAD_PRODUCTS_SUCCESS,
            data: result.data,
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: LOAD_PRODUCTS_FAILURE,
            error: err.response.data,
        });
    }
}

function LoadSingleProductApi(id) { //hashtag/name
    return axios.get(`/product?id=${id}`,);
}
function* LoadSingleProduct(action) {
    try {
        const result = yield call(LoadSingleProductApi, action.id);
        yield delay(1000);
        yield put({
            type: LOAD_PRODUCT_SUCCESS,
            data: result.data
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: LOAD_PRODUCT_FAILURE,
            error: err.response.data,
        });
    }
}
function* watchRegisterProduct() {
    yield takeLatest(REGISTER_PRODUCT_REQUEST, RegisterProduct);

  }
function* watchUploadImages() {
    yield takeLatest(UPLOAD_IMAGES_REQUEST, UploadImages);

  }
function* watchAddProductReview() {
    yield throttle(3000, ADD_PRODUCT_REVIEW_REQUEST, AddProductReview);

  }

function* watchLoadProducts() {
    yield throttle(3000, LOAD_PRODUCTS_REQUEST, LoadProducts);
  }

function* watchLoadProduct() {
    yield throttle(3000, LOAD_PRODUCT_REQUEST, LoadSingleProduct);

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