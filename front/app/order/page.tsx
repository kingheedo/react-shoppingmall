'use client';

import React, { useMemo } from 'react';
import Order from '../../components/Order';
import { useSearchParams } from 'next/navigation';
import useGetCartList from '../../hooks/queries/useGetCartList';

const OrderPage = () => {
  const params = useSearchParams();
  const { list } = useGetCartList();
  const ids = params.get('ids');

  /** 주문 대상 리스트 */
  const orderList = useMemo(() => {
    if (ids) {
      return list?.filter(product => ids.includes(String(product.id))) || [];
    } else {
      return [];
    }
  }, [list, ids]);

  return (
    orderList.length > 0 &&
    <Order
      list={orderList}
    />
  );
};

export default OrderPage;