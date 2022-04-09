import React from 'react';
import Head from 'next/head';
import 'antd/dist/antd.css';
import { AppProps } from 'next/app';
import wrapper from '../store/configureStore';

const ShoppingMall = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <meta charSet="utf-8" />
      <link rel="icon" type="image/x-icon" href="../public/favicon.ico" />
      <title>ShoppingMall</title>
    </Head>
    <Component {...pageProps} />
  </>
);

export default wrapper.withRedux(ShoppingMall);
