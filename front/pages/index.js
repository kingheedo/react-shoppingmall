import React, {  useEffect, } from 'react';
import AppLayout from '../components/AppLayout';
import ImageSlider from '../components/ImageSlider/ImageSlider';
import MainProduct from '../components/MainProduct';
import { LOAD_PRODUCTS_REQUEST } from '../reducers/product';
import {useDispatch, useSelector} from 'react-redux';
import { Col, Row } from 'antd';
import { useInView } from "react-intersection-observer"
import { LOAD_USER_REQUEST } from '../reducers/user';

const Home = () => {
    const {mainProducts,loadMainProductsLoading,hasMoreProducts} = useSelector(state => state.product)
    const dispatch = useDispatch();
    const [ref, inView] = useInView()

    useEffect(() => {
      dispatch({
        type: LOAD_USER_REQUEST,
      })
    }, [])
    useEffect(
  () => {
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
            <div style={{margin: '2rem 16rem',width:'90rem', }}>
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

export default Home
