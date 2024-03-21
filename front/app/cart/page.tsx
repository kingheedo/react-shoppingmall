import React from 'react';
import getQueryClient from '../../utils/getQueryClient';
import apis from '../../apis';
import { dehydrate } from '@tanstack/react-query';
import HydrateOnClient from '../../utils/hydrateOnClient';
import CartMain from './_components/CartMain';
import { NextResponse } from 'next/server';
import { backUrl } from '../../config/backUrl';

const CartPage = async() => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(['getCartList'], async() => {
    try {
      await apis.Cart.getCartList();
    } catch (error) {
      console.error(error);
      NextResponse.redirect(`${backUrl}/signIn`);

      return null;
    }
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrateOnClient state={dehydratedState}>
      <CartMain/>
    </HydrateOnClient>
  );
};

export default CartPage;