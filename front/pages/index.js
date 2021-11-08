import React from 'react';
import AppLayout from '../components/AppLayout';
import ImageSlider from '../components/ImageSlider/ImageSlider';



const Home = () => {
    return (
        <>
        <AppLayout>
            <ImageSlider/>
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
