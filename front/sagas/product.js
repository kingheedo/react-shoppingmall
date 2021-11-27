import { LOAD_PRODUCTS_FAILURE, LOAD_PRODUCTS_REQUEST, LOAD_PRODUCTS_SUCCESS,dummyProducts, dummyProduct, LOAD_PRODUCT_SUCCESS, LOAD_PRODUCT_FAILURE, LOAD_PRODUCT_REQUEST, fakerProducts, ADD_PRODUCT_REVIEW_REQUEST, ADD_PRODUCT_REVIEW_SUCCESS, ADD_PRODUCT_REVIEW_FAILURE } from "../reducers/product";
import axios from 'axios'
import { all, delay, fork, put, throttle } from "@redux-saga/core/effects";

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

function LoadProductsApi(data) { //hashtag/name
    return axios.get('api/product', data);
}
function* LoadProducts(action) {
    try {
        // const result = yield call(LoadProductsApi, action.data);
        yield put({
            type: LOAD_PRODUCTS_SUCCESS,
            data: fakerProducts(10),
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: LOAD_PRODUCTS_FAILURE,
            error: err.response.data,
        });
    }
}

function LoadSingleProductApi(data) { //hashtag/name
    return axios.get('api/product', data);
}
function* LoadSingleProduct(action) {
    try {
        // const result = yield call(LoadSingleProductApi, action.data);
        yield delay(1000);
        yield put({
            type: LOAD_PRODUCT_SUCCESS,
            data: dummyProduct(parseInt(action.data,10)),
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: LOAD_PRODUCT_FAILURE,
            error: err.response.data,
        });
    }
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
        fork(watchAddProductReview),
        fork(watchLoadProducts),
        fork(watchLoadProduct),
    ]);
}