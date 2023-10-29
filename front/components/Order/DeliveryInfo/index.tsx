/* eslint-disable no-fallthrough */
import React, { useState } from 'react';
import styled from 'styled-components';
import PostBtn from './PostBtn';

interface IMessageContainerProps{
  showMsgList: boolean;
}

const DeliveryInfoArea = styled.div`
    margin-top: 70px;
    border-top: 1px solid #444;
`;

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
    position: relative;
    display: flex;
    &:not(:first-child){
      margin-top: 20px;
    }
    > label{
      position: absolute;
      top: 9px;
      left: 0;
      cursor: pointer;
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
      flex: 1
    }

`;

const InputWrap = styled.div`
    position: relative;
    display: flex;
    flex: 1;
    padding-left: 110px;
    height: 40px;

    input{
      width: 100%;
      line-height: 38px;
      padding: 0 20px;
      border: 1px solid #e5e5e5;
    }

    &.address-input-wrap{
      display: flex;

      &:not(:first-child){
        margin-top: 8px;
      }
    }
    .post-num-input{
      
      + button {
        white-space: nowrap;
      }
    }
`;

const BaseDeliveryCheck = styled.label`
    display: flex;
    align-items: center;
    margin-top: 10px;
    padding-left: 110px;
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

const ResetBtn = styled.button`
      position: absolute;
      top: 50%;
      right: 5px;
      transform: translateY(-50%);
      display: none;
      width: 22px;
      height: 22px;
      background: url(/btn_x.svg) no-repeat center center/12px auto;

      &.active{
      display: inline-block;
      }
`;

const MessageContent = styled.div`
      position: relative;
      flex: 1;
`;

const MessageContainer = styled.ul<IMessageContainerProps>`
      position: absolute;
      top: 40px;
      display: ${(props) => props.showMsgList ? 'block' : 'none'};
      width: 100%;
      padding: 20px 0;
      border: 1px solid #e5e5e5;
      background: #fff;
`;

const MessageItem = styled.li`
      padding: 0px 20px;

      > span{
        font-size: 14px;
        line-height: 36px;
        color: #444;
        cursor: pointer;
      }
`;

type InfoType = {
  name: string,
    phoneNum: string,
    address: {
      postNum: string,
      base: string,
      detail: string
    },
    message: string
}

interface IDeliveryInfoProps{
  handleModalStep: () => void;
}

