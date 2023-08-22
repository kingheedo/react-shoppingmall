import React, { FC, PropsWithChildren, ReactNode, useCallback } from 'react';
import Link from 'next/link';
import { Badge, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import styled, { createGlobalStyle } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import { CartState } from '../reducers/reducerTypes/cartTypes';
import { UserState } from '../reducers/reducerTypes/userTypes';
import SearchInput from './SearchInput';
import { logOut } from '../reducers/asyncRequest/user';
import { RootState } from '../store/configureStore';
import { useAppDispatch } from '../hooks/useRedux';
import { getUser } from '../context/LoginProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apis from '../apis';

const Global = createGlobalStyle`
  
    
 `;

const Container = styled.div`
    margin: 0 auto;
    width: 92vw;
        height: 100%;
        background-color: white;
    `;
const Wrapper = styled.div`
        padding: 2px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
const Left = styled.div`
        flex:1;
    `;
const SearchContainer = styled.div`
        display: flex;
        align-items: center;
        padding: 5px;
    `;
const Right = styled.div`
        flex:1;
        display:flex;
        align-item: center;
        justify-content: flex-end;
    `;
const Center = styled.div`
        flex:1;
        text-align: center;
    `;
const Logo = styled.h1`
        font-weight : bold;
        line-height : 1.8;
    `;
const MenuItem = styled.div`
        font-size: 14px;
        margin-left: 25px;
    `;
const ShoppingCart = styled(ShoppingCartOutlined)`
        font-size: 28px;
    `;
const AppLayout = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const {mutate: logout} =  useMutation(() => apis.User.logout(),{
    onSuccess: (data) => {
      queryClient.invalidateQueries(['getUser'])
    }
  })
  
  const me = getUser();

  const onHandleLogout = useCallback(
    () => {
      logout();
      Router.push('/');
    },
    [],
  );

  return (
    <>
      <Container>
        <Global />
        <Wrapper>
          <Left>
            <SearchContainer>
              <SearchInput />
            </SearchContainer>
          </Left>
          <Center>
            <Logo>
              <Link href="/">
                STAR CLOTHES
              </Link>
            </Logo>
          </Center>
          <Right>
            {me?.info.id
              ? (
                <MenuItem>
                  <Button>
                    <Link href="/productForm">
                      상품등록
                    </Link>
                  </Button>
                </MenuItem>
              )
              : null}
            {me?.info.id
              ? null
              : (
                <MenuItem>
                  <Button>
                    <Link href="/signup">
                      회원가입
                    </Link>
                  </Button>
                </MenuItem>
              )}

            <MenuItem>
              {me?.info.id
                ? (
                  <Button onClick={onHandleLogout}>
                    로그아웃
                  </Button>
                )
                : (
                  <Button>
                    <Link href="/signin">
                      로그인
                    </Link>
                  </Button>
                )}
            </MenuItem>

            <MenuItem>
              <Button>
                <Link href="/mypage">
                  마이페이지
                </Link>
              </Button>
            </MenuItem>

            <MenuItem>
              <Link href="/cart">
                  <Badge count={me?.cartLength || 0}>
                    <ShoppingCart />
                  </Badge>
              </Link>
            </MenuItem>
          </Right>
        </Wrapper>
      </Container>
      {children}
    </>
  );
};

export default AppLayout;
