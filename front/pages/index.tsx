import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'antd';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';
import AppLayout from '../components/AppLayout';
import ImageSlider from '../components/ImageSlider/ImageSlider';
import Product from '../components/Product';
import { loadProductsInCart } from '../reducers/asyncRequest/cart';
import { loadProducts } from '../reducers/asyncRequest/product';
import { loadUser } from '../reducers/asyncRequest/user';
import { ProductState } from '../reducers/reducerTypes/productType';
import wrapper, { RootState } from '../store/configureStore';

const Global = createGlobalStyle`
.ant-col-6 {
  max-width: 100%;
}
`;
const Container = styled.div`
    width: 80vw;
    height: 100%;
    margin: 6rem auto 0;
`;
const Wrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`;
const H2 = styled.h2`
margin-bottom: 2rem;
`;
const Home: FC = () => {
  const { mainProducts, loadProductsLoading, hasMoreProducts } = useSelector<RootState, ProductState>((state) => state.product);
  const dispatch = useDispatch();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView && hasMoreProducts && !loadProductsLoading) {
      const lastId: number = mainProducts[mainProducts.length - 1]?.id;
      dispatch(loadProducts(lastId));
    }
  },
    [inView, hasMoreProducts, loadProductsLoading, mainProducts]);

  return (
    <>
      <Global />
      <AppLayout>
        <ImageSlider />
        <Container>
          <Wrapper>
            <H2>Clothes</H2>
            <Row gutter={[16, 16]}>

              {mainProducts.map((product) => (
                <Col key={product.id} span={6}>
                  <Product product={product} />
                </Col>
              ))}
              <div ref={ref} />
            </Row>
          </Wrapper>
        </Container>

      </AppLayout>
    </>
  );
};
export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
  console.log('context.req.headers', context.req.headers);
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  await store.dispatch(loadUser());
  await store.dispatch(loadProducts());
  await store.dispatch(loadProductsInCart());
  return {
    props: {},
  };
});
export default Home;
