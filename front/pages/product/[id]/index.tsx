import React, { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import {
  Button, Image, Input, Modal, Result,
} from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import AppLayout from '../../../components/AppLayout';
import useInput from '../../../hooks/useInput';
import { ProductState } from '../../../reducers/reducerTypes/productType';
import { CartState } from '../../../reducers/reducerTypes/cartTypes';
import { UserState } from '../../../reducers/reducerTypes/userTypes';
import { addProductToCart, loadProductsInCart } from '../../../reducers/asyncRequest/cart';
import { loadUser } from '../../../reducers/asyncRequest/user';
import { loadSingleProduct } from '../../../reducers/asyncRequest/product';
import wrapper, { RootState } from '../../../store/configureStore';
import { useAppDispatch } from '../../../hooks/useRedux';
import { QueryClient, dehydrate, useMutation, useQuery } from '@tanstack/react-query';
import request from '../../../apis/request';
import apis from '../../../apis';
import { GetSingleProductRes, SizeOption } from '../../../apis/product/schema';
import { backUrl } from '../../../config/backUrl';
import Link from 'next/link';
import { useModal } from '../../../context/ModalProvider';

const Container = styled.div`
    width: 1280px;
    height: 100%;
    margin: 6rem auto 0;
    padding: 0 20px;
        
`;
const ProductInfo = styled.div`
   display: flex;
   flex-direction : column;
   padding-left: 30px;
`;
const Btn = styled(Button)`
    width: 160px
`;
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;
const Content = styled.div`
    display: flex;
    justify-content: space-between;
    
`;
const ProductImage = styled.img`
    min-width: 541px;
`;

const InfoArea = styled.div`
    min-width: 483px;
`;

const BrandName = styled.div`
    text-decoration: underline;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: var(--fontJ);
    line-height: var(--fontJL);
    font-weight: 700;
    text-decoration: underline;
    margin-bottom: 8px;
`
const Tags = styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 53px;
    height: 20px;
    margin-bottom: 12px;
    font-size: var(--fontA);
    white-space: nowrap;
    margin-right: 4px;
    padding: 0 5px;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    background: #fff;
`
const ProductName = styled.div`
    max-height: 46px;
    margin-bottom: 16px;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: var(--fontE);
    line-height: var(--fontEL);
    color: #111111;
`

const PriceInfo = styled.em`
    display: inline-block;
    margin-right: 2px;
    font-size: var(--fontJ);
    font-weight: 700;
}
`
const ReviewWrap  = styled.div`
      display: flex;
      align-items: center;
      margin-top: 24px;
      margin-bottom: 11px;
      padding: 12px 0;
      font-size: var(--fontC);
      line-height: var(--fontCL);
      color: var(--gray600);
`
const ScoreWrap = styled.div`
  display: flex;
  align-items: center;
  color: var(--gray900);
  font-weight: 700;
`
const Rate = styled.i`
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 2px;
    background: url(/star-fill.svg) center/16px auto no-repeat;
`
const Score = styled.em`
`
const Review = styled(Link)`
  margin: 0 15px 0 6px;
  text-decoration: underline;
  color: #767676;
`
const OptionWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px 0;
    margin-top: 20px;
    padding: 20px 0 40px;
    border-top: 1px solid #e5e5e5;
` 
const Row = styled.div`
    display: flex;
    align-items: center;
`
const Type = styled.span`
    width: 90px;
    align-self: flex-start;
    flex-basis: 90px;
    margin-top: 10px;
    font-size: var(--fontD);
    line-height: var(--fontDL);
    font-weight: 700;
`

const SelectWrap = styled.ul`
    width: calc(100% - 90px);
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
`

const SelectItm = styled.li`
    min-width: 72px;
    height: 36px;
    padding: 0 15px;
    border-radius: 6px;
    border: 0;
    overflow: hidden;
    cursor: pointer;
    box-sizing: border-box;
    line-height: 36px;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    text-align: center;

    &.active{
      margin-top: -1px;
      border: 2px solid var(--gray900);
    }
`
const BuyWrap = styled.div`
    padding: 20px 0 40px;
    border-top: 2px solid var(--gray900);
`

const BuyTxt = styled.p `
    max-width: 470px;
    margin-bottom: 20px;
    font-size: var(--fontD);
    line-height: var(--fontDL);
`
const PriceArea = styled.div`
    display: flex;
    justify-content: space-between;
`

const Quantity = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 111px;
    font-weight: 400;
    padding: 0;
    height: 36px;
    border-radius: 6px;
    box-sizing: border-box;
    color: var(--gray900)!important;
    text-align: center;
    text-indent: 0;
    border: 1px solid #e5e5e5!important;

    &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 37px;
    width: 1px;
    height: 100%;
    background-color: var(--gray250);
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 37px;
      width: 1px;
      height: 100%;
      background-color: var(--gray250);
    }
