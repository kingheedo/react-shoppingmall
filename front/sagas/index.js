import { all, fork } from 'redux-saga/effects';
// take, put, takeEvery, takeLatest, delay
import axios from 'axios';

import userSaga from './user';
import productSaga from './product';
import cartSaga from './cart'

axios.defaults.baseURL = 'http://localhost:3065';

export default function* rootSaga() {
    yield all([
        fork(userSaga),
        fork(productSaga),
        fork(cartSaga),
    ]);
}