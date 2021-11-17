import { LOAD_PRODUCTS_FAILURE, LOAD_PRODUCTS_REQUEST, LOAD_PRODUCTS_SUCCESS,dummyProducts, dummyProduct, LOAD_PRODUCT_SUCCESS, LOAD_PRODUCT_FAILURE, LOAD_PRODUCT_REQUEST, fakerProducts } from "../reducers/product";
import axios from 'axios'
import { all, delay, fork, put, throttle } from "@redux-saga/core/effects";

function LoadProductsApi(data) { //hashtag/name
    return axios.get('api/product', data);
}
function* LoadProducts(action) {
    try {
        // const result = yield call(LoadProductsApi, action.data);
        yield delay(1000);
        yield put({
            type: LOAD_PRODUCTS_SUCCESS,
            data: fakerProducts(),
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
            data: dummyProduct(),
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: LOAD_PRODUCT_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchLoadProducts() {
    yield throttle(3000, LOAD_PRODUCTS_REQUEST, LoadProducts);
  }
  function* watchLoadProduct() {
    yield throttle(3000, LOAD_PRODUCT_REQUEST, LoadSingleProduct);

  }

  export default function* productSaga() {
    yield all([
        fork(watchLoadProducts),
        fork(watchLoadProduct),
    ]);
}