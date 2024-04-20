import { useInfiniteQuery } from '@tanstack/react-query';
import apis from '../../apis';

/** 메인 페이지 상품 정보 */
const useGetProducts = () => {
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

  return {
    data, 
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  };
};

export default useGetProducts;