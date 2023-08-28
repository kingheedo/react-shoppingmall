import React, { useState } from 'react';
import styled from 'styled-components';
import { Optionitem } from '..';

const Wrap = styled.div`
  position: relative;
  border: 0;
  width: auto;
  min-height: 150px;
  height: auto;
  background: #fff;
  overflow-x: hidden;
  padding: 0;
  color: #333;
`;

const Inner = styled.div`
  position: relative;
  padding: 35px 30px;
`;

const Title = styled.h2`
  line-height: 38px;
  font-size: 21px;
  letter-spacing: -1px;
  color: #111;
  font-weight: 700;
`;

const ProductName = styled.span`
  display: block;
  width: 380px;
  margin-top: 20px;
  color: #111;
  line-height: 20px;
  font-size: 15px;
`;

const SelctedOption = styled.em`
  display: block;
  margin-top: 20px;
  line-height: 18px;
  color: #8e8e8e;
  font-size: 14px;
`;

const OptionWrap = styled.div`
  margin-top: 14px;
  > ul {
    > li {
      padding: 12px 0;
      border-bottom: 1px solid #e5e5e5;
      > span {
        display: inline-block;
        width: 90px;
        line-height: 34px;
        vertical-align: top;
        color: #444;
        font-size: 15px;
      }
    }
  }
`;

const ButtonWrap = styled.div`
  display: inline-block;

  > button {
    position: relative;
    display: inline-block;
    width: 93px;
    height: 34px;
    line-height: 33px;
    color: #111;
    font-size: 15px;
    font-weight: 700;
    border-width: 1px 0px 1px 0px;
    border-color: #e5e5e5;
    border-style: solid;
    background: inherit;
    overflow: hidden;
    margin-right: -1px;

    ::before {
      position: absolute;
      content: '';
      display: block;
      left: 0;
      width: 1px;
      height: 34px;
      background-color: #e5e5e5;
    }

    ::after {
      position: absolute;
      content: '';
      display: block;
      top: 0;
      right: 0;
      width: 1px;
      height: 34px;
      background-color: #e5e5e5;
    }
  }

  .size_btn_active {
    color: #8e1fff;
    border-color: #8e1fff;
    border-width: 1px 0px 1px 0px;
    border-style: solid;

    ::before {
      background-color: #8e1fff;
    }

    ::after {
      background-color: #8e1fff;
    }

    :not(:last-of-type) {
      ::after {
        right: 1px;
      }
    }
  }
`;
const CloseBtn = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  margin: 0;
  padding: 0;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 0;
  background: url(/btn_x_gray.svg) no-repeat center center/15px auto;
`;

const QuantityWrap = styled.div`
  position: relative;
  display: inline-block;
  > button {
    display: inline-block;
    position: absolute;
    top: 0;
    width: 16px;
    height: 32px;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    line-height: 36px;
    color: #111;
    background: inherit;

    :nth-child(1) {
      left: 6px;
    }
    :nth-child(3) {
      right: 6px;
    }
  }

  > input {
    width: 140px;
    line-height: 24px;
    padding: 4px 0;
    text-align: center;
    border: 1px solid #e5e5e5;
  }
`;

const ChangeBtn = styled.button`
  width: 100%;
  color: #fff;
  background: #111;
  border: 1px solid #111;
  margin: 20px 0 0;
  min-width: auto;
  height: 50px;
  line-height: 48px;
  font-size: 15px;
  padding: 0 20px;
`;

interface IOptionModalProps {
  item: Optionitem;
  option: {
    size: string;
    quantity: number;
  };
  handleSize: (size: 'SM' | 'M' | 'L' | 'XL') => void;
  handleQuantity: (qty: number) => void;
  onCloseModal: () => void;
}

const OptionModal = ({
  item,
  option,
  handleSize,
  handleQuantity,
  onCloseModal,
}: IOptionModalProps) => {
  const onClickSize = (size: 'SM' | 'M' | 'L' | 'XL') => {
    handleSize(size);
  };

  const onClickQtyBtn = (payload: { type: 'MINUS' | 'PLUS' }) => {
    if (payload.type === 'MINUS') {
      if (option.quantity > 1) {
        handleQuantity(option.quantity - 1);
      }
    } else {
      handleQuantity(option.quantity + 1);
    }
  };

  return (
    <Wrap>
      <Inner>
        <CloseBtn onClick={onCloseModal} />
        <Title>옵션/수량 변경</Title>
        <ProductName>{item.name}</ProductName>
        <SelctedOption>
          {option.size} / {option.quantity}개
        </SelctedOption>
        <OptionWrap>
          <ul>
            <li>
              <span>사이즈</span>
              <ButtonWrap>
                {item.sizes?.map((size, idx) => (
                  <>
                    <button
                      key={size.option + idx}
                      className={
                        size.option === option.size ? 'size_btn_active' : ''
                      }
                      onClick={() => onClickSize(size.option)}
                    >
                      {size.option}
                    </button>
                  </>
                ))}
              </ButtonWrap>
            </li>
            <li>
              <span>수량</span>
              <QuantityWrap>
                <button
                  onClick={() => onClickQtyBtn({ type: 'MINUS' })}
                  className="minus"
                >
                  -
                </button>
                <input type="number" min={1} value={option.quantity} />
                <button
                  onClick={() => onClickQtyBtn({ type: 'PLUS' })}
                  className="plus"
                >
                  +
                </button>
              </QuantityWrap>
            </li>
          </ul>
        </OptionWrap>
        <ChangeBtn>변경하기</ChangeBtn>
      </Inner>
    </Wrap>
  );
};

export default OptionModal;
