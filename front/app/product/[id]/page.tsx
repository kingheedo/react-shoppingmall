import React from 'react';
import ProductDetail from './_component/item';
import getQueryClient from '../../../utils/getQueryClient';
import apis from '../../../apis';
import { dehydrate } from '@tanstack/react-query';
import HydrateOnClient from '../../../utils/hydrateOnClient';

interface IProductHomePageProps {
  params: {
    id: string;
  };
}

const ProductHomePage = async({ params }: IProductHomePageProps) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(['getSingleProduct', params.id], () => apis.Product.getSingleProduct(params.id));
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrateOnClient state={dehydratedState}>
      <ProductDetail
        id ={params.id}
      />
    </HydrateOnClient>
  );
};

export default ProductHomePage;