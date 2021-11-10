import React, {  useEffect, } from 'react';
import AppLayout from '../components/AppLayout';
import ImageSlider from '../components/ImageSlider/ImageSlider';
import MainProducts from '../components/MainProducts';
import { LOAD_PRODUCTS_REQUEST } from '../reducers/product';
import {useDispatch, useSelector} from 'react-redux';

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
            
            {mainProducts && mainProducts.map((product) => 
            <MainProducts key={product.id} product = {product}/>
             
           
           )}
            
                {/* <Row>
                    <Col span={24}>col</Col>
                <Row>
                    <Col span={8}>col-8</Col>
                    <Col span={8}>col-8</Col>
                    <Col span={8}>col-8</Col>
                </Row>

                <Row>
                    <Col span={12}>col-12</Col>
                    <Col span={12}>col-12</Col>
                </Row>
            </Row> */}
        </AppLayout>
        </>
    )
}

export default Home
