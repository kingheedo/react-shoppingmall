import React from 'react';
import { dehydrate } from '@tanstack/react-query';
import getQueryClient from '../utils/getQueryClient';
import apis from '../apis';
import HydrateOnClient from '../utils/hydrateOnClient';
import Slide from './_component/Slide';
import Products from './_component/Products';

const MainPage = async() => {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(['getProducts'], () => apis.Product.getProducts());
  
  const dehydratedState = JSON.parse(JSON.stringify(dehydrate(queryClient)));
  
  return (
    <HydrateOnClient state={dehydratedState}>
      <main>
        <Slide/>
        <Products />
      </main>
    </HydrateOnClient>
  );
};

export default MainPage;