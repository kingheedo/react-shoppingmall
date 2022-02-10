import {
  AddPaymentListsRequest, ADD_PAYMENT_REQUEST, LoadPaymentListsRequest, LoadUserRequest, LOAD_PAYMENT_LISTS_REQUEST, LOAD_USER_REQUEST, LogInRequest, LogOutRequest, LOG_IN_REQUEST, LOG_OUT_REQUEST, ResetAddPayment, RESET_ADD_PAYMENT, SignUpRequest, SignUpReset, SIGN_UP_REQUEST, SIGN_UP_RESET,
} from '../asyncActionTypes/userTypes';

export interface LogIn extends LogInRequest{
    data : {
        email : string,
        password : string,
    }
}
export interface SignUp extends SignUpRequest{
    data: {
        email : string,
        name : string,
        password : string,
    }
}
export interface AddPaymentLists extends AddPaymentListsRequest {
  data: {
    CartItemsId : number[],
    payment : any
  }
}
export const addPaymentLists = (data : {CartItemsId : number[], payment: any}):AddPaymentLists => {
  return {
    type: ADD_PAYMENT_REQUEST,
    data,
  };
};
export const loadPaymentLists = ():LoadPaymentListsRequest => {
  return {
    type: LOAD_PAYMENT_LISTS_REQUEST,
  };
};

export const loadUser = ():LoadUserRequest => {
  return {
    type: LOAD_USER_REQUEST,
  };
};

export const logOut = ():LogOutRequest => {
  return {
    type: LOG_OUT_REQUEST,
  };
};

export const logIn = (data:{email: string, password: string}):LogIn => {
  return {
    type: LOG_IN_REQUEST,
    data,
  };
};

export const signUp = (data:{email: string, name: string, password: string}):SignUp => {
  return {
    type: SIGN_UP_REQUEST,
    data,
  };
};

export const signUpReset = ():SignUpReset => {
  return {
    type: SIGN_UP_RESET,
  };
};
export const resetAddPayment = ():ResetAddPayment => {
  return {
    type: RESET_ADD_PAYMENT,
  };
};
