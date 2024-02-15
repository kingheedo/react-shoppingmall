/* eslint-disable no-fallthrough */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PostBtn from './PostBtn';
import DeliveryModal from './DeliveryModal';
import hypenPhoneNum from '../../../utils/hypenPhoneNum';
import { getUser } from '../../../context/AuthProvider';
import { Address } from '../../../apis/user/schema';
import { DeliveryType } from '..';

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

const SaveCheckBox = styled.label`
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

interface IDeliveryInfoProps{
  modalStep: number;
  handleModalStep: (step: number) => void;
  handleAddress: (payload: DeliveryType) => void;
}

const DeliveryInfo = ({
  modalStep,
  handleModalStep,
  handleAddress
  
}: IDeliveryInfoProps) => {
  const me = getUser();
  const [info, setInfo] = useState<DeliveryType>({
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
  const [showResetBtn, setShowResetBtn] = useState({
    base: false,
    detail: false
  });
  const [showMsgList, setShowMsgList] = useState(false);

  /** 배송지 목록에서 하나의 배송지 선택 시 info 업데이트 핸들러 */
  const handleUpdateInfo = (payload: Omit<Address, 'id'> & { base?: boolean }) => {
    setInfo({
      rcName: payload.rcName,
      rcPhone: payload.rcPhone,
      address: {
        rcPostNum: payload.rcPostNum,
        rcPostBase: payload.rcPostBase,
        rcPostDetail: payload.rcPostDetail,
        base: payload.base ? payload. base : { ...info }.address.base
      },
      message: { ...info }.message,
    });
  };

  /** 새로입력 클릭 시 */
  const onClickResetForm = () => {
    setInfo({
      rcName: '',
      rcPhone: '',
      address: {
        rcPostNum: '',
        rcPostBase: '',
        rcPostDetail: '',
        base: false
      },
      message: '',
    });
  };
  
  /** 우편번호 및 기본 배송지 핸들러 */
  const handlePost = (payload:{ postNum: string, baseAddress: string }) => {
    const tempInfo = { ...info };
    setInfo({
      ...tempInfo,
      address: {
        rcPostNum: payload.postNum,
        rcPostBase: payload.baseAddress,
        rcPostDetail: tempInfo.address.rcPostDetail,
        base: tempInfo.address.base
      }
    });
  };

  /** input 핸들러
   * 
   * 1. target의 id에 따라서 value값을 수정
   * 2. target id가 address 이면 target의 name의 값을 변경하도록
   */
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === 'base-address-checkbox') {
      setInfo({
        ...info,
        address: {
          ...info.address,
          base: e.target.checked
        }
      });

      return;
    }
    if (e.target.id === 'address' ) {
      setInfo({
        ...info,
        address: {
          ...info.address,
          [e.target.name]: e.target.value
        }
      });

      return;
    }
    setInfo({
      ...info,
      [e.target.id]: e.target.value
    });

    return;
  };

  /** 배송 주소 input 삭제 버튼 보여주기 유무 핸들러 */
  const handleShowResetBtn = (payload: 'base' | 'detail') => {
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
          rcPostBase: ''
        }
      });

      break;
    
    case 'detail': 
      setInfo({
        ...tempInfo,
        address: {
          ...tempInfo.address,
          rcPostDetail: ''
        }
      });
    default:
      break;
    }
  };

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

  /** 유저 정보에 따라 info 값 업데이트 */
  useEffect(() => {
    setInfo({
      rcName: me?.address.rcName || '',
      rcPhone: me?.address.rcPhone || '',
      address: {
        rcPostNum: me?.address.rcPostNum || '',
        rcPostBase: me?.address.rcPostBase || '',
        rcPostDetail: me?.address.rcPostDetail || '',
        base: false,
      },
      message: '',
    });
  }, [me]);

  /** info가 변경될 때마다 Order 컴포넌트의 address 값 업데이트
   * 
   * 결제 성공시 배송지 확인을 위해
   */
  useEffect(() => {
    handleAddress(info);
  }, [info]);

  return (
    <DeliveryInfoArea>
      {modalStep >= 0 && (
        <DeliveryModal
          step={modalStep}
          handleModalStep={handleModalStep}
          handleUpdateInfo={handleUpdateInfo}
        />
      )}
      <DeliveryInfoHeader>
        <h4>
          배송지 정보
        </h4>
        <div className="btn-wrap">
          <BtnGray onClick={onClickResetForm}>
            새로입력
          </BtnGray>
          <BtnGray onClick={() => handleModalStep(0)}>
            배송지 목록
          </BtnGray>
        </div>
      </DeliveryInfoHeader>
      <DeliveryInfoMain>
        <DeliveryInfoRow>
          <label htmlFor="rcName">
            이름
          </label>
          <InputWrap>
            <input 
              id="rcName" 
              name="rcName" 
              onChange={onChangeValue} 
              value={info.rcName} 
              type="text" />

          </InputWrap>
        </DeliveryInfoRow>
        <DeliveryInfoRow>
          <label htmlFor="rcPhone">
            휴대폰
          </label>
          <InputWrap>
            <input 
              id="rcPhone"
              name="rcPhone"
              onChange={onChangeValue} 
              value={hypenPhoneNum(info.rcPhone)}
              maxLength={11}
              type="text" />

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
                name="rcPostNum" 
                onChange={onChangeValue}
                value={info.address.rcPostNum} 
                type="text" 
                readOnly
              />
              <PostBtn
                handlePost={handlePost}
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
                name="rcPostBase" 
                onChange={onChangeValue}
                onFocus={() => handleShowResetBtn('base')}
                onBlur={() => handleShowResetBtn('base')}
                value={info.address.rcPostBase} 
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
                name="rcPostDetail" 
                onChange={onChangeValue}
                onFocus={() => handleShowResetBtn('detail')}
                onBlur={() => handleShowResetBtn('detail')}
                value={info.address.rcPostDetail} 
                maxLength={100}
                type="text" />
              <ResetBtn 
                onMouseDown={() => onClickResetInput('detail')}
                className={`reset-btn ${showResetBtn.detail ? 'active' : ''}`}/>
            </InputWrap>
            <SaveCheckBox>
              <input id="base-address-checkbox" onChange={onChangeValue} type="checkbox" />
              <i/>
              기본 배송지로 저장
            </SaveCheckBox>
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