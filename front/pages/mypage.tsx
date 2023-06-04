import Router from 'next/router';
import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  Breadcrumb, Typography,
} from 'antd';
import Link from 'next/link';
import moment from 'moment';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import { UserState } from '../reducers/reducerTypes/userTypes';
import Payment from '../components/Payment';
import { loadPaymentLists, loadUser } from '../reducers/asyncRequest/user';
import { loadProductsInCart } from '../reducers/asyncRequest/cart';
import wrapper, { RootState } from '../store/configureStore';

moment.locale('ko');
const { Title } = Typography;

const Container = styled.div`
    width: 80vw;
    height: 100%;
    margin: 6rem auto 0;

`;
const Wrapper = styled.div`
    display : flex;
    flex-direction : column;
`;
const PaymentListDiv = styled.div`
     margin-top: 3rem;
     width: 40vw;
`;
const BreadCrumb = styled(Breadcrumb)`
     width: 36vw;
`;
const PageTitle = styled(Title)`
     margin-top: 3rem; 
     width: 36vw;
`;

const Mypage: FC = () => {
  const { me, paymentLists, addProductReviewError } = useSelector<RootState, UserState>((state) => state.user);

  useEffect(() => {
    if (addProductReviewError) {
      alert(addProductReviewError);
    }
  }, [addProductReviewError]);
  useEffect(() => {
    if (!me) {
      Router.push('/signin');
    }
  }, [me]);

  return (
      <Container>
        <Wrapper>
          <BreadCrumb>
            <Breadcrumb.Item>
              <Link href="/">
                  Home
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              마이페이지
            </Breadcrumb.Item>
          </BreadCrumb>
          <PageTitle level={2}>
            주문내역
          </PageTitle>
          <PaymentListDiv>
            {paymentLists?.map((payment) => <Payment key={payment.id} payment={payment} />)}
          </PaymentListDiv>
        </Wrapper>
      </Container>
  );
};
export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  await store.dispatch(loadUser());
  await store.dispatch(loadPaymentLists());
  await store.dispatch(loadProductsInCart());
  return {
    props: {},
  };
});
export default Mypage;
