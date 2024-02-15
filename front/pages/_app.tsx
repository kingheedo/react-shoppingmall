import React from 'react';
import Head from 'next/head';
// import 'antd/dist/antd.css';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider,Hydrate } from '@tanstack/react-query';
import Layout from '../components/layout';
import '../styles/global.css';
import AuthProvider from '../context/AuthProvider';
import ModalProvider from '../context/ModalProvider';
import { RecoilRoot } from 'recoil';

const ShoppingMall = ({ Component, pageProps, ...appProps }: AppProps) => {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    }
  }));
  
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Head>
            <meta charSet="utf-8" />
            <title>shoppingmall</title>
          </Head>
          <ModalProvider>
            <AuthProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </AuthProvider>
          </ModalProvider>
        </Hydrate>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default ShoppingMall;
