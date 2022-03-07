import React, { useCallback, useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';
import {
  Button, Image, Input, Modal, Result,
} from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { END } from 'redux-saga';
import AppLayout from '../../../components/AppLayout';
import Review from '../../../components/ReviewLists';
import useInput from '../../../hooks/useInput';
import wrapper from '../../../store/configureStore';
import { addProduct, loadCartProducts } from '../../../reducers/dispatchRequestTypes/cartDispatchRequest';
import { RootState } from '../../../reducers';
import { ProductState } from '../../../reducers/asyncActionTypes/productType';
import { loadUser } from '../../../reducers/dispatchRequestTypes/userDispatchRequest';
import { loadProduct } from '../../../reducers/dispatchRequestTypes/productDispatchRequest';
import { CartState } from '../../../reducers/asyncActionTypes/cartTypes';
import { UserState } from '../../../reducers/asyncActionTypes/userTypes';

const Container = styled.div`
    width: 80vw;
    height: 100%;
    margin: 6rem auto 0;
        
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
    .image: {
      width: 400px;
      height: 400px;
    }
@media only screen and (max-width: 690px) {
        flex-direction: column;
        align-items: center;
        margin-bottom: 2rem;
        }
    
`;
const ProductImage = styled(Image)`
      width: 400px;
      height: 400px;
      @media only screen and (max-width: 1075px) {
        width: 300px;
        height: 300px;
        }
`;
const H2 = styled.h2`
      margin: 2rem
`;
const Span = styled.span`
      margin: 2rem
`;
const Select = styled.select`
      margin: 1rem 0;
      width: 320px;
      text-align: center;
`;
const QuantityBtnGroup = styled.div`
      display: flex;
      width: 320px;
`;
const Quantity = styled(Input)`
      text-align: center;
`;
const BuyBtnGroup = styled.div`
       display: flex;
       margin-top: 1rem;
`;
const SelectDiv = styled.div`
       margin-top: 5rem;
       @media only screen and (max-width: 690px) {
        margin-top: 1rem;
        }
`;

const Product = () => {
  const dispatch = useDispatch();
  const { me } = useSelector<RootState, UserState>((state) => state.user);
  const { singleProduct } = useSelector<RootState, ProductState>((state) => state.product);
  const { addProductCartDone, addProductCartError } = useSelector<RootState, CartState>((state) => state.cart);
  const router = useRouter();
  const { id } = router.query;
  const productId = parseInt(router.query.id as string, 10);
  const [size, onSelectSize] = useInput('사이즈');
  const [quantity, setQuantity] = useState(1);
  const [visibleModal, setVisibleModal] = useState(false);
  const [buyNow, setBuyNow] = useState(true);
  useEffect(() => {
    // console.log('buyNow', buyNow);
    if (buyNow && addProductCartDone) {
      Router.push('/orderForm');
    }
  }, [buyNow, addProductCartDone]);

  useEffect(() => {
    if (!me && addProductCartError) {
      alert(addProductCartError);
      Router.push('/signin');
    }
  }, [me, addProductCartError]);
  const onClickCart = useCallback(
    (price: number) => () => {
      const totalPrice = price * quantity;
      setBuyNow(false);
      if (size === '사이즈') {
        alert('사이즈를 선택해주세요.');
        return;
      }
      dispatch(addProduct({
        productId, size, quantity, totalPrice,
      }));
      setVisibleModal(true);
    },
    [buyNow, id, quantity, size],
  );
  const onClickBuy = useCallback(
    (price: number) => () => {
      const totalPrice = price * quantity;
      setBuyNow(true);
      if (size === '사이즈') {
        alert('사이즈를 선택해주세요.');
        return;
      }
      dispatch(addProduct({
        buyNow, productId, size, quantity, totalPrice,
      }));
    },
    [productId, quantity, size],
  );
  const onhandleModal = useCallback(
    () => {
      setTimeout(() => {
        Router.push('/cart');
      }, 1000);
      setVisibleModal(false);
    },
    [],
  );

  const ondecline = useCallback(
    () => {
      if (quantity === 1) {
        alert('주문가능한 최소 수량입니다.');
        return;
      }
      setQuantity(quantity - 1);
    },
    [quantity],
  );
  const onincrease = useCallback(
    () => {
      if (quantity === (singleProduct && singleProduct.stock)) {
        alert('주문가능한 최대 수량입니다.');
        return;
      }
      setQuantity(quantity + 1);
    },
    [quantity],
  );

  const noneVisbleModal = useCallback(
    () => {
      setVisibleModal(false);
    }, [],
  );
  return (
    <AppLayout>
      <Container>
        <Wrapper>
          {singleProduct
                && (
                <>
                  <Content>
                    <ProductImage className="image" alt="singleProduct.Images[0]" src={`http://localhost:3065/${singleProduct.Images[0].src}`} />
                    <ProductInfo>
                      <H2>{singleProduct.productName}</H2>
                      {/* <ul>
                        {singleProduct && singleProduct.Colors.map(Color =>
                            <li>
                                <Link href="/product/[id]/[color]" as={`/product/${id}/${Color}`}>
                                    <a>{Color}</a>
                                </Link>
                            </li>
                        )}
                    </ul> */}
                      <Span>{`${singleProduct.price} 원`}</Span>
                      <SelectDiv>
                        <Select
                          value={size}
                          onChange={onSelectSize}
                        >
                          <option value="사이즈">사이즈</option>
                          {singleProduct && singleProduct.Sizes.map((productSize) => <option value={productSize.option}>{productSize.option}</option>)}
                        </Select>

                        <QuantityBtnGroup>
                          <Button onClick={ondecline}>
                            <MinusOutlined />
                          </Button>
                          <Quantity value={quantity} placeholder="Basic usage" />
                          <Button onClick={onincrease}>
                            <PlusOutlined />
                          </Button>
                        </QuantityBtnGroup>

                        <BuyBtnGroup>
                          <Btn className="BtnCart" onClick={onClickCart(singleProduct.price)}>장바구니</Btn>
                          <Btn className="BtnBuyNow" onClick={onClickBuy(singleProduct.price)}>바로구매</Btn>
                        </BuyBtnGroup>
                      </SelectDiv>
                    </ProductInfo>
                    <Modal
                      centered
                      visible={visibleModal}
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
                    </Modal>
                  </Content>
                  <Review product={singleProduct} />
                </>
                )}
        </Wrapper>
      </Container>
    </AppLayout>

  );
};
export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
  console.log('axios', axios);

  const id = context.params?.id!;
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  store.dispatch(loadUser());
  store.dispatch(loadCartProducts());
  store.dispatch(
    loadProduct(id),
  );
  store.dispatch(END);
  await store.sagaTask?.toPromise();
  return {
    props: {},
  };
});
export default Product;
