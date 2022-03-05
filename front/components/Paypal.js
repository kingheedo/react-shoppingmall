import React, { useCallback } from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { addPaymentLists } from '../reducers/dispatchRequestTypes/userDispatchRequest';

const Paypal = ({
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
      } else {
        dispatch(
          addPaymentLists({ CartItemsId, payment }),
        );
      }
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
Paypal.defaultProps = {
  checkedProduct: null,
  checkedProductsList: [],
};
Paypal.propTypes = {
  headers: PropTypes.string.isRequired,
  checkedProduct: PropTypes.object,
  checkedProductsList: PropTypes.arrayOf(PropTypes.object),
  cartTotalPrice: PropTypes.number.isRequired,
};
export default Paypal;
