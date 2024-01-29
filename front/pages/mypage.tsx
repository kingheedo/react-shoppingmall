import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import moment from 'moment';
import axios from 'axios';
import { QueryClient, dehydrate, useQuery, useQueryClient } from '@tanstack/react-query';
import apis from '../apis';
import BreadCrumb from '../components/common/BreadCrumb';
import { backUrl } from '../config/backUrl';
import { GetAllPaymentsRes, GetTossPmntOrderRes, SettlementState } from '../apis/payment/schema';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko';
import ReviewModal from '../components/ReviewModal';

registerLocale('ko', ko);
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
  display: flex;
  justify-content: flex-end;
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
  border-collapse: collapse;
  width: 100%;
  > thead{
    > tr{
      > th{
          text-align: left;
          padding: 6px 0;
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
  > tbody{
    tr{
      :first-child{
        td{
          border-top: 1px solid #111;
        }
      }
      td{
          padding: 25px 0;
          border-bottom: 1px solid #e5e5e5;
          text-align: center;

          .product-info-wrap{
            overflow: hidden;
            text-align: left;
            padding-left: 16px;
            > span{
              display: block;
            }

            .name {
              margin-bottom: 10px;
            }
            
            .option {
              color: #8e8e8e;
            }
          }

          .btn-group{
            button{
              width: 108px;
              min-width: 72px;
              padding: 0;
              font-size: 13px;
              line-height: 25px;
              background: #fff;
              border: 1px solid #e5e5e5;

              :not(:last-child){
                margin-bottom: 4px;
              }
            }
          }
      }
    }
  }
`;

const DatePickContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 30px;
  margin-right: 5px;
  background: #fff url(/bg_base.png) no-repeat 0 -547px;

  .react-datepicker-wrapper{
    input{
      width: 112px;
      height: 36px;
      text-align: center;
      text-indent: 8px;
      border: 1px solid #e5e5e5;

      :last-child{ 
        margin-left: 7px;
      }
    }
  }

  + button{
    height: 36px;
    border: 1px solid #111;
    color: #111;
    line-height: 34px;
    padding: 0 20px;
    background: #fff;
  }
`;

const DatePickerHeader = styled.div`
  position: relative;
  border: 0;
  background: #fff;
  color: #111;
  font-size: 17px;
  line-height: 18px;
  font-weight: 700;

  button {
    position: absolute;
    top: 0;
    width: 10px;
    height: 18px;
    border: 0;
    border-radius: 0;
    cursor: pointer;
}
.prev-btn{
    left:8px;
    background: url(/btn_prev_gray.svg) no-repeat center center/10px auto;
}
.next-btn{
    right: 8px;
    background: url(/btn_next_gray.svg) no-repeat center center/10px auto;
}
`;

export const getServerSideProps: GetServerSideProps = async(context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['getAllPayments'], () => apis.Payment.getAllPayments({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    endDate: new Date(),
    page: 0
  }));
  
  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  };
};

export type TargetPaymentType = {
  productId: number;
  paymentId: number;
}

type PayemntState = {
  dbPayments: GetAllPaymentsRes;
  tossPayment: GetTossPmntOrderRes;
}

const Mypage: FC = () => {
  
  const [paymentsState, setPaymentsState] = useState<Map<string, PayemntState>>(() => new Map());
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 3)));
  const [endDate, setEndDate] = useState(new Date());
  const [isInquired, setIsInquired] = useState(true); //조회하기 버튼 클릭 여부
  const [isCanceled, setIsCanceled] = useState(false); //결제 취소 여부
  const [reviewModal, setReviewModal] = useState(false); //리뷰 모달 오픈 여부
  const [targetPayment, setTargetPayment] = useState<TargetPaymentType>({ //리뷰 대상
    productId: -1,
    paymentId: -1
  });
  
  // const { data: payments } = useQuery(
  //   ['getAllPayments',
  //     startDate || endDate || isInquired, isCanceled],
  //   () => apis.Payment.getAllPayments({
  //     startDate: new Date(
  //       startDate.getUTCFullYear(),
  //       startDate.getUTCMonth(),
  //       startDate.getUTCDate(),
  //       startDate.getUTCHours(),
  //       startDate.getUTCMinutes(),
  //       startDate.getUTCSeconds(),
  //     ),
  //     endDate: new Date(
  //       endDate.getUTCFullYear(),
  //       endDate.getUTCMonth(),
  //       endDate.getUTCDate(),
  //       endDate.getUTCHours(),
  //       endDate.getUTCMinutes(),
  //       endDate.getUTCSeconds(),
  //     ),
  //   }),{
  //     enabled: !!startDate && !!endDate && isInquired
  //   });

  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const { data: payments, isPlaceholderData } = useQuery(
    ['getAllPayments',
      startDate || endDate || isInquired || isCanceled || page
    ],
    () => apis.Payment.getAllPayments({
      startDate: new Date(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate(),
        startDate.getUTCHours(),
        startDate.getUTCMinutes(),
        startDate.getUTCSeconds(),
      ),
      endDate: new Date(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth(),
        endDate.getUTCDate(),
        endDate.getUTCHours(),
        endDate.getUTCMinutes(),
        endDate.getUTCSeconds(),
      ),
      page
    }),{
      enabled: !!startDate && !!endDate && isInquired
    }
  );

  console.log('payments',payments);
  console.log('isPlaceholderData',isPlaceholderData);
  
  useEffect(() => {
    if (!isPlaceholderData) {
      // console.log('hasmore', payments!.hasMore);
      
      queryClient.prefetchQuery({
        queryKey: ['getAllPayments', startDate, endDate, page + 1],
        queryFn: () => () => apis.Payment.getAllPayments({
          startDate: new Date(
            startDate.getUTCFullYear(),
            startDate.getUTCMonth(),
            startDate.getUTCDate(),
            startDate.getUTCHours(),
            startDate.getUTCMinutes(),
            startDate.getUTCSeconds(),
          ),
          endDate: new Date(
            endDate.getUTCFullYear(),
            endDate.getUTCMonth(),
            endDate.getUTCDate(),
            endDate.getUTCHours(),
            endDate.getUTCMinutes(),
            endDate.getUTCSeconds(),
          ),
          page: page + 1
        })
      });
    }
  }, [payments, isPlaceholderData, page, queryClient, startDate, endDate]);
  
  /** 결제 진행 상황 텍스트 */
  const getSettlementStatus = (payload: { method: '카드' | '가상계좌' | '간편결제' | '휴대폰' | '계좌이체' | '문화상품권' | '도서문화상품권' | '게임문화상품권', status: SettlementState }) => {
    switch (payload.status) {
    case SettlementState.DONE:{
      if (payload.method === '가상계좌') {
        // return '입금 완료';
        return '구매 완료';
      } else {
        return '구매 완료';
      }
    }

    case SettlementState.EXPIRED:
        
      return '유효기간 만료';

    case SettlementState.CANCELED:

      return '전체 취소';
    case SettlementState.WAITING_FOR_DEPOSIT:

      return '입금 대기';
    default:
      return '';
    }
  };

  /** 조회하기 버튼 클릭 시 */
  const onClickInquiry = () => {
    setIsInquired(true);
  };

  /** 결제 취소 버튼 클릭 시 */
  const onClickCancel = (paymentKey: string) => {
    apis.Payment.cancelTossPmntOrder(paymentKey)
      .then(() => {
        setIsCanceled(true);
      })
      .catch((error) => {
        console.error(error);
      })
    ;
  };

  /** 리뷰 버튼 클릭 시 */
  const onClickReview = (payload: {
    productId:number,
    paymentId: number
  }) => {
    setTargetPayment(payload);
    setReviewModal(true);
  };

  useEffect(() => {
    (async () => {
      setPaymentsState(() => new Map());
      const orderIds = [...new Set(payments?.map(payment => payment.orderId))];
      const fethArr = orderIds.map(orderId => (
        apis.Payment.getTossPmntOrder(orderId)
      ));

      const tossPmntOrderList = await Promise.all(fethArr);
    
      for (let i = 0; i < tossPmntOrderList.length; i++) {
        const dbPayments = payments?.filter(payment => payment.orderId === tossPmntOrderList[i].orderId);
        if (!dbPayments) {
          return;
        }
        
        setPaymentsState(prev => new Map(prev).set(
          tossPmntOrderList[i].orderId, 
          {
            dbPayments, 
            tossPayment: tossPmntOrderList[i]
          }));
      }
      setIsInquired(false);
      setIsCanceled(false);
    })();
    
  },[payments, isCanceled]);

  return (
    <div className="my-page">
      {reviewModal && (
        <ReviewModal 
          target={targetPayment}
          onClose={() => setReviewModal(false)}/>
      )}
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
            <DatePickContainer>
              <DatePicker
                selected={startDate}
                onChange={(date: Date) => setStartDate(date)}
                startDate={startDate}
                maxDate={endDate}
                dateFormat={'yyyy-MM-dd'}
                locale="ko"
                renderCustomHeader={({
                  date,
                  decreaseMonth,
                  increaseMonth
                }) => (
                  <DatePickerHeader>
                    <button className="prev-btn" onClick={decreaseMonth}/>
                    {`${date.getFullYear()} ${date.getMonth() + 1}`}
                    <button className="next-btn" onClick={increaseMonth}/>
                  </DatePickerHeader>
                )}
              />
              {' ~ '}
              <DatePicker
                selected={endDate}
                onChange={(date: Date) => setEndDate(date)}
                endDate={endDate}
                minDate={startDate}
                dateFormat={'yyyy-MM-dd'}
                locale="ko"
                renderCustomHeader={({
                  date,
                  decreaseMonth,
                  increaseMonth
                }) => (
                  <DatePickerHeader>
                    <button className="prev-btn" onClick={decreaseMonth}/>
                    {`${date.getFullYear()} ${date.getMonth() + 1}`}
                    <button className="next-btn" onClick={increaseMonth}/>
                  </DatePickerHeader>
                )}
              />
            </DatePickContainer>
            <button
              onClick={onClickInquiry}
            >
              조회하기
            </button>
          </DateWrap>
          <TableWrap>
            <h3>주문 내용</h3>
            
            {Array.from(paymentsState.values()).map((val1,idx) => (
              <Table key={idx}>
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
                        {`${new Date(val1.dbPayments[0].createdAt).getFullYear()}.${new Date(val1.dbPayments[0].createdAt).getMonth() + 1}.${new Date(val1.dbPayments[0].createdAt).getDate()}`}
                      </span>
                      {(val1.tossPayment.cancels && val1.tossPayment.cancels[0] || !val1.tossPayment.virtualAccount) 
                        ? (
                          null
                        )
                        : (
                          <>
                            <span>
                              입금액&nbsp; 
                              <strong>
                                {val1.tossPayment.totalAmount.toLocaleString('ko-KR')}
                              </strong>
                              원
                            </span>
                            <span>
                            입금기한&nbsp;
                              <strong>
                                {moment(val1.tossPayment.virtualAccount.dueDate).format('YYYY.MM.DD HH:MM:SS')}
                              </strong>
                            </span>
                          </>
                        )
                      }
                      {/* <Link href={'#'}>
                        주문상세
                      </Link> */}
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
                      {/* {!(val1.tossPayment.cancels && val1.tossPayment.cancels[0]) && (
                        <Link href={'#'}>
                        배송지 확인/변경
                        </Link>)} */}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <>
                    {val1.dbPayments.map(val2 => (
                      <tr key={val2.id}>
                        <td>
                          <img src={`${backUrl}/${val2.HistoryCart.Product.Images[0].src}`} alt={`${val2.HistoryCart.Product.productName}의 이미지`} />
                        </td>
                        <td>
                          <div className="product-info-wrap">
                            <span className="name">
                              {val2.HistoryCart.Product.productName}
                            </span>
                            <em className="option">
                              {val2.HistoryCart.size},{val2.HistoryCart.quantity} / {val2.HistoryCart.totalPrice.toLocaleString('ko-KR')}원
                            </em>
                          </div>
                        </td>
                        <td>
                          <span className="status">{getSettlementStatus({ method: val1.tossPayment.method, status: val1.tossPayment.status })}</span>
                        </td>
                        <td/>
                        <td>
                          {!(val1.tossPayment.cancels && val1.tossPayment.cancels[0]) && (
                            <div className="btn-group">
                              {val1.tossPayment.status !== SettlementState.DONE && (
                                <button onClick={() => onClickCancel(val1.tossPayment.paymentKey)}>
                                전체취소
                                </button>)
                              }
                              {val1.tossPayment.status === SettlementState.DONE && !val2.isReviewed && (
                                <button onClick={() => onClickReview({
                                  productId: val2.HistoryCart.Product.id,
                                  paymentId: val2.id
                                })}>
                                  리뷰 작성
                                </button>)
                              }
                              {/* <button>
                              결제수단 변경
                              </button> */}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    <br/>
                    <br/>
                  </>
                </tbody>
              </Table>
            ))
            }
          </TableWrap>
        </Content>
      </Main>
    </div>
  );
};
export default Mypage;
