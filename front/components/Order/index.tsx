import React from 'react';
import { GetCartListRes } from '../../apis/cart/schema';
import BreadCrumb from '../common/BreadCrumb';
import styled from 'styled-components';

const Title = styled.h1`
  margin-bottom: 40px;  
  font-size: var(--fontI);
  line-height: var(--fontIL);
  color: var(--gray900);
  text-align: center;
`;

const Main = styled.div`
  width: 960px;
  margin: 0 auto;
`;

interface IOrderProps{
  list : GetCartListRes[]
}

const Order = ({
  list 
}: IOrderProps) => {
  return (
    <div className="order">
      <BreadCrumb
        list={[{ content: '주문/결제' }]}
      />
      <Main className="contents">
        <Title>
        주문/결제
        </Title>
      </Main>
    </div>
  );
};

export default Order;