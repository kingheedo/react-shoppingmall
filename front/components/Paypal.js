import React, { useCallback, useEffect } from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';
import Proptypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux';
import { ADD_PAYMENT_REQUEST } from '../reducers/user';
const Paypal = ({checkedProductsList,cartTotalPrice}) => {
        const dispatch = useDispatch();
        const {userCart} = useSelector(state => state.cart)
        const CartItemsId  = checkedProductsList && checkedProductsList.map(v=> v.id)
        useEffect(() => {
            console.log('checkedProductsList',checkedProductsList)
            console.log('CartItemsId',CartItemsId)
        }, [checkedProductsList,CartItemsId])
        const onSuccess = useCallback(
            (payment) => {
            console.log("The payment was succeeded!", payment);
            dispatch({
                type : ADD_PAYMENT_REQUEST,
                data : {CartItemsId, payment}
            })
            },
            [CartItemsId],
        )
        const onCancel = useCallback(
            (data) => {
                console.log('The payment was cancelled!', data);
            },
            [],
        )
        const onError = useCallback(
            (err) => {
                console.log("Error!", err);
            },
            [],
        )
        let env = 'sandbox'; // you can set here to 'production' for production
        let currency = 'USD'; // or you can set this value from your props or state
        let total = cartTotalPrice; // same as above, this is the total amount (based on currency) to be paid by using Paypal express checkout
        // Document on Paypal's currency code: https://developer.paypal.com/docs/classic/api/currency_codes/
 
        const client = {
            sandbox:    'AcDMPL7Fk9BMaKE1--tingqfoZH7kXsf4Odqe5g6RxZVYHr8eF-btLRJHRrPOXHKrnyu1bjxkdFfGZnx',
            production: 'YOUR-PRODUCTION-APP-ID',
        }
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
            style ={{
                size: 'large',
                color: 'blue',
                shape: 'rect',
                label: 'checkout'
            }}
            />
        );
    }

Paypal.propTypes = {
    checkedProductsList : Proptypes.arrayOf(Proptypes.object).isRequired,
    cartTotalPrice : Proptypes.number.isRequired,
}
export default Paypal


