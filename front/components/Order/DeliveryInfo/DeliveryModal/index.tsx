/* eslint-disable react/display-name */
import React, { memo, useMemo } from 'react';
import styled from 'styled-components';
import DeliveryAddrList from './DeliveryAddrList';
import DeliveryAddrForm from './DeliveryAddrForm';
import { Address, InfoType } from '..';

interface IModalProps {
  width: number;
  height: number;
}

const Bg = styled.div`
  position: fixed;
  z-index: 10;
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
  height: ${(props) => props.height};
  min-height: 150px;
  max-height: 680px;
  background: #fff;
  padding: 35px 30px;
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

interface IModalContentProps{
  step: number;
  handleModalStep: (step: number) => void;
  handleUpdateInfo: (payload:Pick<InfoType, 'rcName' | 'rcPhone'> & Address) => void;
}

interface IDeliveryModalProps {
  step: number;
  handleModalStep: (step: number) => void;
  handleUpdateInfo: (payload:Pick<InfoType, 'rcName' | 'rcPhone'> & Address) => void;
}

const ModalContent = memo(({ step, handleModalStep,handleUpdateInfo }: IModalContentProps) => {
  if (step === 0) {
    return (
      <DeliveryAddrList
        handleModalStep={handleModalStep}
        handleUpdateInfo={handleUpdateInfo}
      />
    );
  } else if (step === 1) {
    return (
      <DeliveryAddrForm
        handleCloseModal={() => handleModalStep(-1)}
      />
    );
  }

  return null;
});

const DeliveryModal = ({
  step,
  handleModalStep,
  handleUpdateInfo
}: IDeliveryModalProps) => {

  const ModalSize = useMemo(() => {
    if (step === 0) {
      return ({
        width: 563,
        height: '100%'
      });
    } else if (step === 1) {
      return ({
        width: 460,
        height: 'auto'
      });
    }

    return ({
      width: 0,
      height: 0
    });
  },[step]);
  
  return (
    <Bg onClick={() => handleModalStep(-1)}>
      <Modal 
        width={ModalSize.width}
        height={ModalSize.height}
        onClick={(e) => e.stopPropagation()}>
        <CloseBtn onClick={() => handleModalStep(-1)}/>
        <ModalContent
          step={step}
          handleModalStep={handleModalStep}
          handleUpdateInfo={handleUpdateInfo}
        />
      </Modal>
    </Bg>
  );
};

export default DeliveryModal;