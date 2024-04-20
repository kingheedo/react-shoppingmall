import { PaymentWidgetInstance, loadPaymentWidget } from '@tosspayments/payment-widget-sdk';
import React, { useCallback, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import styled from 'styled-components';
import { PaymentInfo } from '..';
import BillWrap from '../../common/BillWrap';
import { useRouter, useSearchParams } from 'next/navigation';
import useAddPayment from '../../../hooks/mutations/useAddPayment';
import useGetUser from '../../../hooks/queries/useGetUser';
import useAddAddress from '../../../hooks/mutations/useAddAddress';

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
  const { addPayment } = useAddPayment();
  const searchParams = useSearchParams();

  const { user } = useGetUser();

  const createQueryString = useCallback(
    (query: {
      [key: string]: string;
    }) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [name, value] of Object.entries(query)) {
        if (name && value) {
          params.set(name, value);
        }
      }

      return params.toString();
    },
    [searchParams]
  );

  /** 주소 정보 폼 유효성 확인 */
  const checkDelivery = () => {
    const phoneRegex = /^\d{3}\d{4}\d{4}$/;
    if (!info.delivery.rcName) {
      alert('이름을 입력해주세요');

      return false;
    }
    if (!info.delivery.rcPhone) {
      alert('휴대폰번호를 입력해주세요');

      return false;
    }
    if (!phoneRegex.test(info.delivery.rcPhone)) {
      alert('휴대폰 형식이 올바르지 않습니다.');

      return false;
    }
    if (!info.delivery.address.rcPostNum) {
      alert('우편번호를 입력해주세요');

      return false;
    }

    return true;
  };

  /** 결제하기 버튼 클릭 시
   * 1. db에 주문 정보 및 배송지 정보 저장 필요
   * 2. 결제하기 api 요청 이후 orderId, paymnetKey, amount 존재 시 주문성공페이지로 라우팅
    */
  const onClickPaymentBtn = async () => {
    const validForm = checkDelivery();
    if (!validForm) {
      return;
    }
    const paymentWidget = paymentWidgetRef.current;
    try {
      const data = await paymentWidget?.requestPayment({
        orderId: nanoid(),
        orderName: info.orderName,
        customerName: user?.info.name,
        customerEmail: user?.info.email,
        // successUrl: `${window.location.origin}/order/success`,
        // failUrl: `${window.location.origin}`
      });
      const { orderId, paymentKey, amount, paymentType } = data;

      console.log('data', data);
      console.log('info', info);
      if (orderId && paymentKey && amount) {
        // 주소 추가
        await useAddAddress({
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
      <PaymentWidget id="payment-widget" />
      <Agreement id="agreement" />
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