import { useQuery } from '@tanstack/react-query';
import apis from '../../apis';
import { useEffect, useState } from 'react';
import { GetAllPaymentsRes } from '../../apis/payment/schema';

type PayemntState = {
  dbPayments: GetAllPaymentsRes;
}

interface IUseGetAllPaymentsProps {
    startDate : Date;
    endDate : Date;
    page : number;
}

const useGetAllPayments = ({
  startDate,
  endDate,
  page
}: IUseGetAllPaymentsProps) => {
  const [paymentsState, setPaymentsState] = useState<Map<string, PayemntState>>(() => new Map());

  /** 주문 내역 invalidate */
  const { data: payments, refetch: refetchGetAllPayments } = useQuery({
    queryKey: ['getAllPayments', startDate || endDate || page],
    queryFn: () => apis.Payment.getAllPayments({
      startDate: new Date(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate(),
        startDate.getUTCHours(),
        startDate.getUTCMinutes(),
        startDate.getUTCSeconds(),
      ),
      endDate: new Date(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth(),
        endDate.getUTCDate(),
        endDate.getUTCHours(),
        endDate.getUTCMinutes(),
        endDate.getUTCSeconds(),
      ),
      page
    }),
    enabled: !!startDate && !!endDate
  });

  useEffect(() => {
    (async () => {
      setPaymentsState(() => new Map());
      const orderIds = [...new Set(payments?.map(payment => payment.orderId))];
      // const fethArr = orderIds.map(orderId => (
      //   apis.Payment.getTossPmntOrder(orderId)
      // ));

      // const tossPmntOrderList = await Promise.all(fethArr);

      for (let i = 0; i < orderIds.length; i++) {
        const dbPayments = payments?.filter(payment => payment.orderId === orderIds[i]);
        if (!dbPayments) {
          return;
        }

        setPaymentsState(prev => new Map(prev).set(
          orderIds[i],
          {
            dbPayments,
            // tossPayment: tossPmntOrderList[i]
          }));
      }
    })();

  }, [payments]);
  
  return {
    paymentsState,
    refetchGetAllPayments,
  };
};

export default useGetAllPayments;