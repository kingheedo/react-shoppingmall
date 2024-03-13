import React, { PropsWithChildren } from 'react';
import AuthProvider from '../context/AuthProvider';
import ModalProvider from '../context/ModalProvider';
import StyledComponentsRegistry from '../lib/styled-components';
import ReactQueryProvider from '../context/ReactQueryProvider';
import { Metadata } from 'next';
import RecoilRootWrapper from '../context/RecoilProvider';
import '../styles/global.css';
import Header from './_component/Header';

export const metaData: Metadata = {
  title: 'next',
  description: 'created by next app'
};

const Layout = async({ children }: PropsWithChildren) => {

  return (
    <html lang="kr">
      <body suppressHydrationWarning={true}>
        <StyledComponentsRegistry>
          <RecoilRootWrapper>
            <ReactQueryProvider>
              <ModalProvider>
                <AuthProvider>
                  <Header/>
                  {children}
                </AuthProvider>
              </ModalProvider>
            </ReactQueryProvider>
          </RecoilRootWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};

export default Layout;
