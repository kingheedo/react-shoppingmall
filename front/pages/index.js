import React, {  useEffect, } from 'react';
import AppLayout from '../components/AppLayout';
import ImageSlider from '../components/ImageSlider/ImageSlider';
import MainProduct from '../components/MainProduct';
import { LOAD_PRODUCTS_REQUEST } from '../reducers/product';
import {useDispatch, useSelector} from 'react-redux';
import { Col, Row } from 'antd';
import { useInView } from "react-intersection-observer"
import { LOAD_USER_REQUEST, RESET_ADD_PAYMENT } from '../reducers/user';
import { LOAD_CART_PRODUCTS_REQUEST } from '../reducers/cart';
import wrapper from '../store/configureStore';
import { END } from 'redux-saga';
import axios from 'axios';

const Home = () => {
    const {mainProducts,loadMainProductsLoading,hasMoreProducts} = useSelector(state => state.product)
    const {addPaymentDone} = useSelector(state => state.user)
    const dispatch = useDispatch();
    const [ref, inView] = useInView()


    useEffect(() => {
        if(inView && hasMoreProducts && !loadMainProductsLoading){
          const lastId = mainProducts[mainProducts.length - 1]?.id
          dispatch({
            type : LOAD_PRODUCTS_REQUEST,
            lastId
          })
        }
  },
  [inView,hasMoreProducts, loadMainProductsLoading, mainProducts],
);
    
    
    return (
        <>
        <AppLayout>
            <ImageSlider/>
            <div style={{margin: '2rem 16rem', }}>
                <h2>Clothes</h2>
                <Row gutter = {[18,18]}>
                
                {mainProducts && mainProducts.map((product,i) => 
                <Col key={i} span={6}>
                    <MainProduct product = {product}/>
                </Col>
            )}
              <div ref={ref}/>
            </Row>
            </div>
        
        </AppLayout>
        </>
    )
}
export const getServerSideProps = wrapper.getServerSideProps( (store) => async (context) => {
  
  console.log('context.req.headers',context.req.headers);
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if(context.req && cookie){
    axios.defaults.headers.Cookie = cookie;
  }
  store.dispatch({
    type: LOAD_USER_REQUEST,
  })
  store.dispatch({
    type: LOAD_PRODUCTS_REQUEST,
  })
  
  store.dispatch({
    type: LOAD_CART_PRODUCTS_REQUEST,
  })
  store.dispatch(END);
  await store.sagaTask.toPromise();
})
export default Home
