import React from 'react';
import styled from 'styled-components';
import PostBtn from '../../PostBtn';
import { useModal } from '../../../../../context/ModalProvider';
import hypenPhoneNum from '../../../../../utils/hypenPhoneNum';
import { DeliveryType } from '../../..';

const Form = styled.form`

`;

const Title = styled.h1`
  line-height: 50px;
  font-size: 21px;
  font-weight: 700;
  border-bottom: 1px solid #111;
`;

const Row = styled.div`
  position: relative;
  display: flex;
  margin-top: 30px;
  padding-left: 102px;
    > label {
      position: absolute;
      top: 9px;
      left: 0;
      line-height: 22px;
      font-size: 15px;

      &::after{
        position: absolute;
        top: 4px;
        content: '';
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #8e1fff;
        margin: 0 0 0 4px;
      }
    }

    input {
      flex: 1;
      height: 40px;
      line-height: 38px;
      padding: 0 20px;
      border: 1px solid #e5e5e5;
  }
`;

const AddressContainer = styled.div`
  flex : 1;

  > div{
    &:not(:last-of-type){
      margin-bottom: 8px;
    }
  }
  
  .post-num-wrap{
    display: flex;

    > button{
      padding: 0px 20px;
      margin-left: 10px;
      line-height: 38px;
      color: #444;
      border: 1px solid #e5e5e5;
      background: #fff;
      font-size: 14px;
    }
  }

  input{
      display: block;
      width: 100%;
  } 
`;

const SaveCheckBox = styled.label`
    display: flex;
    align-items: center;
    display: inline-block;
    box-sizing: border-box;
    margin-right: 10px;
    font-size: var(--fontD);
    line-height: var(--fontDL);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    color: var(--gray900);
    cursor: pointer;
    margin-top: 30px;

    > input{
      &[type=checkbox]:checked{
        +i{
          background: url(/checkbox_check.svg) center/24px no-repeat;
        }
      }
    }

      > i {
      width: 24px;
      height: 24px;
      display: inline-block;
      margin-right: 6px;
      background: url(/checkbox_uncheck.svg) center/24px no-repeat;
      border-radius: 4px;
      vertical-align: bottom;
      }
`;

const SaveButton = styled.button`
    margin-top: 30px;
    display: block;
    width: 100%;
    height: 50px;
    line-height: 48px;
    font-size: 15px;
    padding: 0 20px;
    color: #fff;
    background: #111;
    border: 1px solid #111;
`;

interface IDeliveryAddrFormProps{
  info: Omit<DeliveryType,'message'>;
  onChangeInputVal:(e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddress: (payload: {
    postNum: string;
    baseAddress: string;
  }) => void;
  onSave: () => void;
}

const DeliveryAddrForm = ({
  info,
  onChangeInputVal,
  handleAddress,
  onSave
}: IDeliveryAddrFormProps) => {

  const modal = useModal();

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    modal?.confirm.saveAddress.handleConfirm(() => onSave());
  };

  return (
    <Form onSubmit={handleSave}>
      <Title>
        배송정보
      </Title>
      <Row>
        <label htmlFor="rcName">
          이름
        </label>
        <input 
          id="rcName" 
          name="rcName"
          type="text"
          value={info.rcName}
          onChange={onChangeInputVal}
          required
        />
      </Row>
      <Row>
        <label htmlFor="rcPhone">
          휴대폰
        </label>
        <input 
          id="rcPhone" 
          name="rcPhone" 
          type="text"
          value={hypenPhoneNum(info.rcPhone)}
          onChange={onChangeInputVal}
          maxLength={11}
          required
        />
      </Row>
      <Row>
        <label htmlFor="rcPostNum">
          주소
        </label>
        <AddressContainer>
          <div className="post-num-wrap">
            <input 
              id="address" 
              name="rcPostNum" 
              type="text"
              value={info.address.rcPostNum}
              onChange={onChangeInputVal}
              required
              readOnly
            />
            <PostBtn
              handlePost={handleAddress}
            >
                주소찾기
            </PostBtn>
          </div>
          <div className="post-base-wrap">
            <input 
              id="address" 
              name="rcPostBase" 
              type="text"
              value={info.address.rcPostBase}
              onChange={onChangeInputVal}
              required
              readOnly
            />
          </div>
          <div className="post-detail-wrap">
            <input 
              id="address" 
              name="rcPostDetail" 
              type="text"
              value={info.address.rcPostDetail}
              onChange={onChangeInputVal}
              required
            />
          </div>
        </AddressContainer>
      </Row>
      <SaveCheckBox>
        <input onChange={onChangeInputVal} id="base-address-checkbox" type="checkbox" />
        <i/>
          기본 배송지로 저장
      </SaveCheckBox>
      <SaveButton>
        저장
      </SaveButton>
    </Form>
  );
};

export default DeliveryAddrForm;