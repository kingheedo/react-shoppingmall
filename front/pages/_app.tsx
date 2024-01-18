import React from 'react';
import Head from 'next/head';
// import 'antd/dist/antd.css';
import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider,Hydrate } from '@tanstack/react-query';
import Layout from '../components/layout';
import '../styles/global.css';
import LoginProvider from '../context/LoginProvider';
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
  //특정 컴포넌트에만 레이아웃 적용
  if (['/signin','/signup'].includes(appProps.router.pathname)) {
    return (
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Head>
              <meta charSet="utf-8" />
              <title>shoppingmall</title>
            </Head>
            <Component {...pageProps} />
          </Hydrate>
        </QueryClientProvider>
      </RecoilRoot>
    );
  }

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Head>
            <meta charSet="utf-8" />
            <title>shoppingmall</title>
          </Head>
          <ModalProvider>
            <LoginProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </LoginProvider>
          </ModalProvider>
        </Hydrate>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default ShoppingMall;
