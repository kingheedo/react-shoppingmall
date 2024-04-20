import { useQuery } from '@tanstack/react-query';
import apis from '../../apis';
import { TossPayment } from '../../app/order/success/_component/Result';

const useGetPayments = (tossPayment: TossPayment) => {
  const { data: payments } = useQuery(['getPayments'], () => apis.Payment.getPayments(tossPayment.orderId));

  return {
    payments
  };
};

export default useGetPayments;