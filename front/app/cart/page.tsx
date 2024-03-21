import React from 'react';
import getQueryClient from '../../utils/getQueryClient';
import apis from '../../apis';
import { Hydrate, dehydrate } from '@tanstack/react-query';
import CartMain from './_components/CartMain';
import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';
import { backUrl } from '../../config/backUrl';

const CartPage = async() => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(['getCartList'], async() => {
    try {
      await apis.Cart.getCartList();
    } catch (error) {
      console.log(error);
      NextResponse.redirect(`${backUrl}/signIn`);
      notFound();
    }
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <CartMain />
    </Hydrate>
  );
};

export default CartPage;