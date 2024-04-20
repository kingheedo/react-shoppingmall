import { useQuery } from '@tanstack/react-query';
import apis from '../../apis';

const useGetCartList = () => {
  const { data: list } = useQuery(['getCartList'], () =>
    apis.Cart.getCartList(),
  );
  
  return {
    list
  };
};

export default useGetCartList;