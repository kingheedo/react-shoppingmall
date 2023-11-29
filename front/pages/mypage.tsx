import React, { FC } from 'react';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import moment from 'moment';
import axios from 'axios';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import apis from '../apis';
import BreadCrumb from '../components/common/BreadCrumb';
import { backUrl } from '../config/backUrl';

moment.locale('ko');

const Main = styled.div`
  width: 960px;
  margin: 0 auto;
`;

const Title = styled.h1`
    margin-bottom: 40px;
    font-size: var(--fontI);
    line-height: var(--fontIL);
    color: var(--gray900);
    text-align: center;
`;

const Content = styled.div`
`;

const DateWrap = styled.div`
  margin-top: 50px;
  text-align: right;  
`;

const TableWrap = styled.div`
  > h3{
    margin: 60px 0 20px 0;
    font-size: 25px;
    line-height: 36px;
  }
`;

const Table = styled.table`
  width: 100%;
  > thead{
    > tr{
      > th{
          text-align: left;
        a{
          float: right;
          }
      }
    }
    .row {
      :nth-child(1){
        > th {
          > span{
            display: inline-block;
            margin-left: 15px;
            color: #444;

            :first-child {
              display: inline-block;
              width: 100px;
              margin-left: 0;
              font-size: 16px;
              color: #111;
              font-weight: 400;
            }

            > strong {
              font-weight: 700;
            }
          }
        }
      }
      :nth-child(2) {
        > th {
          > span {
            color: #444;
            font-size: 14px;
          }
          > strong{
            display: inline-block;
            margin-left: 10px;
            font-weight: 700;
          }
        }
      }
    }
  }
`;

export const getServerSideProps: GetServerSideProps = async(context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['getAllPayments'], () => apis.Payment.getAllPayments());
  
  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};

const Mypage: FC = () => {
  const { data: payments } = useQuery(['getAllPayments'], () => apis.Payment.getAllPayments());
  
  return (
    <div className="my-page">
      <BreadCrumb 
        list={[
          { content: '마이페이지', href: '/mypage' },
          { content: '주문내역' }
        ]}
      />
      <Main>
        <Title>
          주문 내역
        </Title>
        <Content>
          <DateWrap>
            <input className="date-start" type="text" readOnly/>
            ~
            <input className="date-end" type="text" readOnly/>
            <button>조회하기</button>
          </DateWrap>
          <TableWrap>
            <h3>주문 내용</h3>
            <Table>
              <colgroup>
                <col width={'124'}/>
                <col width={'*'}/>
                <col width={'160'}/>
                <col width={'160'}/>
                <col width={'160'}/>
              </colgroup>
              <thead>
                <tr className="row">
                  <th colSpan={6}>
                    <span>
                      2023.11.29
                    </span>
                    <span>
                      입금액&nbsp; 
                      <strong>
                        577,500
                      </strong>
                      원
                    </span>
                    <span>
                      입금기한&nbsp;
                      <strong>
                        2023.11.29 23:59:59
                      </strong>
                    </span>
                    <Link href={'#'}>
                        주문상세
                    </Link>
                  </th>
                </tr>
                <tr className="row">
                  <th colSpan={6}>
                    <span>
                      받으시는 분
                    </span>
                    <strong>
                      왕희도
                    </strong>
                    <Link href={'#'}>
                      배송지 확인/변경
                    </Link>
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments?.map((payment,idx) => (
                  <tr key={idx}>
                    <td>
                      <img src={`${backUrl}/${payment.HistoryCart.Product.Images[0].src}`} alt={`${payment.HistoryCart.Product}의 이미지`} />
                    </td>
                    <td>
                      <span className="product-name">
                      리브드 랩
                      </span>
                      <em>
                      베이지,L,1개 / 39,900원
                      </em>
                    </td>
                    <td>
                      <span className="payment-status">입금대기</span>
                    </td>
                    <td/>
                    <td>
                      <button>
                      전체취소
                      </button>
                      <button>
                      결제수단 변경
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
          {payments?.map((payment,idx) => (
            <div key={idx}>
              {payment?.orderId}
            </div>
          ))}
        </Content>
      </Main>
    </div>
  );
};
export default Mypage;
