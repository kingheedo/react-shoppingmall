import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'antd';
import { useInView } from 'react-intersection-observer';
import { END } from 'redux-saga';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import ImageSlider from '../components/ImageSlider/ImageSlider';
import MainProduct from '../components/MainProduct';
import wrapper from '../store/configureStore';
import { loadProducts } from '../reducers/dispatchRequestTypes/productDispatchRequest';
import { RootState } from '../reducers';
import { loadUser } from '../reducers/dispatchRequestTypes/userDispatchRequest';
import { ProductState } from '../reducers/asyncActionTypes/productType';
import { loadCartProducts } from '../reducers/dispatchRequestTypes/cartDispatchRequest';

const Home:FC = () => {
  const { mainProducts, loadProductsLoading, hasMoreProducts } = useSelector<RootState, ProductState>((state) => state.product);
  const dispatch = useDispatch();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView && hasMoreProducts && !loadProductsLoading) {
      const lastId = mainProducts[mainProducts.length - 1]?.id;
      dispatch(loadProducts(lastId));
    }
  },
  [inView, hasMoreProducts, loadProductsLoading, mainProducts]);

  return (
    <>
      <AppLayout>
        <ImageSlider />
        <div style={{ margin: '2rem 16rem' }}>
          <h2>Clothes</h2>
          <Row gutter={[18, 18]}>

            {mainProducts.map((product) => (
              <Col key={product.id} span={6}>
                <MainProduct product={product} />
              </Col>
            ))}
            <div ref={ref} />
          </Row>
        </div>

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
  store.dispatch(loadUser());
  store.dispatch(loadProducts());

  store.dispatch(loadCartProducts());
  store.dispatch(END);
  await store.sagaTask?.toPromise();
  return {
    props: {},
  };
});
export default Home;
