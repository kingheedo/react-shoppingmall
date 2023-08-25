const Cart = styled.div`
`;

const Breadcrumb = styled.div`
  padding: 20px var(--gap) 0px;
`;

const BreadcrumbOl = styled.ol`
  display: flex;
`;
const BreadcrumbLi = styled.li`
  margin-right: 8px;
  font-size: var(--fontB);
  line-height: var(--fontBL);
`;

const Main = styled.main`
  width: 960px;
  margin: 0 auto;

  label > {

    input[type=checkbox]{
    width:0;
    height: 0;

    +i {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url('/bg_component.png') no-repeat #fff -21px -1px;
      vertical-align: middle;
      border: 1px solid #e5e5e5;
      cursor: pointer;
    }

    :checked {
      +i {
        background-position: 0 0;
        background-color: #111;
        border: 0;
      }
    }
  }
`;

const HomeLink = styled(Link)`
  background: url('/chevron-right.svg') no-repeat right center/12px auto;
  padding-right: 20px;
  color: var(--gray450);
`;

const OrderWrap = styled.div`
  padding: 41px 0 120px;
`;
const Title = styled.h1`
  margin-bottom: 40px;
  font-size: var(--fontI);
  line-height: var(--fontIL);
  color: var(--gray900);
  text-align: center;
`;

const OrderHead = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 10px 0;
  font-weight: 400;

  > label {
      > i{
        margin-right: 8px;
      }
      > span{
      color: #111;
      font-weight: 700;
    }
  }
`;

const DltSlctedBtn = styled.button`
  padding: 0 20px;
  width: auto;
  height: 36px;
  font-size: 14px;
  line-height: 34px;
  border: 1px solid #e5e5e5;
  background: #fff;
  color: #111;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  > tr{
      > th {
      text-align: center;
      color: #767676;
      font-size: 14px;
      border-bottom: 1px solid #b8b8b8;
      padding: 10px 0;
      font-weight: 400;
    }
  }
}
`;
const Td = styled.td`
  position: relative;
  padding: 30px 0;
  border-top: 1px solid #e5e5e5;
  vertical-align: top;
`;
const ProductImg = styled.img`
  object-fit: cover;
  width: 100px;
`;

const BrandName = styled.span`
  display: block;
  width: 380px;
  height: 24px;
  line-height: 24px;
  font-size: 15px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #111;
`;

const ProductName = styled.span`
  display: block;
  width: 380px;
  height: 24px;
  line-height: 24px;
  font-size: 15px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #111;
`;

const ShippingWrap = styled.div`
  > span{
    display: block;
    line-height: 20px;
    font-size: 15px;
    word-break: keep-all;
  }
`;

const Fee = styled.span`
  margin: 0 20px;
  font-weight: 700;
  color: #111;

`;

const Status = styled.span`
  margin: 10px 20px 0;
  font-size: 14px;
  color: #767676;
`;

import {
  MouseEvent,
  useState
} from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import apis from '../../apis';
import OptionModal from './OptionModal';

const Option = styled.em`
  display: block;
  position: relative;
  margin-top: 8px;
  line-height: 18px;
  color: #767676;
  font-size: 14px;
`;

const AlterWrap = styled.div`
    margin-top: 30px;
`;

const AlterBtn = styled.button`
  padding: 0 20px;
  width: auto;
  height: 40px;
  font-size: 14px;
  line-height: 34px;
  border: 1px solid #e5e5e5;
  background: #fff;
  color: #111;
`;
const BuyNowBtn = styled.button`
  position: absolute;
  bottom: 30px;
  left: 20px;
  display: block;
  padding: 0;
  width: 140px;
  height: 40px;
  line-height: 38px;
  font-size: 15px;
  border-color: #d5d5d5;
  color: #fff;
  background: #111;
  border: 1px solid #111;
  text-align: center;
`;

const DeleteBtn = styled.button`
  display: block;
  position: absolute;
  top: 19px;
  right: 0;
  width: 16px;
  height: 16px;
  font-size: 0;
  background: url(/btn_x_gray.svg) no-repeat center center/14px auto;
`;

const ModalBg = styled.div`
  position: fixed;
  display: grid;
  place-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0, 0.25);
  z-index: 100;
`;

const CartComponent = () => {
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const [optionModal, setOptionModal] = useState(false);
  const { data: list } = useQuery( ['getCartList'], () => apis.Cart.getCartList());

  /** 옵션/변경 모달 핸들러 */
  const handleOptionModal = (open: boolean) => {
    setOptionModal(open);
  };

  const onCloseModal = () => {
    setOptionModal(false);
  };

  return (
    <>
      {optionModal && 
      <ModalBg onClick={onCloseModal}>
        <div onClick={e => e.stopPropagation()}>
          <OptionModal/>
        </div>
      </ModalBg>
      }
      <Cart>
        <Breadcrumb>
          <BreadcrumbOl>
            <BreadcrumbLi>
              <HomeLink href="/">
              Home
              </HomeLink>
            </BreadcrumbLi>
            <BreadcrumbLi>장바구니</BreadcrumbLi>
          </BreadcrumbOl>
        </Breadcrumb>
        <Main className="contents">
          <OrderWrap>
            <Title>
            장바구니
            </Title>
            <OrderHead>
              <label>
                <input type="checkbox" className="check-all" />
                <i/>
                <span>
                전체선택
                </span>
              </label>
              <DltSlctedBtn>
              선택 상품 삭제
              </DltSlctedBtn>
            </OrderHead>
            <Table>
              <colgroup>
                <col width={40}/>
                <col width={124}/>
                <col width={'*'}/>
                <col width={180}/>
                <col width={220}/>
              </colgroup>
              <Thead>
                <tr>
                  <th colSpan={3} scope="col">상품·혜택 정보</th>
                  <th>배송정보</th>
                  <th>주문금액</th>
                </tr>
              </Thead>
              <tbody>
                {list?.map(info => (
                  <tr key={info.id}>
                    <Td>
                      <label>
                        <input type="checkbox" />
                        <i/>
                      </label>
                    </Td>
                    <Td>
                      <Link href={`/product/${info.Product.id}`}>
                        <ProductImg
                          src={`${process.env.NEXT_PUBLIC_SERVER_URL}/${info.Product.Images[0].src}`} 
                          alt={info.Product.Images[0].src} />
                      </Link>

                    </Td>
                    <Td>
                      <div className="info">
                        <BrandName>
                      8 seconds
                        </BrandName>
                        <ProductName>
                          <Link href={`/product/${info.Product.id}`}>
                            <span>
                              {info.Product.productName}
                            </span>
                          </Link>
                        </ProductName>
                        <Option>
                          {info.size} / {info.quantity}
                        </Option>
                        <AlterWrap>
                          <AlterBtn onClick={() => handleOptionModal(true)}>
                            옵션/수량 변경
                          </AlterBtn>
                        </AlterWrap>
                      </div>
                    </Td>
                    <Td>
                      <ShippingWrap>
                        <Fee>
                          무료배송
                        </Fee>
                        <Status>
                          오늘 18시 전까지 주문 시, 오늘출고예정
                        </Status>
                      </ShippingWrap>
                    </Td>
                    <Td>
                      <div className="price">
                        <span>{info.totalPrice}</span>
                        {/* <em>33%</em> */}
                      </div>
                      <BuyNowBtn>
                        바로구매
                      </BuyNowBtn>
                      <DeleteBtn />
                    </Td>
                  </tr>
                ))}
              
              </tbody>
            </Table>
          </OrderWrap>
        </Main>
      </Cart>
    </>
  );
};

export default CartComponent;