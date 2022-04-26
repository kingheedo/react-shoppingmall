import React, { FC, useCallback } from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';
import { useDispatch } from 'react-redux';
import { addPaymentLists } from '../reducers/requestTypes/userRequest';
import { UserCart } from '../reducers/reducerTypes/cartTypes';
import { modalCountDown } from './ResultSuccessModal';

type Props = {
  headers: string;
  checkedProduct: UserCart | undefined;
  cartTotalPrice: number;
  checkedProductsList: UserCart[] | undefined;
}
const Paypal: FC<Props> = ({
  headers, checkedProduct, checkedProductsList, cartTotalPrice,
}) => {
  const CartItemsId = checkedProductsList && checkedProductsList.map((v) => v.id);
  const CartItemId = checkedProduct?.id;
  const dispatch = useDispatch();

  const onSuccess = useCallback(
    (payment) => {
      console.log('The payment was succeeded!', payment);
      if (headers === 'buynow') {
        dispatch(
          addPaymentLists({ CartItemId, payment }),
        );
      }
      if (headers === 'buylater') {
        dispatch(
          addPaymentLists({ CartItemsId, payment }),
        );
      }
      modalCountDown();
    },
    [CartItemsId, CartItemId],
  );
  const onCancel = useCallback(
    (data) => {
      console.log('The payment was cancelled!', data);
    },
    [],
  );
  const onError = useCallback(
    (err) => {
      console.log('Error!', err);
    },
    [],
  );
  const env = 'sandbox'; // you can set here to 'production' for production
  const currency = 'USD'; // or you can set this value from your props or state
  const total = cartTotalPrice; // same as above, this is the total amount (based on currency) to be paid by using Paypal express checkout
  // Document on Paypal's currency code: https://developer.paypal.com/docs/classic/api/currency_codes/

  const client = {
    sandbox: 'AcDMPL7Fk9BMaKE1--tingqfoZH7kXsf4Odqe5g6RxZVYHr8eF-btLRJHRrPOXHKrnyu1bjxkdFfGZnx',
    production: 'YOUR-PRODUCTION-APP-ID',
  };
  // In order to get production's app-ID, you will have to send your app to Paypal for approval first
  // For sandbox app-ID (after logging into your developer account, please locate the "REST API apps" section, click "Create App"):
  //   => https://developer.paypal.com/docs/classic/lifecycle/sb_credentials/
  // For production app-ID:
  //   => https://developer.paypal.com/docs/classic/lifecycle/goingLive/

  // NB. You can also have many Paypal express checkout buttons on page, just pass in the correct amount and they will work!
  return (
    <PaypalExpressBtn
      env={env}
      client={client}
      currency={currency}
      total={total}
      onError={onError}
      onSuccess={onSuccess}
      onCancel={onCancel}
      style={{
        size: 'large',
        color: 'blue',
        shape: 'rect',
        label: 'checkout',
      }}
    />
  );
};
export default Paypal;
