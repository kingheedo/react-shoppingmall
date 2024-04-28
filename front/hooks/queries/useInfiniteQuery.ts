import { useInfiniteQuery } from '@tanstack/react-query';
import apis from '../../apis';
import React, { useRef } from 'react';

/** 메인 페이지 상품 정보 */
const useGetProducts = () => {
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

  React.useEffect(() => {
    if (!hasNextPage && !isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(entry => entry.isIntersecting && fetchNextPage()),
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      }
    );

    const el = loadRef && loadRef.current;

    if (!el) {
      return;
    }

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [loadRef, hasNextPage && !isFetchingNextPage]);
  
  return {
    loadRef,
    data, 
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  };
};

export default useGetProducts;