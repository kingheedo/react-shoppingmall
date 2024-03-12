import React from 'react';
import getQueryClient from '../../../utils/getQueryClient';
import { dehydrate } from '@tanstack/react-query';
import HydrateOnClient from '../../../utils/hydrateOnClient';
import Result from './_component/Result';

type SearchParamsType = {
    orderId: string;
    paymentKey: string;
    amount: string;
  }

interface ISuccessPageProps{ 
  searchParams: SearchParamsType
}

/** paymentKey에 해당하는 결제를 검증하고 승인 */
const getConfirm = async(searchParams: SearchParamsType) => {
  const res = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(
        `${process.env.NEXT_PUBLIC_TOSS_PAYMENTS_SECRET_KEY}:`
      ).toString('base64')}`,
    },
    body: JSON.stringify({
      orderId: searchParams.orderId,
      paymentKey: searchParams.paymentKey,
      amount: searchParams.amount
    }),
  });

  return res.json();
};

const SuccessPage = async({
  searchParams
}: ISuccessPageProps) => {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);
  const data = await getConfirm(searchParams);
  console.log('data',data);
  
  return (
    <HydrateOnClient state={dehydratedState}>
      <Result
        tossPayment={data}
      />
    </HydrateOnClient>
  );
};

export default SuccessPage;