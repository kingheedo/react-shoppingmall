'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useSetRecoilState } from 'recoil';
import Link from 'next/link';
import { LoginState } from '../../../store';
import apis from '../../../apis';
import SearchArea from '../SearchArea';
import useGetUser from '../../../hooks/queries/useGetUser';

const HeaderWrap = styled.header`
  min-width: 1280px;
`;
const TopArea = styled.div`
  background: #000;
`;

const TopAreaInner = styled.div`
   max-width: 1440px;
  margin: 0 auto;
  height: 40px;
  padding: 0 var(--gap);
  font-size: var(--fontA);
  line-height: var(--fontAL);
  color: var(--gray400);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;

  .util{
    position: relative;
    display: flex;
    align-items: center;
    &::after{
      display: inline-block;
      position: absolute;
      right: 0;
      content: '';
      width: 1px;
      height: 12px;
      background: #555;
    }
    a[aria-label=cart]{
    position: relative;
    display: block;
    width: 20px;
    height: 20px;
    background: url(/shopping-bag.svg) center/20px auto no-repeat;
    margin-right: 24px;
      > span{
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: -12px;
        bottom: 0;
        width: 22px;
        height: 15px;
        background-color: #7e00ff;
        border-radius: 20px;
        font-size: 9px;
        color: #fff;
        font-weight: 700;
        letter-spacing: -1px;
        }
      }
    }
    .user{
      a{
        &:not(:first-child){
          margin-left: 24px;
        }
      }
`;

const GnbArea = styled.div`
  border-bottom: 1px solid #000;
`;

const NavBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  max-width: 1440px;
  min-width: 1280px;
  padding: 0 var(--gap);
  margin: 0 auto;
  height: 70px;
  background: #fff;
`;

const HomeLogo = styled(Link)`
  display: block;
  width: 145px;
  height: 40px;
  background: url(/logo.webp) no-repeat;
  object-fit: cover;
  margin-right: auto;
`;

const Header = () => {
  const setLoginState = useSetRecoilState(LoginState);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useGetUser();

  const { mutate: logout } = useMutation(() => apis.User.logout(),{
    onSuccess: () => {
      queryClient.invalidateQueries(['getUser']);
      setLoginState(null);
      router.push('/');

    }
  });
  
  const onClickLogOut = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    logout();
  },[]);
  
  return (
    <HeaderWrap>
      <TopArea>
        <TopAreaInner>
          <div className="util">
            <Link aria-label="cart" href="/cart" prefetch={false}>
              <span>
                {(user?.info.id && user.cartLength) || 0}
              </span>
            </Link>
          </div>
          <div className="user">
            <Link aria-label="mypage" href="/mypage" prefetch={false}>
            마이페이지
            </Link>
            {!user?.info.id
              ? <Link aria-label="login" href="/signIn" prefetch={false}>로그인</Link>
              : <Link aria-label="logout" onClick={onClickLogOut} href="#" prefetch={false}>로그아웃</Link>}
          </div>
        </TopAreaInner>
      </TopArea>
      <GnbArea>
        <NavBar>
          <HomeLogo href="/" />
          <SearchArea/>
        </NavBar>
      </GnbArea>
    </HeaderWrap>
  );
};

export default Header;