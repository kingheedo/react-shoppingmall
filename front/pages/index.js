import React, {  useEffect, } from 'react';
import AppLayout from '../components/AppLayout';
import ImageSlider from '../components/ImageSlider/ImageSlider';
import MainProduct from '../components/MainProduct';
import { LOAD_PRODUCTS_REQUEST } from '../reducers/product';
import {useDispatch, useSelector} from 'react-redux';
import { Col, Row } from 'antd';

const Home = () => {
    const {mainProducts,loadMainProductsLoading,hasMoreProducts} = useSelector(state => state.product)
    const dispatch = useDispatch();

    useEffect(
  () => {
    function onScroll() {
      if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight -300){
        if(hasMoreProducts && !loadMainProductsLoading){
          const lastId = mainProducts[mainProducts.length - 1]?.id
          dispatch({
            type : LOAD_PRODUCTS_REQUEST,
            lastId
          })
        }
      }
    }
    window.addEventListener('scroll',onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  },
  [hasMoreProducts, loadMainProductsLoading, mainProducts],
);
    
    
    return (
        <>
        <AppLayout>
            <ImageSlider/>
            <div style={{margin: '2rem 16rem',width:'90rem', }}>
                <h2>Clothes</h2>
                <Row gutter = {[18,18]}>
                
                {mainProducts && mainProducts.map((product) => 
                <Col key={product.id} span={6}>
                    <MainProduct product = {product}/>
                </Col>
            )}
                
            </Row>
            </div>
        
        </AppLayout>
        </>
    )
}

export default Home
