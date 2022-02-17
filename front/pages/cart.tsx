import { Breadcrumb, Typography } from 'antd';
import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import styled from 'styled-components';
import Router from 'next/router';
import { CloseOutlined } from '@ant-design/icons';
import { END } from 'redux-saga';
import axios from 'axios';
import dynamic from 'next/dynamic';
import ResultSuccess from '../components/ResultSuccess';
import wrapper from '../store/configureStore';
import AppLayout from '../components/AppLayout';
import {
  checkAllProduct, checkCartProduct, deleteCartProduct, loadCartProducts, unCheckAllProduct, uncheckCartProduct,
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

const Cart:FC = () => {
  const { userCart, cartTotalPrice, cartTotalDeliveryFee } = useSelector<RootState, CartState>((state) => state.cart);
  const { me, addPaymentDone } = useSelector<RootState, UserState>((state) => state.user);
  const dispatch = useDispatch();
  const [checkedProductsList, setcheckedProductsList] = useState(userCart);
  const [checkedAllProducts, setCheckedAllProducts] = useState(true);
  const [checkedProductState, setCheckedProductState] = useState(
    Array(userCart.length).fill(true),
  );

  useEffect(() => {
    dispatch(checkAllProduct());
  }, []);
  useEffect(() => {
    if (!me) {
      Router.push('/signin');
    }
  }, [me]);

  const onChangeAllCheckedProducts = useCallback(
    (e) => {
      setCheckedAllProducts((prev) => !prev);
      if (e.target.checked) {
        setCheckedProductState(checkedProductState.fill(true));
        setcheckedProductsList(userCart);
        dispatch(checkAllProduct());
      } else {
        setCheckedProductState(checkedProductState.fill(false));
        setcheckedProductsList([]);
        dispatch(unCheckAllProduct());
      }
    },
    [checkedProductsList, userCart],
  );
  const onChangeCheck = useCallback(
    (productId, index) => (e:React.ChangeEvent<HTMLInputElement>) => {
      const updateCheckState = checkedProductState.map((productState, i) => (i === index ? !productState : productState));
      setCheckedProductState(updateCheckState);
      setCheckedAllProducts(updateCheckState.every((v) => v === true));
      const checkProduct = userCart.find((product) => product.id === productId);
      if (e.target.checked && checkProduct) {
        setcheckedProductsList([...checkedProductsList, checkProduct]);
        dispatch(checkCartProduct({ id: productId }));
        console.log('checkedProductsList', checkedProductsList);
      } else {
        setcheckedProductsList(checkedProductsList.filter((v) => v.id !== productId));
        dispatch(uncheckCartProduct({ id: productId }));
        console.log('checkedProductsList', checkedProductsList);
      }
    },
    [checkedProductsList, userCart, checkedProductState],
  );

  const onDeleteCartItem = useCallback(
    (cartSingleProductId) => (e:React.MouseEvent) => {
      e.preventDefault();
      dispatch(deleteCartProduct({ id: cartSingleProductId }));
    },
    [],
  );
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
            장바구니
          </Breadcrumb.Item>
        </Breadcrumb>

        <Title level={2} style={{ marginTop: '3rem' }}>
          장바구니
        </Title>

        <div style={{ marginTop: '3rem' }}>
          <table style={{ width: '1100px' }}>
            <thead style={{ borderBottom: '1px solid' }}>
              <tr>
                <th>
                  <input type="checkbox" style={{ width: '20px', height: '20px' }} checked={checkedAllProducts} onChange={onChangeAllCheckedProducts} />
                </th>
                <th colSpan={2}>상품정보</th>
                <th>배송정보</th>
                <th>주문금액</th>
              </tr>
            </thead>

            <tbody style={{ height: '10rem', textAlign: 'center' }}>
              <tr>
                <td />
              </tr>
              {userCart[0] && userCart.map((cartSingleProduct, index) => (
                <tr key={cartSingleProduct.id}>
                  <td>
                    <input style={{ width: '20px', height: '20px' }} checked={checkedProductState[index]} type="checkbox" onChange={onChangeCheck(cartSingleProduct.id, index)} />
                  </td>
                  <td>
                    <img style={{ width: '150px', height: '150px' }} alt={cartSingleProduct.Product.Images[1].src} src={`http://localhost:3065/${cartSingleProduct.Product.Images[1].src}`} />
                  </td>
                  <td>
                    <div>
                      <span>{cartSingleProduct.Product.productName}</span>
                      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                        <li style={{ listStyle: 'none' }}>
                          {cartSingleProduct.size}
                          /
                          {cartSingleProduct.quantity}
                          개
                        </li>
                      </ul>
                    </div>
                  </td>
                  <td>
                    {cartSingleProduct.totalPrice > 39900 ? '무료배송' : '2500원' }
                  </td>
                  <td>
                    {cartSingleProduct.totalPrice}
                    원
                  </td>
                  <td>
                    <CloseOutlined onClick={onDeleteCartItem(cartSingleProduct.id)} style={{ fontSize: '20px', cursor: 'pointer' }} />
                  </td>
                </tr>
              ))}

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

        {userCart[0] && <DynamicPaypalComponent checkedProductsList={checkedProductsList} cartTotalPrice={cartTotalPrice} />}

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
export default Cart;
