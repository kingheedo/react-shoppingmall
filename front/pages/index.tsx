import React, { FC, useMemo, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import { QueryClient, dehydrate, useInfiniteQuery } from '@tanstack/react-query';
import useInterSectionObserver from '../hooks/useInterSectionObserver';
import Product from '../components/Product';
import apis from '../apis';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay, Navigation } from 'swiper/modules';

const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  > li{
    width: 25%;
    padding: 0 8px;
    margin-bottom: 40px;
    :last-child(-n + 4){
      margin-bottom: 0;
    }
  }
`;

const ProductsSection = styled.section`
  max-width: 1440px;
  min-width: 1280px;
  width: auto;
  min-height: calc(100vh - 706px);
  margin: 120px auto 0;
  padding: 0 var(--gap) 120px;
`;

const BgImg = styled.img`
  width: 100%;
`;

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

const Home: FC = () => {
  const loadRef = useRef<HTMLDivElement | null>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['getProducts'],
    ({ pageParam = 0 }) => {
      console.log('pageParam',pageParam);
      
      return apis.Product.getProducts(pageParam);
    },{
      getNextPageParam: (lastPage, allPages) => {
        console.log('lastPage',lastPage);
        
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
  
  const BgLists = ['slide1.webp'];

  return (
    <>
      <section className="bg-slide">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Navigation]}
          className="mySwiper"
        >
          {BgLists.map(
            (bg) => (
              <SwiperSlide key={bg}>
                <BgImg src={bg} alt={bg}/>
              </SwiperSlide>
            )
          )}
        </Swiper>
      </section>
      <ProductsSection>
        <ListContainer ref={loadRef}>
          {list?.map((product) => (
            <Product 
              key={product.id} 
              product={product} />
          ))}
        </ListContainer>
      </ProductsSection>
    </>
  );
};

export default Home;
