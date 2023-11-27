import React, { FC } from 'react';
import styled from 'styled-components';
import {
  Breadcrumb, Typography,
} from 'antd';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import moment from 'moment';
import axios from 'axios';
import { QueryClient, dehydrate, useQuery, useQueryClient } from '@tanstack/react-query';
import apis from '../apis';

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

export const getServerSideProps: GetServerSideProps = async(context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['getAllPayments'], () => apis.Payment.getAllPayments());
  
  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};

const Mypage: FC = () => {
  const { data: payments } = useQuery(['getAllPayments'], () => apis.Payment.getAllPayments());
  
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
          {/* {paymentLists?.map((payment) => <Payment key={payment.id} payment={payment} />)} */}
          {payments?.map((payment,idx) => (
            <div key={idx}>
              {payment.orderId}
            </div>
          ) )}
        </PaymentListDiv>
      </Wrapper>
    </Container>
  );
};
export default Mypage;
