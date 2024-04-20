import { useQuery } from '@tanstack/react-query';
import apis from '../../apis';

const useGetSingleProduct = (id: string) => {
  const { data: product } = useQuery(
    ['getSingleProduct'],
    () => apis.Product.getSingleProduct(id as string),
    {
      enabled: !!id,
    },
  );

  return {
    product
  };
};

export default useGetSingleProduct;