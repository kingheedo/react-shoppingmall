import React from 'react'
import Head from 'next/head'
import Proptypes from 'prop-types'
import 'antd/dist/antd.css'; 
import wrapper from '../store/configureStore';
const ShoppingMall = ({Component}) => {
    return (
        <>
            <Head>
                <meta charSet="utf-8"/>
                <title>ShoppingMall</title>
            </Head>
            <Component/>
        </>
    )
}
ShoppingMall.propTypes = {
    Component: Proptypes.elementType.isRequired,

}
export default wrapper.withRedux(ShoppingMall); 
