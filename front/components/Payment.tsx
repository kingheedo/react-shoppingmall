import { Card } from 'antd';
import React, { FC } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import moment from 'moment';
import Review from './Review';
import { PaymentLists } from '../reducers/asyncActionTypes/userTypes';

type Props = {
    payment : PaymentLists;
}
const { Meta } = Card;
const CardItem = styled(Card)`
    .ant-card-body {
        width: 500px;
    }

`;
const Payment: FC<Props> = ({ payment }) => {
  return (
    <>
      <Link href={`/product/${payment.HistoryCart?.Product?.id}`} style={{ overflow: 'hidden' }}>
        <a>
          <h3>{payment.paymentID}</h3>
          <CardItem
            style={{ width: '680px', display: 'flex', marginBottom: '1rem' }}
            cover={<img alt={payment.HistoryCart?.Product?.Images[1].src} src={`http://localhost:3065/${payment.HistoryCart?.Product?.Images[1].src}`} />}
          >
            <Meta style={{ float: 'left' }} title={payment.HistoryCart?.Product?.productName} />
            <p style={{ float: 'right' }}>{moment(payment.createdAt).format('LLL')}</p>
            <br />
            <br />
            <span>{`${payment.HistoryCart?.size} / ${payment.HistoryCart?.quantity}`}</span>
            <br />
            <strong>{payment.HistoryCart?.totalPrice > 39900 ? payment.HistoryCart?.totalPrice : (payment.HistoryCart?.totalPrice + 2500)}</strong>

          </CardItem>
        </a>
      </Link>
      {/* <Review reviewUnique={payment.HistoryCart.User.Reviews[index]?.reviewUnique} historyCartId={payment.HistoryCart.id} productId={payment.HistoryCart.Product.id} paymentToken={payment.paymentToken} /> */}
      <Review reviewUniqueIds={payment.HistoryCart?.User?.Reviews?.map((v) => v.reviewUnique)} historyCartId={payment.HistoryCart?.id} productId={payment.HistoryCart?.Product.id} paymentToken={payment.paymentToken} />
      <br />
      <br />
    </>
  );
};

export default Payment;
