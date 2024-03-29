import { PaymentWidgetInstance, loadPaymentWidget } from '@tosspayments/payment-widget-sdk';
import React, { useCallback, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import styled from 'styled-components';
import { PaymentInfo } from '..';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PostPaymentReq } from '../../../apis/payment/schema';
import apis from '../../../apis';
import BillWrap from '../../common/BillWrap';
import { useRouter, useSearchParams } from 'next/navigation';

const PaymentWrapper = styled.div``;

const PaymentWidget = styled.div`
  width: 100%;
`;

const Agreement = styled.div`
  width: 100%;
`;

const SubmitWrap = styled.div`
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
  const router = useRouter();
  const { mutate: addPayment } = useMutation((data: PostPaymentReq) => apis.Payment.addPayment(data));
  const searchParams = useSearchParams();

  const { data: userInfo } = useQuery(
    ['getUser'], 
    () => apis.User.getUser());

  const createQueryString = useCallback(
    (query:{
      [key: string]: string;
    }) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [name, value] of Object.entries(query)) {
        if (name && value) {
          params.set(name,value);
        }
      }
 
      return params.toString();
    },
    [searchParams]
  );

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
      const { orderId, paymentKey, amount , paymentType } = data;

      if (orderId && paymentKey && amount) {
        // 주소 추가
        await apis.User.addAddress({
          rcName: info.delivery.rcName,
          rcPhone: info.delivery.rcPhone,
          rcPostNum: info.delivery.address.rcPostNum,
          rcPostBase: info.delivery.address.rcPostBase,
          rcPostDetail: info.delivery.address.rcPostDetail,
          base: info.delivery.address.base
        });

        await addPayment({
          orderId,
          paymentKey,
          paymentType,
          cartIds: info.cartIds,
          rcName: info.delivery.rcName,
          rcPhone: info.delivery.rcPhone,
          rcPostNum: info.delivery.address.rcPostNum,
          rcPostBase: info.delivery.address.rcPostBase,
          rcPostDetail: info.delivery.address.rcPostDetail,
        });

        // router.replace({
        //   pathname: '/order/success',
        //   query: {
        //     orderId: data.orderId,
        //     paymentKey: data.paymentKey,
        //     amount: data.amount
        //   },
        // },
        // '/order/success'
        // );
        // router.replace(
        //   '/order/success',
        //   undefined,
        //   {
        //     orderId: data.orderId,
        //     paymentKey: data.paymentKey,
        //     amount: data.amount
        //   }
        // );
        console.log('data',data);
        
        // router.push(`/order/success?orderId=${data.orderId}?paymentKey=${data.paymentKey}?amount=${data.amount}`);
        router.replace(`order/success/?${createQueryString(data)}`);
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
    <PaymentWrapper>
      <PaymentWidget id="payment-widget"/>
      <Agreement id="agreement"/>
      <BillWrap
        totalPrice={info.totalPrice}
      />
      <SubmitWrap>
        <p>위 주문 내용을 확인하였으며 결제에 동의합니다.</p>
        <button onClick={onClickPaymentBtn}>
          결제하기
        </button>
      </SubmitWrap>
    </PaymentWrapper>
  );
};

export default Payments;