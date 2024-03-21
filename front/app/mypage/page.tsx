import React from 'react';
import getQueryClient from '../../utils/getQueryClient';
import apis from '../../apis';
import { dehydrate } from '@tanstack/react-query';
import HydrateOnClient from '../../utils/hydrateOnClient';
import MyPageMain from './_components/MyPageMain';
import { NextResponse } from 'next/server';
import { backUrl } from '../../config/backUrl';

const MyPage = async() => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(['getAllPayments'], async() => {
    try {
      await apis.Payment.getAllPayments({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)),
        endDate: new Date(),
        page: 0
      });
    } catch (error) {
      console.log(error);
      NextResponse.redirect(`${backUrl}/signIn`);

      return null;
    }
  });
  const dehydratedState = dehydrate(queryClient);
  
  return (
    <HydrateOnClient state={dehydratedState}>
      <MyPageMain/>
    </HydrateOnClient>
  );
};

export default MyPage;