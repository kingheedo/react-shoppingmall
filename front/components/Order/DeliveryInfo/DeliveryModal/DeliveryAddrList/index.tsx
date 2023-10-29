import React from 'react';
import styled from 'styled-components';

const Title = styled.h1`
  line-height: 50px;
  font-size: 21px;
  font-weight: 700;
  border-bottom: 1px solid #111;
`;

const AddBtnWrap = styled.div`
  margin-top: 50px;

  > button{
      width: 100%;
      height: 50px;
      line-height: 48px;
      font-size: 15px;
      padding: 0 20px;
      color: #fff;
      background: #111;
      border: 1px solid #111;
  }
`;

interface IDeliveryAddrListProps {
  handleNextStep: () => void;
}

const DeliveryAddrList = ({
  handleNextStep
}: IDeliveryAddrListProps) => {
  return (
    <div className="delivery">
      <Title>
            배송지 목록
      </Title>
      <AddBtnWrap>
        <button onClick={handleNextStep}>
            + 신규 배송지 추가
        </button>
      </AddBtnWrap>
    </div>
  );
};

export default DeliveryAddrList;