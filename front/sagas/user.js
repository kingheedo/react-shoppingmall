import { LOAD_PRODUCTS_FAILURE, LOAD_PRODUCTS_REQUEST, LOAD_PRODUCTS_SUCCESS,dummyProducts } from "../reducers/product";
import axios from 'axios'
import { all, delay, fork, put, throttle } from "@redux-saga/core/effects";
import { dummyUser, LOG_IN_FAILURE, LOG_IN_REQUEST, LOG_IN_SUCCESS } from "../reducers/user";

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

  export default function* productSaga() {
    yield all([
        fork(watchLogin),
        
    ]);
}