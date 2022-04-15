import { all, fork } from 'redux-saga/effects';
// take, put, takeEvery, takeLatest, delay
import axios from 'axios';

import userSaga from './user';
import productSaga from './product';
import cartSaga from './cart';
import { backUrl } from '../config/backUrl';

axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  yield all([
    fork(userSaga),
    fork(productSaga),
    fork(cartSaga),
  ]);
}
