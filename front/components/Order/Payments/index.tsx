import { PaymentWidgetInstance, loadPaymentWidget } from '@tosspayments/payment-widget-sdk';
import React, { useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import styled from 'styled-components';
import BillInfo from './BillInfo';

const PaymentWidget = styled.div`
  width: 100%;
`;

const Agreement = styled.div`
  width: 100%;
`;

const SubmitOrder = styled.div`
  margin-top: 50px;
  text-align: center;
  > p{
    padding-bottom: 20px;
    color: #111;
  }

  > button {
      display: inline-block;
      color: #fff;
      background: #111;
      border: 1px solid #111;
      margin: 0 4px;
      min-width: 256px;
      padding: 0 69px;
      height: 60px;
      line-height: 58px;
      font-size: 17px;
      text-align: center;
  }
`;

interface IPaymentsProps {
  totalPrice: number;
}

const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY!;
const customerKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CUSTOMER_KEY!;

const Payments = ({
  totalPrice
}: IPaymentsProps) => {
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance['renderPaymentMethods']
  > | null>(null);
  
  /** 결제하기 버튼 클릭 시  */
  const onClickPaymentBtn = async() => {
    const paymentWidget = paymentWidgetRef.current;

    try {
      await paymentWidget?.requestPayment({
        orderId: nanoid(),
        orderName: '토스 티셔츠 외 2건',
        customerName: '김토스',
        customerEmail: 'customer123@gmail.com',
        successUrl: `${window.location.origin}/order/success`,
        failUrl: `${window.location.origin}`
      });
    }
    catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      const paymentWidget = await loadPaymentWidget(clientKey, customerKey);
      const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
        '#payment-widget',
        { value: totalPrice },
      );
      paymentWidget.renderAgreement('#agreement');

      paymentWidgetRef.current = paymentWidget;
      paymentMethodsWidgetRef.current = paymentMethodsWidget;
    })();
  }, []);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget === null) {
      return;
    }

    paymentMethodsWidget.updateAmount(totalPrice);
  }, [totalPrice]);
  
  return (
    <div className="payment-wrapper">
      <PaymentWidget id="payment-widget"/>
      <Agreement id="agreement"/>
      <BillInfo
        totalPrice={totalPrice}
      />
      <SubmitOrder>
        <p>위 주문 내용을 확인하였으며 결제에 동의합니다.</p>
        <button onClick={onClickPaymentBtn}>
          결제하기
        </button>
      </SubmitOrder>
    </div>
  );
};

export default Payments;