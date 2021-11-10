import { all, fork } from 'redux-saga/effects';
// take, put, takeEvery, takeLatest, delay
import axios from 'axios';

import userSaga from './user';
import productSaga from './product';



export default function* rootSaga() {
    yield all([
        fork(userSaga),
        fork(productSaga),
    ]);
}