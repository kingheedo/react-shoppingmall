import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import apis from '../../../apis';
import styled from 'styled-components';
import Link from 'next/link';

interface ISearchActiveProps {
  active: 'false' | 'true';
}

const SearchInput = styled.div`
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

const SearchWrap = styled.div<ISearchActiveProps>`
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  ${SearchInput}{
    transition: all 0.3s;
    width: ${(props: ISearchActiveProps) => props.active === 'true' ? '338px' : '28px'};
    outline: ${(props: ISearchActiveProps) => props.active === 'true' ? '1px solid #000' : '1px solid #fff'};
    padding-left: ${(props: ISearchActiveProps) => props.active === 'true' ? '20px' : '0'};
    input {
      opacity: ${(props: ISearchActiveProps) => props.active === 'true' ? 1 : 0};
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

const SearchLayer = styled.div<ISearchActiveProps>`
  position: absolute;
  top: 46px;
  right: 0;
  z-index: ${(props) => props.active === 'true' ? 2 : -1};
  outline: 1px solid #000;
  width: 338px;
  height: 404px;
  background: #fff;
  padding: 24px 10px 24px 20px;
  opacity: ${(props) => props.active === 'true' ? 1 : 0};
  transition: ${(props) => props.active === 'true' ? 'all 0.3s 0.3s;' : 'all 0.3s'}; 

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

const SearchArea = () => {
  const searchArea = useRef<HTMLDivElement | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [searchActive, setSearchActive] = useState(false);

  const { data: searchedProducts } = useQuery({
    queryKey: ['getSearchedProducts', keyword],
    queryFn: () => apis.Product.getKeywordProducts(keyword),
    enabled: !!keyword
  });
  
  /** 검색 value 핸들러 */
  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };
  
  /** 검색창 활성화 유무   */
  const handleSearchActive = (e: MouseEvent) => {
    const el = e.target as HTMLElement;
    if (!searchArea.current?.contains(el)) {
      setSearchActive(false);
      setKeyword('');  
    }
  };
  useEffect(() => {
    if (searchActive) {
      document.body.addEventListener('click', handleSearchActive);
    }

    return () => document.body.removeEventListener('click', handleSearchActive);
  }, [searchActive]);
  
  return (
    <SearchWrap ref={searchArea} active={searchActive ? 'true' : 'false'}>
      <SearchInput>
        <input
          role="search-input"
          type={'search'}
          placeholder="검색어를 입력하세요"
          onChange={onChangeSearch}
          value={keyword} />
        <SearchBtn onClick={() => {
          searchActive ? setSearchActive(false) : setSearchActive(true);
        } } role="search-btn" />
      </SearchInput>
      <SearchLayer active={searchActive ? 'true' : 'false'}>
        <ul>
          {searchedProducts?.map(product => (
            <li key={product.id}>
              <Link
                onClick={() => {
                  setKeyword('');
                  setSearchActive(false);
                }}
                aria-label={product.productName} 
                href={`/product/${product.id}`}
                prefetch={false}
              >
                {product.productName}
              </Link>
            </li>
          ))}
        </ul>
      </SearchLayer>
    </SearchWrap>
  );
};

export default SearchArea;