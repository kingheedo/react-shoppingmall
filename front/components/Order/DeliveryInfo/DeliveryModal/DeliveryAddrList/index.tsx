import { useQuery } from '@tanstack/react-query';
import React from 'react';
import styled from 'styled-components';
import apis from '../../../../../apis';
import hypenPhoneNum from '../../../../../utils/hypenPhoneNum';
import { SaveType } from '..';
import { Address } from '../../../../../apis/user/schema';

const Title = styled.h1`
  line-height: 50px;
  font-size: 21px;
  font-weight: 700;
  border-bottom: 1px solid #111;
`;

const AddressListWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  > ul {
    height: 0;
    overflow-y: auto;
    flex: 1 1 auto;
    margin-top: 20px;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const AddressItem = styled.li`
    position: relative;
    display: block;
    padding: 35px 80px 27px 0;
    height: 119px;
    border-bottom: 1px solid #e5e5e5;

    .btn-wrap{
      position: absolute;
      top: 15px;
      right: 0;

      > button {
        display: inline-block;
        box-sizing: border-box;
        padding: 0 20px;
        line-height: 34px;
        font-size: 14px;
        color: #444;
        text-align: center;
        border: 1px solid #e5e5e5;
        background: #fff;

        &:first-of-type {
          margin-right: 3px;
        }

        &:not(:first-of-type){
          margin-left: 3px;
        }
      }
    }

  .name-and-phone{
    font-weight: 700;
    color: #111;
    font-size: 14px;
    line-height: 24px;
  }

  .address {
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 10px;
    word-break: break-all;
    color: #333333;
  }
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
  handleModalStep: (step: number) => void;
  handleReviseInfo: (payload: Address & { base: boolean }) => void;
  handleSaveType: (payload: SaveType) => void;
  handleUpdateInfo: (payload: Omit<Address, 'id'> & { base: boolean }) => void;
}

const DeliveryAddrList = ({
  handleModalStep,
  handleReviseInfo,
  handleSaveType,
  handleUpdateInfo
}: IDeliveryAddrListProps) => {
  const { data: addressList } = useQuery(['getAddresses'], () => apis.User.getAddresses());
  
  /** 수정 버튼 클릭 시 */
  const onClickRevise = (info: Address & { base: boolean }) => {
    handleModalStep(1);
    handleReviseInfo({
      id: info.id,
      rcName: info.rcName,
      rcPhone: info.rcPhone,
      rcPostNum: info.rcPostNum,
      rcPostBase: info.rcPostBase,
      rcPostDetail: info.rcPostDetail,
      base: info.base
    });
  };

  /** 선택 버튼 클릭 시 */
  const onClickSelect = (info: Address & { base: boolean }) => {
    handleUpdateInfo({
      rcName: info.rcName,
      rcPhone: info.rcPhone,
      rcPostNum: info.rcPostNum,
      rcPostBase: info.rcPostBase,
      rcPostDetail: info.rcPostDetail,
      base: info.base
    });
    handleModalStep(-1);
  };

  return (
    <AddressListWrap>
      <Title>
        배송지 목록
      </Title>
      <ul>
        {addressList?.map(info => (
          <AddressItem key={info.id}>
            <div className="btn-wrap">
              <button onClick={() => {
                handleSaveType(SaveType.EDIT);
                onClickRevise(info);
              }}>
                수정
              </button>
              <button onClick={() => onClickSelect(info)}>
                선택
              </button>
            </div>
            <p className="name-and-phone">
              {info.rcName}&nbsp;{hypenPhoneNum(info.rcPhone)}
            </p>
            <p className="address">
              &#91;{info.rcPostNum}&#93; {info.rcPostBase}&nbsp;{info.rcPostDetail}
            </p>
            
          </AddressItem>
        ))}
      </ul>
      <AddBtnWrap>
        <button onClick={() => {
          handleSaveType(SaveType.ADD);
          handleModalStep(1);
        }}>
          + 신규 배송지 추가
        </button>
      </AddBtnWrap>
    </AddressListWrap>
  );
};

export default DeliveryAddrList;