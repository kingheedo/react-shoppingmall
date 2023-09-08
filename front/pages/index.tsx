import React, { FC, useMemo, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ImageSlider from '../components/ImageSlider/ImageSlider';
import { GetServerSideProps } from 'next';
import { QueryClient, dehydrate, useInfiniteQuery } from '@tanstack/react-query';
import useInterSectionObserver from '../hooks/useInterSectionObserver';
import Product from '../components/Product';
import apis from '../apis';

export const getServerSideProps:GetServerSideProps = async(context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';

  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery(['getProducts'], () => apis.Product.getProducts());

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient)))
    }
  };
};

const Wrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`;
const H2 = styled.h2`
margin-bottom: 2rem;
`;
const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 338px);
  grid-auto-rows: minmax(auto, 574px);
  grid-gap: 80px;

`;
const Home: FC = () => {
  const loadRef = useRef<HTMLDivElement | null>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['getProducts'],
    ({ pageParam = 0 }) => apis.Product.getProducts(pageParam),{
      getNextPageParam: (lastPage, allPages) => {
        return lastPage[lastPage.length - 1]?.id;
      }
    }
  );

  useInterSectionObserver({
    root: null,
    target: loadRef,
    onInterSect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage
  });

  const list = useMemo(() => {
    return data?.pages?.flatMap(value => value);
  }, [data?.pages]);
  
  console.log('list',list);

  return (
    <>
      <ImageSlider />
      <Wrapper>
        <H2>Clothes</H2>
        <ListContainer ref={loadRef}>
          {list?.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </ListContainer>
      </Wrapper>
    </>
  );
};
// export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
//   // console.log('context.req.headers', context.req.headers);
//   const cookie = context.req ? context.req.headers.cookie : '';
//   axios.defaults.headers.Cookie = '';
//   if (context.req && cookie) {
//     axios.defaults.headers.Cookie = cookie;
//   }
  // await store.dispatch(loadUser());
//   await store.dispatch(loadProducts());
//   await store.dispatch(loadProductsInCart());
//   return {
//     props: {},
//   };
// });

export default Home;
