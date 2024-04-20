import { useQuery } from '@tanstack/react-query';
import apis from '../../apis';

const useGetSearchedProducts = (keyword: string) => {
  const { data: searchedProducts } = useQuery({
    queryKey: ['getSearchedProducts', keyword],
    queryFn: () => apis.Product.getKeywordProducts(keyword),
    enabled: !!keyword
  });

  return {
    searchedProducts
  };
};

export default useGetSearchedProducts;