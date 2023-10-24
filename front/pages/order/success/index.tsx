import React from 'react';
import BreadCrumb from '../../../components/common/BreadCrumb';
import { GetServerSideProps } from 'next';
import axios from 'axios';

type Payment = {
  orderName: string;
  approvedAt: string;
  receipt: {
    url: string;
  };
  totalAmount: number;
  method: '카드' | '가상계좌' | '계좌이체';
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
    </div>
  );
};

export default OrderSuccessPage;