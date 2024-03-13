import React from 'react';
import MainComponent from './_component/Main';
import { dehydrate } from '@tanstack/react-query';
import getQueryClient from '../utils/getQueryClient';
import apis from '../apis';
import HydrateOnClient from '../utils/hydrateOnClient';

const MainPage = async() => {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(['getProducts'], () => apis.Product.getProducts());
  
  const dehydratedState = JSON.parse(JSON.stringify(dehydrate(queryClient)));
  
  return (
    <HydrateOnClient state={dehydratedState}>
      <MainComponent/>
    </HydrateOnClient>
  );
};

export default MainPage;