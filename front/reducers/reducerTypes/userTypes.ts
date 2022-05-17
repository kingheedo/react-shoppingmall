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

  logInLoading: boolean,
  logInDone: boolean,
  logInError: any,

  logOutLoading: boolean,
  logOutDone: boolean,
  logOutError: any,

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
