import React, { useEffect, useState } from 'react';
import BreadCrumb from '../../../components/common/BreadCrumb';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const Main = styled.div`
  width: 960px;
  margin: 0 auto;
  padding: 80px var(--gap) 120px;
`;

const OrderDetail = styled.div`
  background: url(/bg_fin_check.svg) no-repeat 2px 46px/70px auto;
  padding: 138px 0 50px;
  > h2{
    font-size: 25px;
    line-height: 36px;
    color: #111;
  }

  > p{
    padding-top: 20px;
    font-size: 15px;
    line-height: 22px;

    > strong{
      font-weight: 700;
    }
  }

  > ul{
    padding-top: 20px;
    > li{
      padding-bottom: 10px;
      
      > span{
          font-weight: 700;
          display: inline-block;
          width: 75px;
          color: #767676;
      }
      > strong{
        font-weight: 700;
      }
    }
    .due-date{
        > strong{
          color: #8e1fff;
        }
      }
  }
`;

const BankCodeObj: {
  [key: string]: string;
} = {
  '39': '경남',
  '12': '단위농협',
  '32': '부산',
  '45': '새마을',
  '64': '산림',
  '88': '신한',
  '48': '신협',
  '27': '씨티',
  '20': '우리',
  '71': '우체국',
  '50': '저축',
  '37': '전북',
  '35': '제주',
  '90': '카카오',
  '92': '토스',
  '81': '하나',
  '54': '',
  '03': '기업',
  '06': '국민',
  '31': '대구',
  '02': '산업',
  '11': '농협',
  '23': 'SC제일',
  '07': '수협'
};
type Payment = {
  orderId: string;
  paymentKey: string;
  orderName: string;
  approvedAt: string;
  amount: number;
  receipt: {
    url: string;
  };
  totalAmount: number;
  method: '카드' | '가상계좌' | '계좌이체';
  virtualAccount?:{
    bankCode: string;
    customerName: string;
    dueDate: string;
    accountNumber: string;
  }
}

export const getServerSideProps:GetServerSideProps = async(context) => {
  const { query: {
    orderId,
    paymentKey,
    amount
  } } = context;
  
  try {
    const { data: payment } = await axios.post<Payment>(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        orderId: orderId,
        paymentKey: paymentKey,
        amount: amount
        
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_TOSS_PAYMENTS_SECRET_KEY}:`
          ).toString('base64')}`,
        },
      }
    );

    return {
      props: { payment }
    };
  }
  catch (error) {
    console.error(error);

    return {
      props: {

      }
    };
  }
};

interface IOrderSuccessPageProps{
  payment: Payment;
}

const OrderSuccessPage = ({ payment }: IOrderSuccessPageProps) => {
  const router = useRouter();

  useEffect(() => {
    if (!payment) {
      router.push('/');
    }
  }, [payment]);

  return (
    <div className="order-succss-page">
      <BreadCrumb
        list={[{ content: '주문완료' }]}
      />
      <Main className="order-success">
        <OrderDetail>
          <h2>
            주문이 완료되었습니다.
          </h2>
          <p>
            주문하신 주문번호는 <strong>{payment?.orderId}</strong> 입니다.
          </p>
          <ul>
            <li className="total-amount">
              <span>
                입금금액
              </span>
              <strong>
                {payment?.totalAmount.toLocaleString('ko-KR')}원
              </strong>
            </li>
            <li className="account-info">
              <span>
                계좌정보
              </span>
              <strong>
                {payment?.virtualAccount && BankCodeObj[payment?.virtualAccount.bankCode]}{payment?.virtualAccount?.accountNumber}{payment?.virtualAccount?.customerName}
              </strong>
            </li>
            <li className="due-date">
              <span>
                입금마감
              </span>
              <strong>
                {payment?.virtualAccount?.dueDate.split('T')[0]}까지
              </strong>
            </li>
          </ul>

        </OrderDetail>
      </Main>
    </div>
  );
};

export default OrderSuccessPage;