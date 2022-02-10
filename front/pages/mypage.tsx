import Router from 'next/router';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  Breadcrumb, Card, Typography,
} from 'antd';
import Link from 'next/link';
import moment from 'moment';
import { END } from 'redux-saga';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';
import { loadPaymentLists, loadUser } from '../reducers/dispatchRequestTypes/userDispatchRequest';
import { RootState } from '../reducers';
import { UserState } from '../reducers/asyncActionTypes/userTypes';
import { loadCartProducts } from '../reducers/dispatchRequestTypes/cartDispatchRequest';

moment.locale('ko');
const { Title } = Typography;

const { Meta } = Card;

const Wrapper = styled.div`
    width: 80vw;
    height : 100vh-60px;
    display : flex;
    align-items: left;
    flex-direction : column;
    margin: 200px;

`;
const CardItem = styled(Card)`
    .ant-card-body {
        width: 500px;
    }

`;

const Mypage:FC = () => {
  const { me, paymentLists } = useSelector<RootState, UserState>((state) => state.user);
  const dispatch = useDispatch();
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
            마이페이지
          </Breadcrumb.Item>
        </Breadcrumb>
        <Title level={2} style={{ marginTop: '3rem' }}>
          주문내역
        </Title>
        <div style={{ marginTop: '3rem', width: '36vw' }}>
          {
                            paymentLists?.map((v) => (
                              <Link href={`/product/${v.RecordCart.Product.id}`} style={{ overflow: 'hidden' }}>
                                <a>
                                  <h3>{v.paymentID}</h3>
                                  <CardItem
                                    style={{ width: '680px', display: 'flex', marginBottom: '2rem' }}
                                    cover={<img alt={v.RecordCart.Product.Images[1].src} src={`http://localhost:3065/${v.RecordCart.Product.Images[1].src}`} />}
                                  >
                                    <Meta style={{ float: 'left' }} title={v.RecordCart.Product.productName} />
                                    <p style={{ float: 'right' }}>{moment(v.createdAt).format('LLL')}</p>
                                    <br />
                                    <br />
                                    <span>{`${v.RecordCart.size} / ${v.RecordCart.quantity}`}</span>
                                    <br />
                                    <strong>{v.RecordCart.totalPrice > 39900 ? v.RecordCart.totalPrice : (v.RecordCart.totalPrice + 2500)}</strong>

                                  </CardItem>
                                </a>
                              </Link>
                            ))
                        }
        </div>
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
  store.dispatch(loadPaymentLists());
  store.dispatch(loadCartProducts());
  store.dispatch(END);
  await store.sagaTask?.toPromise();
  return {
    props: {},
  };
});
export default Mypage;
