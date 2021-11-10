import { LOAD_PRODUCTS_FAILURE, LOAD_PRODUCTS_REQUEST, LOAD_PRODUCTS_SUCCESS,dummyProducts } from "../reducers/product";
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
            data: dummyProducts(),
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: LOAD_PRODUCTS_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchLoadProducts() {
    yield throttle(3000, LOAD_PRODUCTS_REQUEST, LoadProducts);
  }

  export default function* productSaga() {
    yield all([
        fork(watchLoadProducts),
        
    ]);
}