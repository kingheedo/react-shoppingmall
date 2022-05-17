import React, { FC, ReactNode, useCallback } from 'react';
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

const Global = createGlobalStyle`
    a{
        color: #111111;
    } 
    a:hover{
        color: #111111;
    }
    
 `;

const Container = styled.div`
    margin: 0 auto;
    width: 92vw;
        height: 100%;
        background-color: white;
        @media only screen and (max-width: 770px) {
        margin-bottom: 2rem;
        }
    `;
const Wrapper = styled.div`
        padding: 2px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        @media only screen and (max-width: 930px) {
        flex-direction : column;
        }
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
const AppLayout: FC<ReactNode> = ({ children }) => {
  const { me } = useSelector<RootState, UserState>((state) => state.user);
  const { userCart } = useSelector<RootState, CartState>((state) => state.cart);
  const dispatch = useDispatch();

  const onHandleLogout = useCallback(
    () => {
      dispatch(logOut());
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
                <a>STAR CLOTHES</a>
              </Link>
            </Logo>
          </Center>
          <Right>
            {me
              ? (
                <MenuItem>
                  <Button>
                    <Link href="/productForm">
                      <a>상품등록</a>
                    </Link>
                  </Button>
                </MenuItem>
              )
              : null}
            {me
              ? null
              : (
                <MenuItem>
                  <Button>
                    <Link href="/signup">
                      <a>회원가입</a>
                    </Link>
                  </Button>
                </MenuItem>
              )}

            <MenuItem>
              {me
                ? (
                  <Button onClick={onHandleLogout}>
                    로그아웃
                  </Button>
                )
                : (
                  <Button>
                    <Link href="/signin">
                      <a>로그인</a>
                    </Link>
                  </Button>
                )}
            </MenuItem>

            <MenuItem>
              <Button>
                <Link href="/mypage">
                  <a>마이페이지</a>
                </Link>
              </Button>
            </MenuItem>

            <MenuItem>
              <Link href="/cart">
                <a>
                  <Badge count={userCart.length}>
                    <ShoppingCart />
                  </Badge>
                </a>
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
