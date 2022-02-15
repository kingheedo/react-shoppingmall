import React, { useCallback, useState } from 'react';
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

const Wrapper = styled.div`
    display:flex;
    padding: 60px 200px;
`;
const ProductInfo = styled.div`
   display: flex;
   flex-direction : column;
   padding-left: 30px;
`;
const BtnCart = styled(Button)`
    width: 160px
`;
const BtnBuy = styled(Button)`
    width: 160px
`;
const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;
const Product = () => {
  const dispatch = useDispatch();
  const { singleProduct } = useSelector<RootState, ProductState>((state) => state.product);
  const router = useRouter();
  const { id } = router.query;
  const productId = parseInt(router.query.id as string, 10);
  const [size, onSelectSize] = useInput('사이즈');
  const [quantity, setQuantity] = useState(1);
  const [visibleModal, setVisibleModal] = useState(false);

  const onhandleModal = useCallback(
    () => {
      setVisibleModal(false);
      Router.push('/cart');
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
  const onClickCart = useCallback(
    (price:number) => () => {
      const totalPrice = price * quantity;
      console.log('size', size);
      if (size === '사이즈') {
        alert('사이즈를 선택해주세요.');
        return;
      }

      if (id) {
        dispatch(addProduct({
          productId, size, quantity, totalPrice,
        }));
      }
      setVisibleModal(true);
    },
    [id, quantity, size],
  );
  const onClickBuy = useCallback(
    (price:number) => () => {
      const totalPrice = price * quantity;
      console.log('size', size);
      if (size === '사이즈') {
        alert('사이즈를 선택해주세요.');
        return;
      }

      if (id) {
        dispatch(addProduct({
          productId, size, quantity, totalPrice,
        }));
      }
      setVisibleModal(true);
    },
    [id, quantity, size],
  );
  const noneVisbleModal = useCallback(
    () => {
      setVisibleModal(false);
    }, [],
  );
  return (
    <AppLayout>
      <Wrapper>
        <ContentWrapper>
          {singleProduct
                            && (
                            <>
                              <div style={{ display: 'flex' }}>
                                <Image alt="singleProduct.Images[0]" style={{ width: '400px', height: '400px' }} src={`http://localhost:3065/${singleProduct.Images[0].src}`} />
                                <ProductInfo>
                                  <h2 style={{ margin: '2rem' }}>{singleProduct.productName}</h2>
                                  {/* <ul>
                                    {singleProduct && singleProduct.Colors.map(Color =>
                                        <li>
                                            <Link href="/product/[id]/[color]" as={`/product/${id}/${Color}`}>
                                                <a>{Color}</a>
                                            </Link>
                                        </li>
                                    )}
                                </ul> */}
                                  <span style={{ margin: '2rem 0' }}>{`${singleProduct.price} 원`}</span>
                                  <em style={{ margin: '2rem 0' }}>{singleProduct.id}</em>
                                  <select
                                    style={{ margin: '1rem 0', width: 320, textAlign: 'center' }}
                                    value={size}
                                    onChange={onSelectSize}
                                  >
                                    <option value="사이즈">사이즈</option>
                                    {singleProduct && singleProduct.Sizes.map((productSize) => <option value={productSize.option}>{productSize.option}</option>)}
                                  </select>

                                  <div style={{ display: 'flex', width: '20rem' }}>
                                    <Button onClick={ondecline}>
                                      <MinusOutlined />
                                    </Button>
                                    <Input style={{ textAlign: 'center' }} value={quantity} placeholder="Basic usage" />
                                    <Button onClick={onincrease}>
                                      <PlusOutlined />
                                    </Button>
                                  </div>

                                  <div style={{ display: 'flex', marginTop: '1rem' }}>
                                    <BtnCart onClick={onClickCart(singleProduct.price)}>장바구니</BtnCart>
                                    <BtnBuy onClick={onClickBuy(singleProduct.price)}>바로구매</BtnBuy>
                                  </div>
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
                              </div>

                              <Review product={singleProduct} />
                            </>
                            )}

        </ContentWrapper>
      </Wrapper>
    </AppLayout>

  );
};
export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
  const { id }:any = context.params;
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
