import { useQuery } from '@tanstack/react-query';
import apis from '../../apis';

interface IUseGetUserProps<D>{
  onErrorCb: () => void;
  onSuccessCb: () => void;
  dep: D
}

const useGetUser = <D>({
  onErrorCb,
  onSuccessCb,
  dep
}: Partial<IUseGetUserProps<D>> = {}) => {
  const { data: user } = useQuery({
    queryKey: ['getUser',dep], 
    queryFn: () => apis.User.getUser(),
    onError: () => onErrorCb && onErrorCb(),
    onSuccess: () => onSuccessCb && onSuccessCb()
  });
  
  return {
    user
  };
};

export default useGetUser;