const DeliveryInfo = ({
  handleModalStep
}: IDeliveryInfoProps) => {
  const [info, setInfo] = useState<InfoType>({
    name: '',
    phoneNum: '',
    address: {
      postNum: '',
      base: '',
      detail: ''
    },
    message: ''
  });
  const [showResetBtn, setShowResetBtn] = useState({
    base: false,
    detail: false
  });

  /** 새로입력 클릭 시 */
  const onClickResetForm = () => {
    setInfo({
      name: '',
      phoneNum: '',
      address: {
        postNum: '',
        base: '',
        detail: ''
      },
      message: ''
    });
  };
  
  /** 우편번호 및 기본 배송지 핸들러 */
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

  /** 배송 주소 input 삭제 버튼 보여주기 유무 핸들러 */
  const handleShowResetBtn = (payload: 'base' | 'detail') => {
    console.log('payload');
    const tempShowResetBtn = { ...showResetBtn };
    setShowResetBtn({
      ...showResetBtn,
      [payload]: !tempShowResetBtn[payload]
    });
  };

  /** input의 x버튼 클릭 시 값 초기화 */
  const onClickResetInput = (payload: 'base' | 'detail') => {
    const tempInfo = info;

    switch (payload) {
    case 'base':
      setInfo({
        ...tempInfo,
        address: {
          ...tempInfo.address,
          base: ''
        }
      });

      break;
    
    case 'detail': 
      setInfo({
        ...tempInfo,
        address: {
          ...tempInfo.address,
          detail: ''
        }
      });
    default:
      break;
    }
  };

  const [showMsgList, setShowMsgList] = useState(false);
  const onFocusMessage = () => {
    setShowMsgList(true);
  };

  const onClickMsg = (e: React.MouseEvent<HTMLLIElement>) => {
    setInfo({
      ...info,
      message: e.currentTarget.innerText
    });
    setShowMsgList(false);
  };

  return (
    <DeliveryInfoArea>
      <DeliveryInfoHeader>
        <h4>
          배송지 정보
        </h4>
        <div className="btn-wrap">
          <BtnGray onClick={onClickResetForm}>
            새로입력
          </BtnGray>
          <BtnGray onClick={handleModalStep}>
            배송지 목록
          </BtnGray>
        </div>
      </DeliveryInfoHeader>
      <DeliveryInfoMain>
        <DeliveryInfoRow>
          <label htmlFor="name">
            이름
          </label>
          <InputWrap>
            <input id="name" onChange={onChangeValue} value={info.name} type="text" />

          </InputWrap>
        </DeliveryInfoRow>
        <DeliveryInfoRow>
          <label htmlFor="phoneNum">
            휴대폰
          </label>
          <InputWrap>
            <input id="phoneNum" onChange={onChangeValue} value={info.phoneNum} type="text" />

          </InputWrap>
        </DeliveryInfoRow>
        <DeliveryInfoRow className="address-row">
          <label htmlFor="address">
            배송주소
          </label>
          <div className="address-container">
            <InputWrap 
              className="address-input-wrap">
              <input 
                id="address" 
                className="post-num-input"
                title="배송주소"
                name="postNum" 
                onChange={onChangeValue}
                value={info.address.postNum} 
                type="text" 
                readOnly
              />
              <PostBtn
                handleAddress={handleAddress}
              >
                우편번호
              </PostBtn>
            </InputWrap>
            <InputWrap 
              className="address-input-wrap">
              <input 
                id="address" 
                className="post-base-input"
                title="배송주소"
                name="base" 
                onChange={onChangeValue}
                onFocus={() => handleShowResetBtn('base')}
                onBlur={() => handleShowResetBtn('base')}
                value={info.address.base} 
                type="text" 
                readOnly
              />
              <ResetBtn 
                onMouseDown={() => onClickResetInput('base')}
                className={`reset-btn ${showResetBtn.base ? 'active' : ''}`}/>
            </InputWrap>
            <InputWrap 
              className="address-input-wrap">
              <input 
                id="address" 
                className="post-detail-input"
                title="상세주소"
                name="detail" 
                onChange={onChangeValue}
                onFocus={() => handleShowResetBtn('detail')}
                onBlur={() => handleShowResetBtn('detail')}
                value={info.address.detail} 
                maxLength={100}
                type="text" />
              <ResetBtn 
                onMouseDown={() => onClickResetInput('detail')}
                className={`reset-btn ${showResetBtn.detail ? 'active' : ''}`}/>
            </InputWrap>
            <BaseDeliveryCheck>
              <input type="checkbox" />
              <i/>
              기본 배송지로 저장
            </BaseDeliveryCheck>
          </div>
        </DeliveryInfoRow>
        <DeliveryInfoRow>
          <label htmlFor="message">
            배송메시지
          </label>
          <InputWrap 
            className="message-input-wrap">
            <MessageContent>
              <input 
                id="message" 
                name="message"
                className="message-input"
                onChange={onChangeValue} 
                onFocus={onFocusMessage}
                onBlur={() => setShowMsgList(false)}
                value={info.message} 
                type="text" />
              <MessageContainer showMsgList={showMsgList}>
                <MessageItem onMouseDown={onClickMsg}>
                  <span>
                  부재 시 경비실에 맡겨주세요.
                  </span>
                </MessageItem>
                <MessageItem onMouseDown={onClickMsg}>
                  <span>
                  부재 시 문 앞에 놓아주세요.
                  </span>              
                </MessageItem>
                <MessageItem onMouseDown={onClickMsg}>
                  <span>
                  배송 전에 연락주세요.
                  </span>
                </MessageItem>
                <MessageItem onMouseDown={onClickMsg}>
                  <span>
                  빠른 배송 부탁드려요.
                  </span>
                </MessageItem>
                <MessageItem onMouseDown={onClickMsg}>
                  <span>
                    배관함에 넣어주세요.
                  </span>
                </MessageItem>
                <MessageItem onMouseDown={onClickMsg}>
                  <span>
                    무인 택배함에 보관해주세요.
                  </span>
                </MessageItem>
              </MessageContainer>
            </MessageContent>
          </InputWrap>
        </DeliveryInfoRow>
      </DeliveryInfoMain>
    </DeliveryInfoArea>
  );  
};

export default DeliveryInfo;