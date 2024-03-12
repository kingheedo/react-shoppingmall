'use client';

import React, { FC, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay, Navigation } from 'swiper/modules';
import useIntersectionObserver from '../../../hooks/useInterSectionObserver';
import apis from '../../../apis';
import Product from '../../../components/Product';

const BgSlide = styled.div`
    min-width: 1280px;
`;

const ListContainer = styled.ul`
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

const ProductsArea = styled.section`
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

// export const getServerSideProps:GetServerSideProps = async(context) => {
//   const cookie = context.req ? context.req.headers.cookie : '';
//   axios.defaults.headers.Cookie = '';
//   if (context.req && cookie) {
//     axios.defaults.headers.Cookie = cookie;
//   }
//   const queryClient = new QueryClient();

//   await queryClient.prefetchInfiniteQuery(['getProducts'], () => apis.Product.getProducts());

//   return {
//     props: {
//       dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient)))
//     }
//   };
// };

const Main: FC = () => {
  const loadRef = useRef<HTMLUListElement | null>(null);
  
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['getProducts'],
    ({ pageParam = 0 }) => {
      // console.log('pageParam',pageParam);
      
      return apis.Product.getProducts(pageParam);
    },{
      getNextPageParam: (lastPage, allPages) => {
        // console.log('lastPage',lastPage);
        
        return lastPage[lastPage.length - 1]?.id;
      }
    }
  );

  useIntersectionObserver({
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
      <BgSlide>
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
      </BgSlide>
      <ProductsArea>
        <ListContainer ref={loadRef}>
          {list?.map((product,idx) => (
            <Product
              key={product.id} 
              idx={idx + 1}
              product={product} />
          ))}
        </ListContainer>
      </ProductsArea>
    </>
  );
};

export default Main;
