import React from 'react';
import BreadCrumb from '../../../components/common/BreadCrumb';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import styled from 'styled-components';

type Payment = {
  orderId: string;
  orderName: string;
  approvedAt: string;
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
  const { query: { paymentKey, orderId, amount } } = context;

  try {
    const { data: payment } = await axios.post<Payment>(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        paymentKey,
        orderId,
        amount,
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
  '06': '국민'
};

interface IOrderSuccessPageProps{
  payment: Payment;
}

const OrderSuccessPage = ({ payment }: IOrderSuccessPageProps) => {

  console.log('payment',payment);
  
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
            주문하신 주문번호는 <strong>{payment.orderId}</strong> 입니다.
          </p>
          <ul>
            <li className="total-amount">
              <span>
                입금금액
              </span>
              <strong>
                {payment.totalAmount.toLocaleString('ko-KR')}원
              </strong>
            </li>
            <li className="account-info">
              <span>
                계좌정보
              </span>
              <strong>
                {payment.virtualAccount && BankCodeObj[payment.virtualAccount.bankCode]}{payment.virtualAccount?.accountNumber}{payment.virtualAccount?.customerName}
              </strong>
            </li>
            <li className="due-date">
              <span>
                입금마감
              </span>
              <strong>
                {payment.virtualAccount?.dueDate.split('T')[0]}까지
              </strong>
            </li>
          </ul>

        </OrderDetail>
      </Main>
    </div>
  );
};

export default OrderSuccessPage;