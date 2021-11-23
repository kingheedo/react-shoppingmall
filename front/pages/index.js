import React, {  useEffect, } from 'react';
import AppLayout from '../components/AppLayout';
import ImageSlider from '../components/ImageSlider/ImageSlider';
import MainProducts from '../components/MainProducts';
import { LOAD_PRODUCTS_REQUEST } from '../reducers/product';
import {useDispatch, useSelector} from 'react-redux';
import { Col, Row } from 'antd';

const Home = () => {
    const {mainProducts} = useSelector(state => state.product)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({
            type : LOAD_PRODUCTS_REQUEST
        })
    }, [])
    
    
    return (
        <>
        <AppLayout>
            <ImageSlider/>
            <div style={{margin: '2rem 16rem',width:'90rem', }}>
                <h2>Clothes</h2>
                <Row gutter = {[18,18]}>
                
                {mainProducts && mainProducts.map((product) => 
                <Col key={product.id} span={6}>
                    <MainProducts  product = {product}/>
                </Col>
            )}
                
            </Row>
            </div>
        
        </AppLayout>
        </>
    )
}

export default Home
