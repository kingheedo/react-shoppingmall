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
  const { mutate: addAddress } = useMutation({
    mutationFn: () => apis.User.addAddress(payload)
  });
  
  return {
    addAddress
  };
};

export default useAddAddress;