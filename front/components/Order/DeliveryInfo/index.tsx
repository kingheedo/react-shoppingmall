import React, { useState } from 'react';
import styled from 'styled-components';

const DeliveryInfoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 42px;
  width: 540px;
  > h4 {
    font-weight: 700;
    line-height: 28px;
    font-size: 19px;
    color: #111;
  }
`;

const BtnGray = styled.button`
    line-height: 38px;
    color: #fff;
    background: #444;
    border: 1px solid #444;
    padding: 0 20px;

    &:not(:last-of-type){
      margin-right: 8px;
    }
`;
const DeliveryInfoMain = styled.div`
  position: relative;
  width: 540px;
  margin-top: 20px;
`;

const DeliveryInfoRow = styled.div`
    display: flex;
    &:not(:first-child){
      margin-top: 20px;
    }
    > label{
      position: absolute;
      left: 0;
      &::after{
        position: absolute;
        display: inline-block;
        width: 5px;
        height: 5px;
        margin-left: 4px;
        border-radius: 50%;
        background: #8e1fff;
        content: '';
      }
    }

    .address-container{

    }

`;

const InputWrap = styled.div`
    display: flex;
    flex: 1;
    padding-left: 140px;
    height: 40px;

    > input{
      width: 100%;
    }

    &.address-input-wrap{
      display: flex;
    }
    .post-num-input{
        padding-right: 110px;
      
      + button {
        white-space: nowrap;
      }
    }
`;

const PostNumBtn = styled.button`
    width: 100px;
    margin-left: 10px;
    line-height: 38px;
    display: inline-block;
    box-sizing: border-box;
    padding: 0 20px;
    line-height: 34px;
    font-size: 14px;
    color: #444;
    text-align: center;
    background: #fff;
    border: 1px solid #e5e5e5;
`;

type InfoType = {
  name: string,
    phoneNum: string,
    address: {
      postNum: string,
      base: string,
      detail: string
    }
}

const DeliveryInfo = () => {
  const [info, setInfo] = useState<InfoType>({
    name: '',
    phoneNum: '',
    address: {
      postNum: '',
      base: '',
      detail: ''
    }
  });
  
  /** input 핸들러
   * 
   * 1. target의 id에 따라서 value값을 수정
   * 2. target id가 address 이면 target의 name의 값을 변경하도록
   */
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo({
      ...info,
      [e.target.id]: e.target.id === 'address' 
        ? {
          [e.target.name]: e.target.value
        }
        : e.target.value
    });
  };

  const onClickPost = () => {

  };

  return (
    <div className="delivery-info-area">
      <DeliveryInfoHeader>
        <h4>
          배송지 정보
        </h4>
        <div className="btn-wrap">
          <BtnGray>
            새로입력
          </BtnGray>
          <BtnGray>
            배송지 목록
          </BtnGray>
        </div>
      </DeliveryInfoHeader>
      <DeliveryInfoMain>
        <DeliveryInfoRow>
          <label htmlFor="name">
            이름
          </label>
          <InputWrap style={{
            paddingLeft: 110
          }}>
            <input id="name" onChange={onChangeValue} value={info.name} type="text" />

          </InputWrap>
        </DeliveryInfoRow>
        <DeliveryInfoRow>
          <label htmlFor="phoneNum">
            휴대폰
          </label>
          <InputWrap style={{
            paddingLeft: 110
          }}>
            <input id="phoneNum" onChange={onChangeValue} value={info.phoneNum} type="text" />

          </InputWrap>
        </DeliveryInfoRow>
        <DeliveryInfoRow className="address-row">
          <label htmlFor="address">
            배송주소
          </label>
          <div className="address-container">
            <InputWrap 
              className="address-input-wrap"
              style={{
                paddingLeft: 110
              }}>
              <input 
                id="address" 
                className="post-num-input"
                name="postNum" 
                onChange={onChangeValue} 
                value={info.address.postNum} 
                type="text" />
              <PostNumBtn 
                className="post-num-btn"
                onClick={onClickPost}
              >
              우편번호
              </PostNumBtn>
            </InputWrap>
            <InputWrap 
              className="address-input-wrap"
              style={{
                paddingLeft: 110
              }}>
              <input 
                id="address" 
                className="post-base-input"
                name="base" 
                onChange={onChangeValue} 
                value={info.address.postNum} 
                type="text" />
            </InputWrap>
            <InputWrap 
              className="address-input-wrap"
              style={{
                paddingLeft: 110
              }}>
              <input 
                id="address" 
                className="post-detail-input"
                name="detail" 
                onChange={onChangeValue} 
                value={info.address.postNum} 
                type="text" />
            </InputWrap>
          </div>
        </DeliveryInfoRow>
      </DeliveryInfoMain>
    </div>
  );  
};

export default DeliveryInfo;