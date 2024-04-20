import { useQuery } from '@tanstack/react-query';
import apis from '../../apis';

const useGetUser = () => {
  const { data: user } = useQuery(
    ['getUser'], 
    () => apis.User.getUser());

  return {
    user
  };
};

export default useGetUser;