import { useMutation, useQueryClient } from '@tanstack/react-query';
import apis from '../../apis';
import { PostPaymentReq } from '../../apis/payment/schema';

const useAddPayment = () => {
  const queryClient = useQueryClient();
  const { mutate: addPayment } = useMutation((data: PostPaymentReq) => apis.Payment.addPayment(data), {
    onSettled: () => {
      queryClient.invalidateQueries(['getUser']);
    }
  });
  
  return {
    addPayment
  };
};

export default useAddPayment;