import { createSlice } from '@reduxjs/toolkit';
import { addProductReview } from './asyncRequest/product';
import {
  addPayment,
 loadPaymentLists, loadUser, logIn, logOut, signUp,
} from './asyncRequest/user';
import { UserState } from './reducerTypes/userTypes';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
  me: null,
  paymentLists: [],
  loadUserLoading: false,
  loadUserDone: false,
  loadUserError: null,

  logInLoading: false,
  logInDone: false,
  logInError: null,

  logOutLoading: false,
  logOutDone: false,
  logOutError: null,

  signUpLoading: false,
  signUpDone: false,
  signUpError: null,

  addPaymentLoading: false,
  addPaymentDone: false,
  addPaymentError: null,

  loadPaymentListsLoading: false,
  loadPaymentListsDone: false,
  loadPaymentListsError: null,

  addProductReviewLoading: false,
  addProductReviewDone: false,
  addProductReviewError: false,
} as UserState,
reducers: {
  signUpReset: (state) => {
    state.signUpDone = false;
  },
},
extraReducers: {
  [addProductReview.pending as any]: (state) => {
    state.addProductReviewLoading = true;
    state.addProductReviewDone = false;
    state.addProductReviewError = false;
  },
 [addProductReview.fulfilled as any]: (state, action) => {
    state.addProductReviewLoading = false;
    state.addProductReviewDone = true;
    state.paymentLists.forEach((v) => v.HistoryCart.User.Reviews.push(action.payload.Review));
  },
  [addProductReview.rejected as any]: (state, action) => {
    state.addProductReviewLoading = false;
    state.addProductReviewDone = false;
    state.addProductReviewError = action.error.message;
  },
  [loadPaymentLists.pending as any]: (state) => {
    state.loadPaymentListsLoading = true;
    state.loadPaymentListsDone = false;
    state.loadPaymentListsError = false;
  },
 [loadPaymentLists.fulfilled as any]: (state, action) => {
    state.loadPaymentListsLoading = false;
    state.loadPaymentListsDone = true;
    state.paymentLists = action.payload;
  },
  [loadPaymentLists.rejected as any]: (state, action) => {
    state.loadPaymentListsLoading = false;
    state.loadPaymentListsDone = false;
    state.loadPaymentListsError = action.error.message;
  },
  [addPayment.pending as any]: (state) => {
    state.addPaymentLoading = true;
    state.addPaymentDone = false;
    state.addPaymentError = false;
  },
 [addPayment.fulfilled as any]: (state) => {
    state.addPaymentLoading = false;
    state.addPaymentDone = true;
  },
  [addPayment.rejected as any]: (state, action) => {
    state.addPaymentLoading = false;
    state.addPaymentDone = false;
    state.addPaymentError = action.error.message;
  },
  [loadUser.pending as any]: (state) => {
    state.loadUserLoading = true;
    state.loadUserDone = false;
    state.loadUserError = false;
  },
 [loadUser.fulfilled as any]: (state, action) => {
    state.loadUserLoading = false;
    state.loadUserDone = true;
    state.me = action.payload;
  },
  [loadUser.rejected as any]: (state, action) => {
    state.loadUserLoading = false;
    state.loadUserDone = false;
    state.loadUserError = action.error.message;
  },
  [logOut.pending as any]: (state) => {
    state.logOutLoading = true;
    state.logOutDone = false;
    state.logOutError = false;
  },
 [logOut.fulfilled as any]: (state) => {
    state.logOutLoading = false;
    state.logOutDone = true;
    state.me = null;
  },
  [logOut.rejected as any]: (state, action) => {
    state.logOutLoading = false;
    state.logOutDone = false;
    state.logOutError = action.error.message;
  },
  [logIn.pending as any]: (state) => {
    state.logInLoading = true;
    state.logInDone = false;
    state.logInError = false;
  },
 [logIn.fulfilled as any]: (state, action) => {
    state.logInLoading = false;
    state.logInDone = true;
    state.me = action.payload;
  },
  [logIn.rejected as any]: (state, action) => {
    state.logInLoading = false;
    state.logInDone = false;
    state.logInError = action.error.message;
  },
  [signUp.pending as any]: (state) => {
    state.signUpLoading = true;
    state.signUpDone = false;
    state.signUpError = false;
  },
  [signUp.fulfilled as any]: (state) => {
    state.signUpLoading = false;
    state.signUpDone = true;
  },
  [signUp.rejected as any]: (state, action) => {
    state.signUpLoading = false;
    state.signUpDone = false;
    state.signUpError = action.error.message;
  },
},
});
export const { signUpReset } = userSlice.actions;
export default userSlice.reducer;