`
const MinusBtn = styled.button`
    position: absolute;
    width: 36px;
    height: 36px;
    top: 0;
    left: 1px;
    font-size: 0;
    border-radius: 6px 0 0 6px;
    background-color: var(--gray900);
    cursor: pointer;
    mask: url(/minus.svg) center/16px auto no-repeat;

    &.disabled{
      background-color: var(--gray250);
    }
`
const PlusBtn = styled.button`
    position: absolute;
    width: 36px;
    height: 36px;
    top: 0;
    right: 1px;
    font-size: 0;
    border-radius: 0 6px 6px 0;
    background-color: var(--gray900);
    cursor: pointer;
    mask: url(/plus.svg) center/16px auto no-repeat;
`

const PriceWrap = styled.div`
    display: flex;
    align-items: center;
    font-size: var(--fontE);
    line-height: var(--fontEL);
    font-weight: 700;
`
const Price = styled.span`
    font-size: var(--fontG);
    line-height: var(--fontGL);
`
const PriceUnit = styled.em``

const DecisionWrap = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px 0;
    margin-top: 0;
`

const BasketBtn = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 60px;
    border-radius: 6px 0 0 6px;
    background: var(--gray900);
    color: #fff;
    font-size: 17px;
    padding: 0 15px;
    line-height: 48px;
    min-width: 243px;
    margin: 0;
    border: 1px solid #111;
    cursor: pointer;
`
const BuyBtn = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 60px;
    border-radius: 0 6px 6px 0;
    background: var(--purpule500);
    color: #fff;
    font-size: 17px;
    padding: 0 15px;
    line-height: 48px;
    min-width: 243px;
    margin: 0;
    border: 1px solid var(--purpule500);
    cursor: pointer;
`

type BuyInfo = {
    productId: number,
    size : SizeOption | '',
    totalPrice: number,
    quantity: number
  }

