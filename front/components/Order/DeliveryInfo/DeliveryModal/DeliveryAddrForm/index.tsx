import React, { useState } from 'react';
import styled from 'styled-components';
import PostBtn from '../../PostBtn';

const Form = styled.form`

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

type InfoType = {
  name: string,
    phoneNum: string,
    address: {
      postNum: string,
      base: string,
      detail: string
    }
}

const DeliveryAddrForm = () => {

  const [info, setInfo] = useState<InfoType>({
    name: '',
    phoneNum: '',
    address: {
      postNum: '',
      base: '',
      detail: ''
    }
  });

  const handleAddress = (payload:{ postNum: string, baseAddress: string }) => {
    const tempInfo = { ...info };
    setInfo({
      ...tempInfo,
      address: {
        postNum: payload.postNum,
        base: payload.baseAddress,
        detail: tempInfo.address.detail
      }
    });
  };

  return (
    <Form>
      <Row>
        <label htmlFor="recipient-name">
          이름
        </label>
        <input 
          id="recipient-name" 
          name="recipient-name" 
          type="text" />
      </Row>
      <Row>
        <label htmlFor="recipient-phone">
          휴대폰
        </label>
        <input 
          id="recipient-phone" 
          name="recipient-phone" 
          type="text" />
      </Row>
      <Row>
        <label htmlFor="post-num">
          주소
        </label>
        <AddressContainer>
          <div className="post-num-wrap">
            <input 
              id="post-num" 
              name="post-num" 
              type="text"
              value={info.address.postNum}
              readOnly
            />
            <PostBtn
              handleAddress={handleAddress}
            >
                주소찾기
            </PostBtn>
          </div>
          <div className="post-base-wrap">
            <input 
              id="post-base" 
              name="post-base" 
              type="text"
              value={info.address.base}
              readOnly
            />
          </div>
          <div className="post-detail-wrap">
            <input 
              id="post-detail" 
              name="post-detail" 
              type="text"
              value={info.address.detail}
            />
          </div>
        </AddressContainer>
      </Row>
    </Form>
  );
};

export default DeliveryAddrForm;