'use client';

import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import BreadCrumb from '../../../../components/common/BreadCrumb';
import BillWrap from '../../../../components/common/BillWrap';
import LinkBtn from '../../../../components/common/LinkBtn';
import apis from '../../../../apis';
const Main = styled.div`
  width: 960px;
  margin: 0 auto;
  padding: 80px var(--gap) 120px;
`;

const OrderCheckWrap = styled.div`
  background: url(/bg_fin_check.svg) no-repeat 2px 46px/70px auto;
  padding: 138px 0 50px;

  + .info-row{
    border-top: 1px solid #e5e5e5;
  }

  > h2{
    font-size: 25px;
    line-height: 36px;
    color: #111;
  }

  > p{
    padding-top: 20px;
    font-size: 15px;
    line-height: 22px;

    > strong{
      font-weight: 700;
    }
  }

  > ul{
    padding-top: 20px;
    > li{
      padding-bottom: 10px;
      
      > span{
          font-weight: 700;
          display: inline-block;
          width: 75px;
          color: #767676;
      }
      > strong{
        font-weight: 700;
      }
    }
    .due-date{
        > strong{
          color: #8e1fff;
        }
      }
  }
`;

const InfoRow = styled.div`
  border-top: 1px solid #444;
  padding: 60px 0;

  > h3 {
    font-size: 19px;
    color: #111;
    line-height: 28px;
  }
  
  > p {
    margin-top: 32px;
    font-size: 17px;
    color: #444;
    
      > strong{
        font-size: 17px;
        font-weight: 700;

        + span {
          display: inline-block;
          margin-left: 5px;
        }
      }

      span {
        display: block;
      }
  }
  &.payment {
    > ul {
      margin-top: 40px;

      > li{
        &:first-child{
          border-top: 1px solid #f7f7f7;
        }
        display: block;
        padding: 25px 0;
        border-bottom: 1px solid #f7f7f7;
      }
    }
  }
`;
const SubmitWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 35px;
  
  > a{
    text-align: center;
    
    &:first-child{
      background: #fff;
      color: #111;
    }
  }
  
`;

const BankCodeObj: {
  [key: string]: string;
} = {
  '39': '경남',
  '12': '단위농협',
  '32': '부산',
  '45': '새마을',
  '64': '산림',
  '88': '신한',
  '48': '신협',
  '27': '씨티',
  '20': '우리',
  '71': '우체국',
  '50': '저축',
  '37': '전북',
  '35': '제주',
  '90': '카카오',
  '92': '토스',
  '81': '하나',
  '54': '',
  '03': '기업',
  '06': '국민',
  '31': '대구',
  '02': '산업',
  '11': '농협',
  '23': 'SC제일',
  '07': '수협'
};
type TossPayment = {
  orderId: string;
  paymentKey: string;
  orderName: string;
  approvedAt: string;
  amount: number;
  receipt: {
    url: string;
  };
  totalAmount: number;
  method: '카드' | '가상계좌' | '계좌이체';
  virtualAccount?:{
    bankCode: string;
    customerName: string;
    dueDate: string;
    accountNumber: string;
  }
}

interface IOrderSuccessPageProps{
  tossPayment: TossPayment;
}

const Result = ({ tossPayment }: IOrderSuccessPageProps) => {
  const router = useRouter();
  const { data: payments } = useQuery(['getPayments'], () => apis.Payment.getPayments(tossPayment.orderId));

  useEffect(() => {
    if (!tossPayment) {
      router.replace('/');
    }
  }, [tossPayment]);
  
  console.log('tossPayment',tossPayment);
  console.log('payments',payments);

  /** 가상계좌이면 true 아니면 false 리턴 */
  const isVirtualPayment = useMemo(() => {
    if (tossPayment?.virtualAccount) {
      return true;
    } else {
      return false;
    }
  },[tossPayment.virtualAccount]);

  return (
    <div className="order-succss-page">
      <BreadCrumb
        list={[{ content: '주문완료' }]}
      />
      <Main>
        <OrderCheckWrap>
          <h2>
            주문이 완료되었습니다.
          </h2>
          <p>
            주문하신 주문번호는 <strong>{tossPayment?.orderId}</strong> 입니다.
          </p>
          {isVirtualPayment && (
            <ul>
              <li className="total-amount">
                <span>
                입금금액
                </span>
                <strong>
                  {tossPayment?.totalAmount.toLocaleString('ko-KR')}원
                </strong>
              </li>
              <li className="account-info">
                <span>
                계좌정보
                </span>
                <strong>
                  {tossPayment?.virtualAccount && BankCodeObj[tossPayment?.virtualAccount.bankCode]}{tossPayment?.virtualAccount?.accountNumber}{tossPayment?.virtualAccount?.customerName}
                </strong>
              </li>
              <li className="due-date">
                <span>
                입금마감
                </span>
                <strong>
                  {tossPayment?.virtualAccount?.dueDate.split('T')[0]}까지
                </strong>
              </li>
            </ul>
          )}

        </OrderCheckWrap>
        <InfoRow id="address" className="info-row address">
          <h3>배송지 정보</h3>
          <p>
            <strong>{payments && payments[0].rcName}</strong>
            <span>
              {payments && payments[0].rcPhone}
            </span>
            <span>
              {`${payments && payments[0].rcPostBase} ${payments && payments[0].rcPostDetail}`}
            </span>
          </p>
        </InfoRow>
        <InfoRow id="payment" className="info-row payment">
          <h3>주문상품</h3>
          <ul>
            {payments?.map(payment => (
              <li key={payment.id}>
                <span className="name">
                  {`${payment.HistoryCart.Product.productName}, ${payment.HistoryCart.size}, ${payment.HistoryCart.quantity}개`}
                </span>
              </li>
            ))}
          </ul>
        </InfoRow>
        <BillWrap
          totalPrice={tossPayment.totalAmount}
        />
        <SubmitWrap>
          <LinkBtn
            href={'/'}
            content={'쇼핑 계속하기'}
          />
          <LinkBtn
            href={'/mypage'}
            content={'주문 조회'}
          />
        </SubmitWrap>
      </Main>
    </div>
  );
};

export default Result;