import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Router from 'next/router';
import { getUser } from '../../context/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apis from '../../apis';
import { useSetRecoilState } from 'recoil';
import { LoginState } from '../../store';

interface ISearchActiveProps {
  isActive: boolean;
}

const Header = styled.header`
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
    ::after{
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
        :not(:first-child){
          margin-left: 24px;
        }
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

const HomeLogo = styled.a`
  display: block;
  width: 145px;
  height: 40px;
  background: url(/logo.webp) no-repeat;
  object-fit: cover;
  margin-right: auto;
`;

const SearchLayer = styled.div<ISearchActiveProps>`
  position: absolute;
  top: 59px;
  right: 0;
  z-index: 2;
  outline: 1px solid #000;
  width: 338px;
  height: 404px;
  background: #fff;
  padding: 24px 10px 24px 20px;
  opacity: ${(props) => props.isActive ? 1 : 0};
  transition: ${(props) => props.isActive ? 'all 0.3s 0.3s;' : 'all 0.3s'}; 

  ul {
    li{
      padding: 8px 0 7px;
      font-size: var(--fontD);
      line-height: var(--fontDL);
      color: var(--gray600);
      :hover{
        text-decoration: underline;
      }

      a{
        display: block;
        width: 100%;
      }
    }
  }
`;

const SearchInputWrap = styled.div`
  position: relative;
  background: #fff;
  height: 46px;
  
  input[type='search'] {
    width: calc(100% - 54px);
    height: 100%;
    border: 0;
    outline: none;
    font-size: var(--fontD);
    line-height: var(--fontDL);
    color: var(--gray900);

    :focus{
      border: 0 !important;
    }

    ::-webkit-search-cancel-button{
      -webkit-appearance: none;
      width: 1em;
      height: 1em;
      border-radius: 50em;
      background: url(https://pro.fontawesome.com/releases/v5.10.0/svgs/solid/times-circle.svg) no-repeat 50% 50%;
    }
  }
`;

const SearchArea = styled.div<ISearchActiveProps>`
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  ${SearchInputWrap}{
    transition: all 0.3s;
    width: ${(props: ISearchActiveProps) => props.isActive ? '338px' : '28px'};
    outline: ${(props: ISearchActiveProps) => props.isActive ? '1px solid #000' : '1px solid #fff'};
    padding-left: ${(props: ISearchActiveProps) => props.isActive ? '20px' : '0'};
    input {
      opacity: ${(props: ISearchActiveProps) => props.isActive ? 1 : 0};
    }
  }
`;

const SearchBtn = styled.button`
  opacitiy: 1;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 12px;
  width: 28px;
  height: 28px;
  background: url(/search-28.svg);
`;

const Layout = ({ children }: PropsWithChildren) => {
  const me = getUser();
  const setLoginState = useSetRecoilState(LoginState);
  const [searchActive, setSearchActive] = useState(false);
  const [keyword, setKeyword] = useState<string>('');
  const queryClient = useQueryClient();
  const { data: cartList } = useQuery(['getCartList'], () => apis.Cart.getCartList(), {
    enabled: !!me?.info.id 
  });
  const { mutate: logout } = useMutation(() => apis.User.logout(),{
    onSuccess: () => {
      queryClient.invalidateQueries(['getUser']);
      setLoginState(null);
    }
  });

  const { data: searchedProducts } = useQuery({
    queryKey: ['getSearchedProducts', keyword],
    queryFn: () => apis.Product.getKeywordProducts(keyword),
    enabled: !!keyword
  });

  console.log('searchedProducts',searchedProducts);

  const onClickLogOut = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    logout();
    Router.push('/');
  },
  [],
  );

  /** 검색 value 핸들러 */
  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('e',e.target.value);
    setKeyword(e.target.value);
  };

  /** 검색창 활성화 유무 핸들러 */
  const handleSearchActive = (e: MouseEvent) => {
    const el = e.target as HTMLElement;
    if (el.role === 'search-btn') {
      return;
    }
    
    if (el.role === 'search-input' || el.role === 'search-layer') {
      return;      
    }
    setSearchActive(false);
    setKeyword('');
  };
  
  useEffect(() => {
    document.body.addEventListener('click', handleSearchActive);

    return () => document.body.removeEventListener('click', handleSearchActive);
  }, [searchActive]);

  return (
    <React.Fragment>
      <Header>
        <TopArea>
          <TopAreaInner>
            <div className="util">
              <Link aria-label="cart" href="/cart">
                <span>
                  {(me?.info.id && cartList?.length) || 0}
                </span>
              </Link>
            </div>
            <div className="user">
              <Link aria-label="mypage" href="/mypage">
              마이페이지
              </Link>
              {!me?.info.id 
                ? <Link aria-label="login" href="/signin">로그인</Link>
                : <Link aria-label="logout" onClick={onClickLogOut} href="#">로그아웃</Link>
              }
            </div>
          </TopAreaInner>
        </TopArea>
        <GnbArea>
          <NavBar>
            <HomeLogo href="/"/>
            <SearchArea isActive ={searchActive ? true : false}>
              <SearchInputWrap>
                <input 
                  role="search-input" 
                  type={'search'} 
                  placeholder="검색어를 입력하세요" 
                  onChange={onChangeSearch} 
                  value={keyword}/>
                <SearchBtn onClick={() => {
                  searchActive ? setSearchActive(false) : setSearchActive(true);
                }} role="search-btn"/>
              </SearchInputWrap>
            </SearchArea>
            <SearchLayer role="search-layer" isActive ={searchActive ? true : false}>
              <ul>
                {searchedProducts?.map(product => (
                  <li key={product.id}>
                    <Link href={`/product/${product.id}`}>
                      {product.productName}
                    </Link>
                  </li>
                ))}
              </ul>
            </SearchLayer>
          </NavBar>
        </GnbArea>
      </Header>
      {children}
    </React.Fragment>
  );
};

export default Layout;
