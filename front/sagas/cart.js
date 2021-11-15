import { all, delay, fork, put, throttle } from "@redux-saga/core/effects";
import { ADD_PRODUCT_CART_FAILURE, ADD_PRODUCT_CART_REQUEST, ADD_PRODUCT_CART_SUCCESS } from "../reducers/cart";
import { dummyProduct } from "../reducers/product";

function AddProductCartApi(data) { //hashtag/name
    return axios.get('api/product', data);
}
function* AddProductCart(action) {
    try {
        // const result = yield call(AddProductCartApi, action.data);
        yield delay(1000);
        yield put({
            type: ADD_PRODUCT_CART_SUCCESS,
            data: dummyProduct(parseInt(action.data.productId,10),action.data.size, action.data.quantity, parseInt(action.data.pluralPrice,10)),
        });
    } catch (err) {
      console.error(err);
        yield put({
            type: ADD_PRODUCT_CART_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchAddProductCart() {
    yield throttle(3000, ADD_PRODUCT_CART_REQUEST, AddProductCart);
  }
  

  export default function* productSaga() {
    yield all([
        fork(watchAddProductCart),
    ]);
}