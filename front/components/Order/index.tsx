import React, { useMemo, useState } from 'react';
import { GetCartListRes } from '../../apis/cart/schema';
import BreadCrumb from '../common/BreadCrumb';
import styled from 'styled-components';
import DeliveryInfo from './DeliveryInfo';
import Payments from './Payments';
import Products from './Products';

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
  padding: 80px var(--gap) 120px;
`;

const BrandName = styled.span`
    display: block;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #8e8e8e;
`;

interface IOrderProps{
  list : GetCartListRes[]
}

const Order = ({
  list 
}: IOrderProps) => {
  const [modalStep, setModalStep] = useState(-1);
  const totalPrice = useMemo(() => {
    let price = 0;
    for (let i = 0; i < list.length; i++) {
      price += list[i].totalPrice;
    }

    return price;
    
  },[list]);

  /** 배송 모달 스텝 핸들러 */
  const handleModalStep = (step: number) => {
    setModalStep(step);
  };
  
  return (
    <div className="order">
      <BreadCrumb
        list={[{ content: '주문/결제' }]}
      />
      <Main className="contents">
        <Title>
          주문/결제
        </Title>
        <Products list={list}/>
        <DeliveryInfo
          modalStep={modalStep}
          handleModalStep={handleModalStep}
        />
        <Payments totalPrice={totalPrice}/>
      </Main>
      
    </div>
  );
};

export default Order;