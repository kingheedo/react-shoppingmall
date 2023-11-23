import { PaymentWidgetInstance, loadPaymentWidget } from '@tosspayments/payment-widget-sdk';
import React, { useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import styled from 'styled-components';
import BillInfo from './BillInfo';
import { PaymentInfo } from '..';
import { getUser } from '../../../context/LoginProvider';
import { useRouter } from 'next/router';

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
  info: PaymentInfo;
}

const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY!;
const customerKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CUSTOMER_KEY!;

/** 토스페이먼츠 결제모듈 컴포넌트 */
const Payments = ({
  info
}: IPaymentsProps) => {
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance['renderPaymentMethods']
  > | null>(null);
  const userInfo = getUser();
  const router = useRouter();
  console.log('info',info);
  
  /** 결제하기 버튼 클릭 시
   * 1. db에 주문 정보 및 배송지 정보 저장 필요
   * 2. 결제하기 api 요청 이후 orderId, paymnetKey, amount 존재 시 주문성공페이지로 라우팅
    */
  const onClickPaymentBtn = async() => {
    const paymentWidget = paymentWidgetRef.current;
    try {
      const data = await paymentWidget?.requestPayment({
        orderId: nanoid(),
        orderName: info.orderName,
        customerName: userInfo?.info.name,
        customerEmail: userInfo?.info.email,
        // successUrl: `${window.location.origin}/order/success`,
        // failUrl: `${window.location.origin}`
      });
      if (data.orderId && data.paymentKey && data.amount) {
        router.push({
          pathname: '/order/success',
          query: {
            orderId: data.orderId,
            paymentKey: data.paymentKey,
            amount: data.amount
          },
        },
        '/order/success'
        );
      }
      
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
        { value: info.totalPrice },
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

    paymentMethodsWidget.updateAmount(info.totalPrice);
  }, [info.totalPrice]);

  return (
    <div className="payment-wrapper">
      <PaymentWidget id="payment-widget"/>
      <Agreement id="agreement"/>
      <BillInfo
        totalPrice={info.totalPrice}
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