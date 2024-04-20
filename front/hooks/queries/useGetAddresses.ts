import { useQuery } from '@tanstack/react-query';
import apis from '../../apis';

const useGetAddresses = () => {
  const { data: addressList } = useQuery(['getAddresses'], () => apis.User.getAddresses());
  
  return {
    addressList
  };
};

export default useGetAddresses;