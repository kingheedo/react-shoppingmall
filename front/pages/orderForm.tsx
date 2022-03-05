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

const Container = styled.div`
    width: 80vw;
    height: 100%;
    margin: 6rem auto 0;
`;

const Wrapper = styled.div`
    display : flex;
    align-items: left;
    flex-direction : column;
`;
const BreadCrumb = styled(Breadcrumb)`
     width: 36vw;
`;
const PageTitle = styled(Title)`
     margin-top: 3rem;
     width: 36vw;
`;
const TableDiv = styled.div`
     margin-top: 3rem;
`;
const Table = styled.table`
     width: 60vw;
`;
const Thead = styled.thead`
     border-bottom: 1px solid;
`;
const Tbody = styled.tbody`
    height: 10rem;
    text-align: center;
`;
const Image = styled.img`
    width: 150px
    height: 150px
`;
const ProductInfo = styled.div`
    @media only screen and (max-width: 690px) {
        width: 16vw;
        }
    
`;
const ProductInfoUl = styled.ul`
     list-style: none; 
     margin: 0; 
     padding: 0;
    
`;
const ProductInfoLi = styled.li`
     list-style: none;
    
`;
const Em = styled.em`
     font-style: normal
`;
const TotalDiv = styled.div`
    margin-top: 2rem;
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
      <Container>
        <Wrapper>
          <BreadCrumb>
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
          </BreadCrumb>

          <PageTitle level={2}>
            구매
          </PageTitle>

          <TableDiv>
            <Table>
              <Thead>
                <tr>
                  <th colSpan={2}>상품정보</th>
                  <th>배송정보</th>
                  <th>주문금액</th>
                </tr>
              </Thead>

              <Tbody>
                <tr key={userCart[0]?.id}>
                  <td>
                    <Image alt={userCart[0]?.Product.Images[1].src} src={`http://localhost:3065/${userCart[0]?.Product.Images[1].src}`} />

                  </td>
                  <td>
                    <ProductInfo>
                      <span>{userCart[0]?.Product.productName}</span>
                      <ProductInfoUl>
                        <ProductInfoLi>
                          {userCart[0]?.size}
                          /
                          {userCart[0]?.quantity}
                          개
                        </ProductInfoLi>
                      </ProductInfoUl>
                    </ProductInfo>
                  </td>

                  <td>
                    {userCart[0]?.totalPrice > 39900 ? '무료배송' : '2500원'}
                  </td>
                  <td>
                    {userCart[0]?.totalPrice}
                    원
                  </td>
                </tr>

              </Tbody>
            </Table>
          </TableDiv>
          <TotalDiv>
            <h5>스토어 주문금액 합계</h5>
            <span>
              상품금액
              {' '}
              <Em style={{ fontStyle: 'normal' }}>
                {cartTotalPrice - cartTotalDeliveryFee}
                원
              </Em>
              {' '}
              + 배송비
              {' '}
              <Em style={{ fontStyle: 'normal' }}>
                {cartTotalDeliveryFee}
                원 =
                {' '}
              </Em>
            </span>
            <span>
              {cartTotalPrice}
              원
            </span>
          </TotalDiv>
          {/* <Payment checkedProductsList={checkedProductsList}/> */}

          {userCart[0] && <DynamicPaypalComponent headers="buynow" checkedProduct={userCart[0]} cartTotalPrice={cartTotalPrice} checkedProductsList={[]} />}

          {addPaymentDone && <ResultSuccess />}
        </Wrapper>
      </Container>
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
