import React, { PropsWithChildren } from 'react';
import AuthProvider from '../context/AuthProvider';
import ModalProvider from '../context/ModalProvider';
import StyledComponentsRegistry from '../lib/styled-components';
import ReactQueryProvider from '../context/ReactQueryProvider';
import { Metadata } from 'next';
import RecoilRootWrapper from '../context/RecoilProvider';
import '../styles/global.css';
import Header from './_component/Header';
import { headers } from 'next/headers';
import getQueryClient from '../utils/getQueryClient';
import apis from '../apis';
import { Hydrate, dehydrate } from '@tanstack/react-query';

export const metaData: Metadata = {
  title: 'next',
  description: 'created by next app'
};

const Layout = async({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient();
  const header = headers();
  const cookie = header.get('Cookie');
  console.log('cookie',cookie);
  
  await queryClient.prefetchQuery(['getUser'], () => apis.User.getUser({
    headers: cookie ? { cookie } : undefined
  }));

  const dehydratedState = dehydrate(queryClient);
  queryClient.clear();

  return (
    <html lang="kr">
      <body suppressHydrationWarning={true}>
        <StyledComponentsRegistry>
          <ReactQueryProvider>
            <RecoilRootWrapper>
              <Hydrate state={dehydratedState}>
                <ModalProvider>
                  <AuthProvider>
                    <Header/>
                    {children}
                  </AuthProvider>
                </ModalProvider>
              </Hydrate>
            </RecoilRootWrapper>
          </ReactQueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};

export default Layout;
