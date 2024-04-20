import { useMutation } from '@tanstack/react-query';
import apis from '../../apis';

interface IUseAddAddressProps {
  rcName: string;
  rcPhone: string;
  rcPostNum : string;
  rcPostBase: string;
  rcPostDetail: string;
  base: boolean;
}

const useAddAddress = (payload: IUseAddAddressProps) => {
  const { mutate: addAdress } = useMutation({
    mutationFn: () => apis.User.addAddress(payload)
  });
  
  return {
    addAdress
  };
};

export default useAddAddress;