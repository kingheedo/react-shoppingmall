import React from 'react';
import styled from 'styled-components';
import DeliveryAddrList from './DeliveryAddrList';
import DeliveryAddrForm from './DeliveryAddrForm';

interface IModalProps {
  width: number;
}

const Bg = styled.div`
  position: fixed;
  display: grid;
  place-items: center;
  inset:0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0, 0.5);
`;

const Modal = styled.div<IModalProps>`
  position: absolute;
  z-index: 1;
  width: ${(props) => props.width}px;
  min-height: 150px;
  max-height: 680px;
  background: #fff;
  padding: 35px 30px;
`;

const Title = styled.h1`
  line-height: 50px;
  font-size: 21px;
  font-weight: 700;
  border-bottom: 1px solid #111;
`;

const CloseBtn = styled.button`
    position: absolute;
    top: 20px;
    right: 20px;
    width: 30px;
    height: 30px;
    border: 0;
    border-radius: 0;
    background: url(/btn_x.svg) no-repeat center center/15px auto;
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

interface IDeliveryProps {
  step: number;
  handleModalStep: (step: number) => void;
}

const DeliveryModal = ({
  step,
  handleModalStep
}: IDeliveryProps) => {
  return (
    <Bg onClick={() => handleModalStep(-1)}>
      <Modal 
        width={step === 0 ? 500 : step === 1 ? 460 : 500}
        onClick={(e) => e.stopPropagation()}>
        <CloseBtn onClick={() => handleModalStep(-1)}/>
        {step === 0 && (
          <DeliveryAddrList
            handleNextStep={() => handleModalStep(1)}
          />
        )}
        {step === 1 && (
          <DeliveryAddrForm/>
        )}
      </Modal>
    </Bg>
  );
};

export default DeliveryModal;