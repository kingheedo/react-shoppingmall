import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apis from '../../apis';
import OptionModal from './OptionModal';
import { ChangeOption, GetCartListRes, Size } from '../../apis/cart/schema';
import { useModal } from '../../context/ModalProvider';
import BreadCrumb from '../common/BreadCrumb';
import { GetServerSideProps } from 'next';
import axios from 'axios';

const Cart = styled.div``;

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
    cursor: pointer;
    > i {
      margin-right: 8px;
    }
    > span {
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
  > span {
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
  background: rgba(0, 0, 0, 0.25);
  z-index: 100;
`;

const GrayArea = styled.div`
    margin: 10px 0 0 40px;
    padding: 30px 40px;
    width: 838px;
    background-color: #fafafa;
    border: 1px solid #efefef;

    > h5 {
        margin-bottom: 8px;
        color: #8e8e8e;
        font-size: 15px;
        font-weight: 400;
      }
    }
`;

const AmountWrap = styled.div`
    display: flex;
    justify-content: space-between
`;

const DetailAmt = styled.div`
  font-size: 16px;
  color: #111;
`;

const Amount = styled.div`
  > h4 {
    font-weight: 400;
    font-size:23px;
    color: #111;
    display: inline-block;
  }

  > em {
    font-size: 23px;
    font-weight: 700;
  }

  > span {
    display: block;
    color: #8e8e8e;
    font-size: 14px;
    font-weight: 400;
  }
`;

const SubOrder = styled.div`
  border-top: 2px solid #111;
  border-bottom: 2px solid #111;
  margin-top: 70px;

  > h4 {
    height: 50px;
    line-height: 50px;
    font-size: 17px;
    border-bottom: 1px solid #efefef;
    > span{
    margin-left: 10px;
    font-size: 17px;
    font-weight: 400;
    > em{
    color: #8e1fff;
    font-weight: 700;
      }
    }
  }
`;
const CalcWrap = styled.div`
  padding: 35px 0;
  text-align: center;
`;
const CalcItem = styled.div`
  display: inline-block;
  line-height: 36px;
  text-align: center;
  font-size: 27px;
  vertical-align: top;
  > em{
    display: block;
    margin-top: 5px;
    line-height: 32px;
    color: #444;
    font-size: 15px;
  }
  :nth-of-type(2) {
    padding-left: 80px;
    background: url('/bg_calc.gif') no-repeat;
    background-position: 30px 26px;
  }

  :nth-of-type(3) {
    padding-left: 80px;
    background: url('/bg_calc.gif') no-repeat;
    background-position: 30px -40px;
  }

  :nth-of-type(4) {
    padding-left: 80px;
    background: url('/bg_calc.gif') no-repeat;
    background-position: 30px -104px;
  }
`;

const SubmitWrap = styled.div`
    margin: 0 0 40px 0;
    text-align: center;
  > a{
    display: inline-block;
    line-height: 58px;
    font-size: 17px;
    margin: 0 4px;
    min-width: 256px;
    padding: 0 69px;
    height: 60px;
    color: #fff;
    background: #111;
    border: 1px solid #111;
  }
`;

export type Optionitem = {
  cartId: number | null;
  name: string | null;
  sizes:{ option: Size
  }[] | null;
};

export enum Delete {
  MULTIPLE = 'MULTIPLE',
  EACH = 'EACH'
}

const CartComponent = () => {
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const [selectd, setSelectd] = useState<GetCartListRes | null>(null);
  const [opSize, setOpSize] = useState(Size.SM);
  const [opQty, setOpQty] = useState(1);
  const optionItem = useMemo(() => {
    return {
      cartId: selectd?.id || null,
      product: {
        id: selectd?.Product.id,
        price: selectd?.Product.price
      } || null,
      name: selectd?.Product.productName || null,
      sizes: selectd?.Product.Sizes || null,
    };
  }, [selectd]);
  const modal = useModal();
  
  const queryClient = useQueryClient();
  const { data: list } = useQuery(['getCartList'], () =>
    apis.Cart.getCartList(),
  );

  const totalPrice = useMemo(() => {
    let price = 0;

    for (let i = 0; i < checkedList.length; i++) {
      const id = checkedList[i];
      price += list?.find(val => val.id === id)?.totalPrice || 0;
    }
    
    return price;
  },[list,checkedList]);

  /** 장바구니 아이템 삭제 */
  const { mutate: deleteItem } = useMutation((ids: number[]) => apis.Cart.deleteItem(ids), {
    onSettled: () => {
      queryClient.invalidateQueries(['getCartList']);
    },
  });

  /** 장바구니 아이템 옵션변경 */
  const { mutate: changeOption } = useMutation((data: ChangeOption) => apis.Cart.changeOption(data),{
    onSettled: () => {
      queryClient.invalidateQueries(['getCartList']);
    }
  });

  /** 모달 닫기 시 */
  const onCloseModal = () => {
    setSelectd(null);
  };

  /** 수량 핸들러 */
  const handleQuantity = (qty: number) => {
    setOpQty(qty);
  };

  /** 사이즈 핸들러 */
  const handleSize = (size: Size) => {
    setOpSize(size);
  };

  /** 옵션/변경 모달 핸들러 */
  const handleOptionModal = (idx: number) => {
    if (list) {
      setSelectd(list[idx]);
    }
  };

  /** 삭제 클릭 시 */
  const onClickDelete = (payload: { type : Delete, id?: number }) => {
    if (payload.type === Delete.MULTIPLE) {
      if (checkedList.length < 1) {
        return modal?.confirm.noSelectCartItem.handleConfirm();
      }
      modal?.confirm.deleteCart.handleConfirm(() => deleteItem([...checkedList]));
    } else if (payload.type === Delete.EACH) {
      modal?.confirm.deleteCart.handleConfirm(() => payload.id && deleteItem([payload.id]));
    }
    
  };

  /** 옵션 및 수량 변경 클릭 시 */
  const onClickChOp = () => {
    changeOption({
      id: optionItem.cartId!,
      productId: optionItem.product.id!,
      size: opSize!,
      quantity: opQty,
      totalPrice: optionItem.product.price! * opQty
    });
    onCloseModal();
  };

  /** 체크 박스 클릭 시 */
  const onCheck = (type: 'EACH' | 'ALL', id?: number) => {
    if (type === 'ALL') {
      const ids = list?.map(cart => cart.id);
      if (checkedList.length === ids?.length && checkedList.length > 0) {
        setCheckedList([]);
      } else {
        if (ids?.length) {
          setCheckedList([...ids]);
        }
      }
    } else if (type === 'EACH' && id) {
      checkedList.includes(id) ? setCheckedList(prev => prev.filter(cartId => cartId !== id)) : setCheckedList(prev => [...prev, id]);
    }
  };

  useEffect(() => {
    if (selectd) {
      setOpSize(selectd?.size);
      setOpQty(selectd?.quantity);
    }
  }, [selectd]);

  useEffect(() => {
    onCheck('ALL');
  }, [list]);

  return (
    <>
      {selectd?.id && (
        <ModalBg onClick={onCloseModal}>
          <div onClick={(e) => e.stopPropagation()}>
            <OptionModal
              item={optionItem}
              option={{
                size: opSize,
                quantity: opQty,
                onClickChOp: onClickChOp,
                handleSize: handleSize,
                handleQuantity: handleQuantity
              }}
              onCloseModal={onCloseModal}
            />
          </div>
        </ModalBg>
      )}
      <Cart>
        <BreadCrumb>
          장바구니
        </BreadCrumb>
        <Main className="contents">
          <OrderWrap>
            <Title>장바구니</Title>
            <OrderHead>
              <label>
                <input 
                  checked={checkedList.length === list?.length && checkedList.length > 0}
                  onChange={() => onCheck('ALL')} 
                  type="checkbox" 
                  className="check-all" />
                <i />
                <span>전체선택</span>
              </label>
              <DltSlctedBtn onClick={() => onClickDelete({ type: Delete.MULTIPLE })}>선택 상품 삭제</DltSlctedBtn>
            </OrderHead>
            <Table>
              <colgroup>
                <col width={40} />
                <col width={124} />
                <col width={'*'} />
                <col width={180} />
                <col width={220} />
              </colgroup>
              <Thead>
                <tr>
                  <th colSpan={3} scope="col">
                    상품·혜택 정보
                  </th>
                  <th>배송정보</th>
                  <th>주문금액</th>
                </tr>
              </Thead>
              <tbody>
                {list?.map((info, idx) => (
                  <tr key={info.id}>
                    <Td>
                      <label>
                        <input 
                          checked={checkedList.includes(info.id)}
                          onChange={() => onCheck('EACH', info.id)}
                          type="checkbox" />
                        <i />
                      </label>
                    </Td>
                    <Td>
                      <Link href={`/product/${info.Product.id}`}>
                        <ProductImg
                          src={`${process.env.NEXT_PUBLIC_SERVER_URL}/${info.Product.Images[0].src}`}
                          alt={info.Product.Images[0].src}
                        />
                      </Link>
                    </Td>
                    <Td>
                      <div className="info">
                        <BrandName>8 seconds</BrandName>
                        <ProductName>
                          <Link href={`/product/${info.Product.id}`}>
                            <span>{info.Product.productName}</span>
                          </Link>
                        </ProductName>
                        <Option>
                          {info.size} / {info.quantity}
                        </Option>
                        <AlterWrap>
                          <AlterBtn onClick={() => handleOptionModal(idx)}>
                            옵션/수량 변경
                          </AlterBtn>
                        </AlterWrap>
                      </div>
                    </Td>
                    <Td>
                      <ShippingWrap>
                        <Fee>무료배송</Fee>
                        <Status>오늘 18시 전까지 주문 시, 오늘출고예정</Status>
                      </ShippingWrap>
                    </Td>
                    <Td>
                      <div className="price">
                        <span>{new Intl.NumberFormat('ko-KR').format(info.totalPrice)}</span>
                        {/* <em>33%</em> */}
                      </div>
                      <BuyNowBtn>바로구매</BuyNowBtn>
                      <DeleteBtn onClick={() => onClickDelete({ type: Delete.EACH, id: info.id })} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <GrayArea>
              <h5>스토어 주문금액 합계</h5>
              <AmountWrap>
                <DetailAmt>
                  상품금액 {totalPrice.toLocaleString()}원 &nbsp;&nbsp;+ &nbsp;&nbsp;배송비 0원 &nbsp;&nbsp;-&nbsp;&nbsp; 할인금액 0 원
                </DetailAmt>
                <Amount>
                  <h4>{totalPrice.toLocaleString()}</h4>
                  <em>원</em><br/>
                  <span>39,900원 이상 무료배송</span>
                </Amount>
              </AmountWrap>
            </GrayArea>
            <SubOrder>
              <h4>
                결제 예정 금액
                <span>총&nbsp;<em>{checkedList.length}</em>건</span>
              </h4>
              <CalcWrap>
                <CalcItem>
                  <span>
                    {totalPrice.toLocaleString()}원
                  </span>
                  <em>
                    상품금액
                  </em>
                </CalcItem>
                <CalcItem>
                  <span>
                    0원
                  </span>
                  <em>
                    배송비
                  </em>
                </CalcItem>
                <CalcItem>
                  <span>
                    0원
                  </span>
                  <em>
                    할인금액
                  </em>
                </CalcItem>
                <CalcItem>
                  <span>
                    {totalPrice.toLocaleString()}원
                  </span>
                  <em>
                    총 주문금액
                  </em>
                </CalcItem>
              </CalcWrap>
              <SubmitWrap>
                <Link href={{
                  pathname: '/order',
                  query: { ids: ((JSON.stringify(checkedList))) },
                  
                }}
                >
                  주문하기
                </Link>
              </SubmitWrap>
            </SubOrder>
          </OrderWrap>
        </Main>
      </Cart>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async(context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';

  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  return {
    props: {}
  };
};

export default CartComponent;
