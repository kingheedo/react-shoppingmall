/* eslint-disable react/display-name */
import React, { memo, useMemo, useState } from 'react';
import styled from 'styled-components';
import DeliveryAddrList from './DeliveryAddrList';
import DeliveryAddrForm from './DeliveryAddrForm';
import { Address, InfoType } from '..';
import { useMutation } from '@tanstack/react-query';
import apis from '../../../../apis';

interface IModalProps {
  width: number;
  height: number | string;
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

export enum SaveType {
  ADD = 'ADD',
  EDIT = 'EDIT'
}

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
    
  const [info, setInfo] = useState<Omit<InfoType,'message'> & { id: number }>({
    id: -1,
    rcName: '',
    rcPhone: '',
    address: {
      rcPostNum: '',
      rcPostBase: '',
      rcPostDetail: ''
    }
  });
  const [saveType, setSaveType] = useState<SaveType>(SaveType.ADD);
  
  const { mutate: addAddress } = useMutation(() => apis.User.addAddress({
    rcName: info.rcName,
    rcPhone: info.rcPhone,
    rcPostNum: info.address.rcPostNum,
    rcPostBase: info.address.rcPostBase,
    rcPostDetail: info.address.rcPostDetail
  }), {
    onSuccess: () => {
      handleModalStep(-1);
      alert('저장되었습니다.');
    }
  });

  const { mutate: updateAddress } = useMutation(() => apis.User.updateAddress({
    id: info.id,
    rcName: info.rcName,
    rcPhone: info.rcPhone,
    rcPostNum: info.address.rcPostNum,
    rcPostBase: info.address.rcPostBase,
    rcPostDetail: info.address.rcPostDetail
  }), {
    onSuccess: () => {
      handleModalStep(-1);
      alert('저장되었습니다.');
    }
  });

  if (step === 0) {
    const handleReviseInfo = (payload: Omit<InfoType,'message'> & { id: number }) => {
      setInfo(payload);
    };
    const handleSaveType = (payload: SaveType) => {
      setSaveType(payload);
    };

    return (
      <DeliveryAddrList
        handleModalStep={handleModalStep}
        handleReviseInfo={handleReviseInfo}
        handleSaveType={handleSaveType}
        handleUpdateInfo={handleUpdateInfo}
      />
    );
  } else if (step === 1) {
    console.log('saveType',saveType);
  
    const onChangeInputVal = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInfo({
        ...info,
        [e.target.id]: e.target.id === 'address'
          ? {
            ...info.address,
            [e.target.name]: e.target.value
          }
          : e.target.value
      });
    };

    const handleAddress = (payload:{ postNum: string, baseAddress: string }) => {
      const tempInfo = { ...info };
      setInfo({
        ...tempInfo,
        address: {
          rcPostNum: payload.postNum,
          rcPostBase: payload.baseAddress,
          rcPostDetail: tempInfo.address.rcPostDetail
        }
      });
    };

    return (
      <DeliveryAddrForm
        info={info}
        onChangeInputVal={onChangeInputVal}
        handleAddress={handleAddress}
        onSave={saveType === SaveType.ADD ? addAddress : updateAddress}
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