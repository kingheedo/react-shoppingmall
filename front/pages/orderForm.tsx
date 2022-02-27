import { Breadcrumb, Typography } from 'antd';
import React, {
  FC, useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import styled from 'styled-components';
import Router from 'next/router';
import { END } from 'redux-saga';
import axios from 'axios';
import dynamic from 'next/dynamic';
import ResultSuccess from '../components/ResultSuccess';
import wrapper from '../store/configureStore';
import AppLayout from '../components/AppLayout';
import {
  checkCartProduct, loadCartProducts,
} from '../reducers/dispatchRequestTypes/cartDispatchRequest';
import { loadUser } from '../reducers/dispatchRequestTypes/userDispatchRequest';
import { RootState } from '../reducers';
import { CartState } from '../reducers/asyncActionTypes/cartTypes';
import { UserState } from '../reducers/asyncActionTypes/userTypes';

const DynamicPaypalComponent = dynamic(() => import('../components/Paypal'), { ssr: false });

const { Title } = Typography;

const Wrapper = styled.div`
    width: 100vw;
    height : 100vh-60px;
    display : flex;
    align-items: left;
    flex-direction : column;
    margin: 200px;
`;

const OrderForm: FC = () => {
  const {
    userCart, cartTotalPrice, cartTotalDeliveryFee,
  } = useSelector<RootState, CartState>((state) => state.cart);
  const { me, addPaymentDone } = useSelector<RootState, UserState>((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkCartProduct({ id: userCart[0]?.id }));
  }, [userCart]);

  useEffect(() => {
    if (!me) {
      Router.push('/signin');
    }
  }, [me]);

  return (
    <AppLayout>
      <Wrapper>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link href="/">
              <a>
                Home
              </a>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            구매
          </Breadcrumb.Item>
        </Breadcrumb>

        <Title level={2} style={{ marginTop: '3rem' }}>
          구매
        </Title>

        <div style={{ marginTop: '3rem' }}>
          <table style={{ width: '1100px' }}>
            <thead style={{ borderBottom: '1px solid' }}>
              <tr>
                <th colSpan={2}>상품정보</th>
                <th>배송정보</th>
                <th>주문금액</th>
              </tr>
            </thead>

            <tbody style={{ height: '10rem', textAlign: 'center' }}>
              <tr key={userCart[0]?.id}>
                <td style={{ width: '20vw' }}>
                  <img style={{ width: '150px', height: '150px' }} alt={userCart[0]?.Product.Images[1].src} src={`http://localhost:3065/${userCart[0]?.Product.Images[1].src}`} />

                </td>
                <td>
                  <div>
                    <span>{userCart[0]?.Product.productName}</span>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      <li style={{ listStyle: 'none' }}>
                        {userCart[0]?.size}
                        /
                        {userCart[0]?.quantity}
                        개
                      </li>
                    </ul>
                  </div>
                </td>

                <td>
                  {userCart[0]?.totalPrice > 39900 ? '무료배송' : '2500원'}
                </td>
                <td>
                  {userCart[0]?.totalPrice}
                  원
                </td>
              </tr>

            </tbody>
          </table>
        </div>
        <div>
          <h5>스토어 주문금액 합계</h5>
          <span>
            상품금액
            {' '}
            <em style={{ fontStyle: 'normal' }}>
              {cartTotalPrice - cartTotalDeliveryFee}
              원
            </em>
            {' '}
            + 배송비
            {' '}
            <em style={{ fontStyle: 'normal' }}>
              {cartTotalDeliveryFee}
              원 =
              {' '}
            </em>
          </span>
          <span>
            {cartTotalPrice}
            원
          </span>
        </div>
        {/* <Payment checkedProductsList={checkedProductsList}/> */}

        {userCart[0] && <DynamicPaypalComponent headers="buynow" checkedProduct={userCart[0]} checkedProductsList='' cartTotalPrice={cartTotalPrice} />}

        {addPaymentDone && <ResultSuccess />}
      </Wrapper>
    </AppLayout>
  );
};
export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  store.dispatch(loadUser());
  store.dispatch(loadCartProducts());

  store.dispatch(END);
  await store.sagaTask?.toPromise();
  return {
    props: {},
  };
});
export default OrderForm;
