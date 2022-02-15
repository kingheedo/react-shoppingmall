export const ADD_PRODUCT_REVIEW_REQUEST = 'ADD_PRODUCT_REVIEW_REQUEST' as const;
export const ADD_PRODUCT_REVIEW_SUCCESS = 'ADD_PRODUCT_REVIEW_SUCCESS' as const;
export const ADD_PRODUCT_REVIEW_FAILURE = 'ADD_PRODUCT_REVIEW_FAILURE' as const;
export const LOAD_PAYMENT_LISTS_REQUEST = 'LOAD_PAYMENT_LISTS_REQUEST' as const;
export const LOAD_PAYMENT_LISTS_SUCCESS = 'LOAD_PAYMENT_LISTS_SUCCESS' as const;
export const LOAD_PAYMENT_LISTS_FAILURE = 'LOAD_PAYMENT_LISTS_FAILURE' as const;
export const ADD_PAYMENT_REQUEST = 'ADD_PAYMENT_REQUEST' as const;
export const ADD_PAYMENT_SUCCESS = 'ADD_PAYMENT_SUCCESS' as const;
export const ADD_PAYMENT_FAILURE = 'ADD_PAYMENT_FAILURE' as const;
export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST' as const;
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS' as const;
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE' as const;
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST' as const;
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS' as const;
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE' as const;
export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST' as const;
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS' as const;
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE' as const;
export const SIGN_UP_RESET = 'SIGN_UP_RESET' as const;
export const RESET_ADD_PAYMENT = 'RESET_ADD_PAYMENT' as const;
export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST' as const;
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS' as const;
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE' as const;
export interface PaymentLists {
id : number;
cancelled : boolean;
email : string;
paid : boolean
payerID : string;
paymentID : string;
paymentToken : string;
returnUrl : string;
createdAt : string;
HistoryCartId: number;
UserId: number;
CartId : number;

HistoryCart : {
  id:number;
  quantity : number;
totalPrice : number;
createdAt: number;
size : string;
ProductId: number;
UserId : number;

Product: {
  id : number;
  productName : string;
  Images: {src: string}[];
}

User : {
  id: number;
  email : string;
  name : string;
Reviews : {
  id :number;
  reviewUnique : string
}[];
}
}
}

export interface Me {
  email : string;
  name : string;
}

export interface UserState {
  me : null | Me;
  paymentLists: PaymentLists[];
  loadUserLoading: boolean,
  loadUserDone: boolean,
  loadUserError: any,

  loginLoading: boolean,
  loginDone: boolean,
  loginError: any,

  logoutLoading: boolean,
  logoutDone: boolean,
  logoutError: any,

  signUpLoading: boolean,
  signUpDone: boolean,
  signUpError: any,

  addPaymentLoading: boolean,
  addPaymentDone: boolean,
  addPaymentError: any,

  loadPaymentListsLoading: boolean,
  loadPaymentListsDone: boolean,
  loadPaymentListsError: any,

  addProductReviewLoading: boolean,
  addProductReviewDone: boolean,
  addProductReviewError: any,
}
export interface AddProductReviewRequest {
  type: typeof ADD_PRODUCT_REVIEW_REQUEST;
}
export interface AddProductReviewSuccess {
  type: typeof ADD_PRODUCT_REVIEW_SUCCESS;
  data : any
}
export interface AddProductReviewFailure {
  type: typeof ADD_PRODUCT_REVIEW_FAILURE;
  error: Error;
}
export interface LoadPaymentListsRequest{
  type : typeof LOAD_PAYMENT_LISTS_REQUEST;
}
export interface LoadPaymentListsSuccess{
  type : typeof LOAD_PAYMENT_LISTS_SUCCESS;
  data : PaymentLists[];
}
export interface LoadPaymentListsFailure{
  type : typeof LOAD_PAYMENT_LISTS_FAILURE;
  error: Error;
}
export interface AddPaymentListsRequest{
  type : typeof ADD_PAYMENT_REQUEST;
}
export interface addPaymentListsSuccess{
  type : typeof ADD_PAYMENT_SUCCESS;
}
export interface AddPaymentListsFailure{
  type : typeof ADD_PAYMENT_FAILURE;
  error: Error;
}
export interface LoadUserRequest{
  type : typeof LOAD_USER_REQUEST;
}
export interface LoadUserSuccess{
  type : typeof LOAD_USER_SUCCESS;
  data : Me;
}
export interface LoadUserFailure{
  type : typeof LOAD_USER_FAILURE;
  error: Error;
}
export interface LogInRequest{
  type : typeof LOG_IN_REQUEST;
}
export interface LogInSuccess{
  type : typeof LOG_IN_SUCCESS;
  data : Me;
}
export interface LogInFailure{
  type : typeof LOG_IN_FAILURE;
  error: Error;
}
export interface LogOutRequest {
  type : typeof LOG_OUT_REQUEST
}
export interface LogOutSuccess {
  type : typeof LOG_OUT_SUCCESS
}

export interface LogOutFailure {
  type : typeof LOG_OUT_FAILURE;
  error : Error;
}
export interface SignUpReset {
  type : typeof SIGN_UP_RESET;
}

export interface ResetAddPayment {
  type : typeof RESET_ADD_PAYMENT;
}

export interface SignUpRequest {
  type : typeof SIGN_UP_REQUEST;
}

export interface SignUpSuccess {
  type : typeof SIGN_UP_SUCCESS;
}

export interface SignUpFailure {
  type : typeof SIGN_UP_FAILURE;
  error: Error;
}
export type UserAction = AddProductReviewRequest | AddProductReviewSuccess | AddProductReviewFailure | LoadPaymentListsRequest | LoadPaymentListsSuccess | LoadPaymentListsFailure | AddPaymentListsRequest | addPaymentListsSuccess | AddPaymentListsFailure | LoadUserRequest | LoadUserSuccess | LoadUserFailure | LogInRequest | LogInSuccess | LogInFailure | LogOutRequest | LogOutSuccess | LogOutFailure | SignUpReset | ResetAddPayment | SignUpRequest | SignUpSuccess | SignUpFailure
