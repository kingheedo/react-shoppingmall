import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import DeliveryInfo from './DeliveryInfo';
import Payments from './Payments';
import Products from './Products';
import { Address } from '../../../apis/user/schema';
import { GetCartListRes } from '../../../apis/cart/schema';
import BreadCrumb from '../../../components/common/BreadCrumb';

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

export type DeliveryType = {
    rcName: string,
    rcPhone: string,
    address: Omit<Address, 'id' | 'rcName' | 'rcPhone'> & { base: boolean },
    message: string,
}

export type PaymentInfo = {
    orderName: string;
    totalPrice: number;
    delivery: DeliveryType;
    cartIds: number[];
}

interface IOrderProps{
  list : GetCartListRes[]
}

const Order = ({
  list 
}: IOrderProps) => {
  const [modalStep, setModalStep] = useState(-1);
  const [delivery, setDelivery] = useState<DeliveryType>({
    rcName: '',
    rcPhone: '',
    address: {
      rcPostNum: '',
      rcPostBase: '',
      rcPostDetail: '',
      base: false,
    },
    message: '',
  });

  const handleAddress = (payload: DeliveryType) => {
    setDelivery(payload);
  };
  /** 주문 이름 및 총 가격 */
  const paymentInfo: PaymentInfo = useMemo(() => {
    let orderName = '';
    let totalPrice = 0;
    let cartIds = [];

    cartIds = list.map(cartItem => cartItem.id);
    if (list.length > 1) {
      orderName = `${list[0].Product.productName}외 ${list.length - 1}건`;
    } else {
      orderName = list[0].Product.productName;
    }
    
    for (let i = 0; i < list.length; i++) {
      totalPrice += list[i].totalPrice;
    }
    
    return ({
      cartIds,
      orderName,
      totalPrice,
      delivery
    });

  },[list,delivery]);

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
          handleAddress={handleAddress}
        />
        <Payments info={paymentInfo}/>
      </Main>
      
    </div>
  );
};

export default Order;