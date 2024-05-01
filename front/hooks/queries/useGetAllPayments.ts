import { useQuery, useQueryClient } from '@tanstack/react-query';
import apis from '../../apis';
import { useEffect, useState } from 'react';
import { GetAllPaymentsRes, GetTossPmntOrderRes } from '../../apis/payment/schema';

type PayemntState = {
  dbPayments: GetAllPaymentsRes;
  // tossPayment: GetTossPmntOrderRes;
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
  const queryClient = useQueryClient();
  const [paymentsState, setPaymentsState] = useState<Map<string, PayemntState>>(() => new Map());
  const [isInquired, setIsInquired] = useState(true); //조회하기 버튼 클릭 여부
  const [isCanceled, setIsCanceled] = useState(false); //결제 취소 여부
  
  /** 조회 여부 */
  const handleInquired = (payload: boolean) => {
    setIsInquired(payload);
  };

  /** 결제 취소 여부 */
  const handleCancel = (payload: boolean) => {
    setIsCanceled(payload);
  };
  
  const { data: payments, isPlaceholderData } = useQuery({
    queryKey: ['getAllPayments', startDate || endDate || isInquired || isCanceled || page],
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
    enabled: !!startDate && !!endDate && isInquired
  });

  useEffect(() => {
    if (!isPlaceholderData) {
      // console.log('hasmore', payments!.hasMore);

      queryClient.prefetchQuery({
        queryKey: ['getAllPayments', startDate, endDate, page + 1],
        queryFn: () => () => apis.Payment.getAllPayments({
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
          page: page + 1
        })
      });
    }
  }, [payments, isPlaceholderData, page, queryClient, startDate, endDate]);

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
      setIsInquired(false);
      setIsCanceled(false);
    })();

  }, [payments, isCanceled]);
  
  return {
    paymentsState,
    handleInquired,
    handleCancel
  };
};

export default useGetAllPayments;