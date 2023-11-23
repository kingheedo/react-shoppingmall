import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import React, { useMemo } from 'react';
import apis from '../../apis';
import Order from '../../components/Order';

export const getServerSideProps: GetServerSideProps = async(context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  const { query } = context;

  axios.defaults.headers.Cookie = '';

  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  if (query.ids) {
    return {
      props: { ids: (JSON.parse(((query.ids as string)))) }
    };
  } else {
    return {
      props: {

      }
    };
  }
};

const OrderPage = (props: { ids: number[] }) => {
  const { data: list } = useQuery(['getCartList'], () =>
    apis.Cart.getCartList(),
  );
  const { ids }: { ids: number[] } = props;
  
  /** 주문 대상 리스트 */
  const orderList = useMemo(() => {
    return list?.filter(product => ids.includes(product.id)) || [];
  },[list,ids]);
  
  return (
    <Order
      list={orderList}
    />
  );
};

export default OrderPage;