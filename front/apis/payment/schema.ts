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
    createdAt: string;
}
export type HistoryCart = {
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
export type PostPaymentReq = Partial<PaymentInfo> & { cartIds: number[] };

export type PostPaymentRes = string;

export type GetPaymentsReq = string;
export type GetPaymentsRes = (PaymentInfo & { id: number } & { HistoryCart: GetCartListRes })[];

export type GetAllPaymentsReq = {
  startDate: Date;
  endDate: Date;
}
export type GetAllPaymentsRes = (PaymentInfo & { id: number } & { HistoryCart: HistoryCart })[];

export enum SettlementState {
  INCOMPLETED = 'INCOMPLETED',
  COMPLETED = 'COMPLETED'
}
export type GetTossPmntOrderReq = string;
export type GetTossPmntOrderRes = {
  mId: string,
  lastTransactionKey: string,
  paymentKey: string,
  orderId: string,
  orderName: string,
  taxExemptionAmount: number,
  status: 'READY' | 'IN_PROGRESS' | 'WAITING_FOR_DEPOSIT' | 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' | 'ABORTED' | 'EXPIRED',
  requestedAt: string,
  approvedAt?: string,
  useEscrow: boolean,
  cultureExpense: boolean,
  card: null,
  virtualAccount: {
    accountNumber: string,
    accountType: '일반' | '고정',
    bankCode: string,
    customerName: string,
    dueDate: string,
    expired: boolean,
    settlementStatus: SettlementState,
    refundStatus: 'NONE' | 'PENDING' | 'FAILED' | 'PARTIAL_FAILED' | 'COMPLETED',
    refundReceiveAccount: null
  },
  transfer?: {
    bankCode: string;
    settlementStatus: SettlementState,
  },
  mobilePhone?: {
    customerMobilePhone: string;
    settlementStatus: SettlementState,
    receiptUrl: string;
  },
  giftCertificate?: {
    approveNo: string;
    settlementStatus: SettlementState,
  },
  cashReceipt?: {
    type: '소득공제' | '지출증빙';
    receiptKey: string;
    issueNumber: string;
    receiptUrl: string;
    amount: number;
    taxFreeAmount: number;
  },
  cashReceipts?: {
    receiptKey: string;
    orderId: string;
    orderName: string;
    type: '소득공제' | '지출증빙';
    issueNumber: string;
    receiptUrl: string
    businessNumber: string;
    transactionType: 'CONFIRM' | 'CANCEL';
    amountL: number;
    taxFreeAmount: number;
    issueStatus: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    failure: any;
    customerIdentity: string;
    requestedAt: string;
  },
  discount?: {
    amount: number;
  },
  cancels?: {
    cancelAmount:number;
    cancelReason: string;
    taxFreeAmount: number;
    taxExemptionAmount: number;
    refundableAmount: number;
    easyPayDiscountAmount: number;
    canceledAt: string;
    transactionKey: string;
    receiptKey?:string;
  },
  secret?: string,
  type: 'NORMAL' | 'BILLING' | 'BRANDPAY',
  easyPay?: {
    provider: string;
    amount: number;
    discountAmount: number;
  },
  country: string,
  failure?: {
    code: string;
    message: string;
  },
  isPartialCancelable: boolean,
  receipt: {
    url: string;
  },
  checkout: {
    url: string;
  },
  currency: string;
  totalAmount: number,
  balanceAmount: number,
  suppliedAmount: number,
  vat: number,
  taxFreeAmount: number,
  method: '카드' | '가상계좌' | '간편결제' | '휴대폰' | '계좌이체' | '문화상품권' | '도서문화상품권' | '게임문화상품권';
  version: string;
}