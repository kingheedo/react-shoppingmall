import React from 'react';
import styled from 'styled-components';

const Bill = styled.div`
  background: #fafafa;
  padding: 70px 0;
  text-align: center;

  [class^=total-]{
    display: inline-block;
    > strong{
      display: inline-block;
      line-height: 36px;
      text-align: center;
      font-size: 27px;
      vertical-align: top;
    }

    > span{
      display: block;
      margin-top: 5px;
      line-height: 32px;
      color: #444;
      font-size: 15px;
    }
  }

  .total-delivery{
    padding-left: 80px;
    background: url(/bg_calc.gif) no-repeat;
    background-position: 30px 26px;
  }

  .total-discount {
    padding-left: 80px;
    color: #8e1fff;
    background: url(/bg_calc.gif) no-repeat;
    background-position: 30px -40px;
  }

  .total-payment{
    padding-left: 80px;
    background: url(/bg_calc.gif) no-repeat;
    background-position: 30px -104px;
  }
`;

interface IBillWrapProps {
  totalPrice: number;
}

const BillWrap = ({
  totalPrice
}: IBillWrapProps) => {
  return (
    <Bill>
      <div className="total-price">
        <strong>
          {totalPrice.toLocaleString('ko-KR')}원
        </strong>
        <br/>
        <span>
            총 상품금액
        </span>
      </div>
      <div className="total-delivery">
        <strong>
            0원
        </strong>
        <br/>
        <span>
            총 배송비
        </span>
      </div>
      <div className="total-discount">
        <strong>
            0원
        </strong>
        <br/>
        <span>
            총 할인금액
        </span>
      </div>
      <div className="total-payment">
        <strong>
          {totalPrice.toLocaleString('ko-KR')}원
        </strong>
        <br/>
        <span>
            총 주문금액
        </span>
      </div>
    </Bill>
  );
};

export default BillWrap;