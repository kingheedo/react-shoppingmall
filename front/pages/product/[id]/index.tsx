import React, { useCallback, useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';
import {
  Button, Image, Input, Modal, Result,
} from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import AppLayout from '../../../components/AppLayout';
import Review from '../../../components/ReviewLists';
import useInput from '../../../hooks/useInput';
import { ProductState } from '../../../reducers/reducerTypes/productType';
import { CartState } from '../../../reducers/reducerTypes/cartTypes';
import { UserState } from '../../../reducers/reducerTypes/userTypes';
import { addProductToCart, loadProductsInCart } from '../../../reducers/asyncRequest/cart';
import { loadUser } from '../../../reducers/asyncRequest/user';
import { loadSingleProduct } from '../../../reducers/asyncRequest/product';
import wrapper, { RootState } from '../../../store/configureStore';

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
    
@media only screen and (max-width: 690px) {
        flex-direction: column;
        align-items: center;
        margin-bottom: 2rem;
        }
    
`;
const ProductImage = styled(Image)`
    width: 100%;
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

const QueryProduct = () => {
  const dispatch = useDispatch();
  const { me } = useSelector<RootState, UserState>((state) => state.user);
  const { singleProduct } = useSelector<RootState, ProductState>((state) => state.product);
  const { addProductToCartDone, addProductToCartError } = useSelector<RootState, CartState>((state) => state.cart);
  const router = useRouter();
  const { id } = router.query;
  const productId = parseInt(router.query.id as string, 10);
  const [size, onSelectSize] = useInput('?????????');
  const [quantity, setQuantity] = useState(1);
  const [visibleModal, setVisibleModal] = useState(false);
  const [buyNow, setBuyNow] = useState(true);
  useEffect(() => {
    if (buyNow && addProductToCartDone) {
      Router.push('/orderForm');
    }
  }, [buyNow, addProductToCartDone]);

  useEffect(() => {
    if (!me && addProductToCartError) {
      alert(addProductToCartError);
      Router.push('/signin');
    }
  }, [me, addProductToCartError]);
  const onClickCart = useCallback(
    (price: number) => () => {
      if (!me) {
        alert('???????????? ???????????????.');
        return Router.push('/signin');
      }
      const totalPrice = price * quantity;
      setBuyNow(false);
      if (size === '?????????') {
        alert('???????????? ??????????????????.');
        return;
      }
      dispatch(addProductToCart({
        productId, size, quantity, totalPrice,
      }));
      setVisibleModal(true);
    },
    [me, buyNow, id, quantity, size],
  );
  const onClickBuy = useCallback(
    (price: number) => () => {
      const totalPrice = price * quantity;
      setBuyNow(true);
      if (size === '?????????') {
        alert('???????????? ??????????????????.');
        return;
      }
      dispatch(addProductToCart({
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
        alert('??????????????? ?????? ???????????????.');
        return;
      }
      setQuantity(quantity - 1);
    },
    [quantity],
  );
  const onincrease = useCallback(
    () => {
      if (quantity === (singleProduct && singleProduct.stock)) {
        alert('??????????????? ?????? ???????????????.');
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
                  <ProductImage className="image" alt="singleProduct.Images[0]" src={`${singleProduct.Images[0].src}`} />
                  <ProductInfo>
                    <H2>{singleProduct.productName}</H2>
                    <Span>{`${singleProduct.price.toLocaleString('ko-KR')} ???`}</Span>
                    <SelectDiv>
                      <Select
                        value={size}
                        onChange={onSelectSize}
                      >
                        <option value="?????????">?????????</option>
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
                        <Btn className="BtnCart" onClick={onClickCart(singleProduct.price)}>????????????</Btn>
                        <Btn className="BtnBuyNow" onClick={onClickBuy(singleProduct.price)}>????????????</Btn>
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
                      title={`??????????????? ????????? ???????????????.
                            ??????????????? ?????????????????????????`}
                      extra={[
                        <Button onClick={onhandleModal} key="move">??????</Button>,
                        <Button onClick={noneVisbleModal} key="cancel">??????</Button>,
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
  const id = context.params?.id!;
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  await store.dispatch(loadUser());
  await store.dispatch(loadProductsInCart());
  await store.dispatch(
    loadSingleProduct(id),
  );
  return {
    props: {},
  };
});
export default QueryProduct;
