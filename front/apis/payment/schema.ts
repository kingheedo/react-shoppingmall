import { GetCartListRes } from '../cart/schema';

enum PaymentType {
  NORMAL = 'NORMAL',
  BRANDPAY = 'BRANDPAY',
  KEYIN = 'KEYIN',
}
type PaymentInfo = {
    orderId: string;
    paymentKey: string;
    paymentType: PaymentType.NORMAL | PaymentType.BRANDPAY | PaymentType.KEYIN,
    rcName: string;
    rcPhone: string;
    rcPostNum: string;
    rcPostBase: string;
    rcPostDetail: string;
}
type HistoryCart = {
    id: number,
    quantity: number,
    totalPrice: number,
    size: string,
    UserId: number,
    Product: {
        id: number,
        productName: string,
        price: number,
        stock: number,
        UserId: number,
        Images: {
          id: number;
          src: string;
        }[]
    }
}
export type PostPaymentReq = PaymentInfo & { cartIds: number[] };

export type PostPaymentRes = string;

export type GetPaymentsReq = string;
export type GetPaymentsRes = (PaymentInfo & { id: number } & { HistoryCart: GetCartListRes })[];

export type GetAllPaymentsRes = (PaymentInfo & { HistoryCart: HistoryCart })[];