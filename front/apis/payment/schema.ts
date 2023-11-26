enum Payment {
  NORMAL = 'NORMAL',
  BRANDPAY = 'BRANDPAY',
  KEYIN = 'KEYIN',
}
export type PostPaymentReq = {
    orderId: string;
    paymentKey: string;
    paymentType: Payment.NORMAL | Payment.BRANDPAY | Payment.KEYIN,
    cartIds: number[];
    rcName: string;
    rcPhone: string;
    rcPostNum: string;
    rcPostBase: string;
    rcPostDetail: string;
}

export type PostPaymentRes = string;

export type GetPaymentsReq = string;
export type GetPaymentsRes = {
    orderId: string;
    paymentKey: string;
    paymentType: Payment.NORMAL | Payment.BRANDPAY | Payment.KEYIN,
    cartIds: number[];
    rcName: string;
    rcPhone: string;
    rcPostNum: string;
    rcPostBase: string;
    rcPostDetail: string;
}