const QueryProduct = () => {
  const dispatch = useAppDispatch();
  const { me } = useSelector<RootState, UserState>((state) => state.user);
  const { singleProduct } = useSelector<RootState, ProductState>((state) => state.product);
  const { addProductToCartDone, addProductToCartError } = useSelector<RootState, CartState>((state) => state.cart);
  const router = useRouter();
  const id = router.query.id!;
  const modal = useModal();
  const {data} = useQuery(['getSingleProduct',id], () => apis.Product.getSingleProduct(id), {
    enabled: !!id
  })

  const {mutate} = useMutation(apis.Cart.addItmtoCart)
  

  const productId = parseInt(router.query.id as string, 10);
  const [size, onSelectSize] = useInput('사이즈');
  const [quantity, setQuantity] = useState(1);
  const [visibleModal, setVisibleModal] = useState(false);
  const [buyNow, setBuyNow] = useState(true);

  const [buyInfo, setBuyInfo] = useState<BuyInfo>({
    productId: data?.id || -1,
    size : '',
    totalPrice: data?.price || 0,
    quantity: 1
  })
  

  // useEffect(() => {
  //   if (buyNow && addProductToCartDone) {
  //     Router.push('/orderForm');
  //   }
  // }, [buyNow, addProductToCartDone]);

  // useEffect(() => {
  //   if (!me && addProductToCartError) {
  //     alert(addProductToCartError);
  //     Router.push('/signin');
  //   }
  // }, [me, addProductToCartError]);
  // const onClickCart = useCallback(
  //   (price: number) => () => {
  //     if (!me) {
  //       alert('로그인이 필요합니다.');
  //       return Router.push('/signin');
  //     }
  //     const totalPrice = price * quantity;
  //     setBuyNow(false);
  //     if (size === '사이즈') {
  //       alert('사이즈를 선택해주세요.');
  //       return;
  //     }
  //     dispatch(addProductToCart({
  //       productId, size, quantity, totalPrice,
  //     }));
  //     setVisibleModal(true);
  //   },
  //   [me, buyNow, id, quantity, size],
  // );
  // const onClickBuy = useCallback(
  //   (price: number) => () => {
  //     const totalPrice = price * quantity;
  //     setBuyNow(true);
  //     if (size === '사이즈') {
  //       alert('사이즈를 선택해주세요.');
  //       return;
  //     }
  //     dispatch(addProductToCart({
  //       buyNow, productId, size, quantity, totalPrice,
  //     }));
  //   },
  //   [productId, quantity, size],
  // );
  // const onhandleModal = useCallback(
  //   () => {
  //     setTimeout(() => {
  //       Router.push('/cart');
  //     }, 1000);
  //     setVisibleModal(false);
  //   },
  //   [],
  // );

  // const ondecline = useCallback(
  //   () => {
  //     if (quantity === 1) {
  //       alert('주문가능한 최소 수량입니다.');
  //       return;
  //     }
  //     setQuantity(quantity - 1);
  //   },
  //   [quantity],
  // );
  // const onincrease = useCallback(
  //   () => {
  //     if (quantity === (singleProduct && singleProduct.stock)) {
  //       alert('주문가능한 최대 수량입니다.');
  //       return;
  //     }
  //     setQuantity(quantity + 1);
  //   },
  //   [quantity],
  // );

  // const noneVisbleModal = useCallback(
  //   () => {
  //     setVisibleModal(false);
  //   }, [],
  // );

  /** 사이즈 옵션 선택 시 */
  const onClickSize = (option: SizeOption) => {
    setBuyInfo((prev: BuyInfo) => ({...prev, size: option}))
  }

  /** 수량 조절 */
  const onClickQuant = (quantity: 'inc' | 'dec') => {
    if(!data){
      return;
    }

    if(quantity === 'inc'){
      setBuyInfo(prev => ({...prev, totalPrice: prev.totalPrice + data.price,  quantity: prev.quantity + 1}))
    }else{
      if(buyInfo.quantity !== 1){
        setBuyInfo(prev => ({...prev, totalPrice: prev.totalPrice - data.price, quantity: prev.quantity - 1}))
      }
    }
  }

  const onClickAddCart = () => {
      modal?.confirm.callBack(() => console.log('hi')
      );

    if(!buyInfo.size){
      modal?.confirm.handleConfirm(true)
    }

    if(!data){
      return 
    }

    if(buyInfo.productId && buyInfo.size && buyInfo.totalPrice && buyInfo.quantity){
      mutate({
        productId: buyInfo.productId,
        size: buyInfo.size,
        totalPrice: buyInfo.totalPrice,
        quantity: buyInfo.quantity
      })
    }
  }

  useEffect(() => {
    console.log('buyinfo', buyInfo);
  }, [buyInfo])

  return (
      <Container>
        <Wrapper>
          {data
            && (
              <>
                <Content>
                  <ProductImage
                   className="image" 
                   alt="data.Images[0]"
                    src={`${backUrl}/${data.Images[0].src}`} 
                    />

                    <InfoArea className='info-area'>
                      <Tags>무료배송</Tags>
                      <BrandName className="brand-name">
                        <Link href="/">
                          8 seconds
                        </Link>
                      </BrandName>
                      <ProductName>
                        {data.productName}
                      </ProductName>
                      <PriceInfo>
                        {data.price.toLocaleString('ko-KR')}
                      </PriceInfo>
                      <ReviewWrap>
                        <ScoreWrap>
                          <Rate/>
                          <Score>
                            4.5
                          </Score>
                        </ScoreWrap>
                        <Review
                          href="/"
                        >
                          리뷰10건
                        </Review>
                      </ReviewWrap>
                      <OptionWrap>
                        <Row>
                          <Type>
                            사이즈
                          </Type>
                          <SelectWrap>
                            {data.Sizes.map((size) => (
                              <SelectItm 
                              className={buyInfo.size === size.option ? 'active' : ''}
                               onClick={() => onClickSize(size.option)}
                                key={size.option}>
                                {size.option}
                              </SelectItm>
                            ))}
                          </SelectWrap>
                        </Row>
                        <Row>
                          <Type>
                            배송방법
                          </Type>
                          <SelectWrap>
                            <SelectItm>
                              택배
                            </SelectItm>
                          </SelectWrap>
                        </Row>
                      </OptionWrap>
                      <BuyWrap>
                        <BuyTxt>
                          {buyInfo.size}
                        </BuyTxt>
                        <PriceArea>
                          <Quantity>
                            <MinusBtn 
                              className={buyInfo.quantity === 1 ? 'disabled' : ''}
                              onClick={() => onClickQuant('dec')}/>
                              {buyInfo.quantity}
                            <PlusBtn onClick={() => onClickQuant('inc')}/>
                          </Quantity>
                          <PriceWrap>
                            <Price>
                              {(buyInfo.totalPrice || data.price).toLocaleString('ko')}
                            </Price>
                            <PriceUnit>
                                원
                              </PriceUnit>
                          </PriceWrap>
                        </PriceArea>
                      </BuyWrap>
                      <DecisionWrap>
                        <BasketBtn onClick={onClickAddCart}>
                          장바구니
                        </BasketBtn>
                        <BuyBtn>
                          바로구매
                        </BuyBtn>
                      </DecisionWrap>
                    </InfoArea>

                  {/* <Modal
                    centered
                    open={visibleModal}
                    footer={null}
                    onCancel={noneVisbleModal}
                  >
                    <Result
                      status="success"
                      title={`장바구니에 상품이 담겼습니다.
                            장바구니로 이동하시겠습니까?`}
                      extra={[
                        <Button onClick={onhandleModal} key="move">확인</Button>,
                        <Button onClick={noneVisbleModal} key="cancel">취소</Button>,
                      ]}
                    />
                  </Modal> */}
                </Content>
                {/* <Review product={data} /> */}
              </>
            )}
        </Wrapper>
      </Container>

  );
};

export const getServerSideProps:GetServerSideProps = async (context) => {
  const id = context.params?.id!;
  
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['getSingleProduct', id], () => apis.Product.getSingleProduct(id));

  return {
    props: {
      dehydratedState : dehydrate(queryClient),      
    }
  }
};
export default QueryProduct;
