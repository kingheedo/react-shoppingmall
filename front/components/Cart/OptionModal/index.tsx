import React, { useState } from 'react';
import styled from 'styled-components';

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

        ::before{
          position: absolute;
          content: '';
          display: block;
          left: 0;
          width: 1px;
          height: 34px;
          background-color: #e5e5e5;
        }

           ::after{
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

      .size_btn_active{
        color: #8e1fff;
        border-color: #8e1fff;
        border-width: 1px 0px 1px 0px;
        border-style: solid;


        ::before{
          background-color: #8e1fff;
        }
        
        ::after{
            background-color: #8e1fff;
          }

        :not(:last-of-type){
          ::after{
            right: 1px;
          }
        }

      }
    `;
const sizes = ['M','M','M','M'];

const OptionModal = () => {
  const [btnIdx, setBtnIdx] = useState(-1);
  
  const onClickSize = (idx: number) => {
    setBtnIdx(idx);
  };

  return (
    <Wrap>
      <Inner>
        <Title>옵션/수량 변경</Title>
        <ProductName>
          빅 로고 티셔츠 - 그레이시 바이올렛
        </ProductName>
        <SelctedOption>
          L / 1개
        </SelctedOption>
        <OptionWrap>
          <ul>
            <li>
              <span>사이즈</span>
              <ButtonWrap>
                {sizes.map((size,idx) => (
                  <>
                    <button 
                      key={size}
                      className={btnIdx === idx ? 'size_btn_active' : ''}
                      onClick={() => onClickSize(idx)} 
                    >
                      {size}
                    </button>
                  </>
                ))}
              </ButtonWrap>
            </li>
            <li>
              <span>수량</span>
              <input type="number" />
            </li>
          </ul>
        </OptionWrap>
      </Inner>
    </Wrap>
  );
};

export default OptionModal;