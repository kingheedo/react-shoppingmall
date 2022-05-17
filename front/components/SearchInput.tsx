import { Input } from 'antd';
import Link from 'next/link';
import Router from 'next/router';
import React, {
  FC, useCallback, useEffect, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import useInput from '../hooks/useInput';
import { ProductState } from '../reducers/reducerTypes/productType';
import { searchProducts } from '../reducers/asyncRequest/product';
import { RootState } from '../store/configureStore';

const { Search } = Input;
const SearchWrapper = styled.div`
      position: relative;
    `;
const SearchResult = styled.div`
    z-index: 900;
    background: #fff;
    position: absolute;
    border-left: 1px solid #d9d9d9;;
    border-right: 1px solid #d9d9d9;;
    border-bottom: 1px solid #d9d9d9;;
    `;
const SearchLinkAnchor = styled.a`
    padding: 4px 11px;
    display: block;
    `;
const SearchUl = styled.ul`
    margin: 0;
    list-style: none;
    padding: 0;
    `;
const SearchLi = styled.li`
    width: 17.9rem;
    :hover {
      background : #d9d9d9;
    }
    
    `;
const SearchInput: FC = () => {
  const { searchProductsList } = useSelector<RootState, ProductState>((state) => state.product);
  const [searchvalue, onChangeSearch, setSearchValue] = useInput(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchvalue) {
      setOpenDropdown(true);
      dispatch(searchProducts(searchvalue));
    } else {
      setOpenDropdown(false);
    }
  }, [searchvalue]);

  useEffect(() => {
    const onCheckClickOutside = (e: MouseEvent) => {
      //! ref.current.contains(e.target as Node) 은 SearchResult태그에 이벤트가 발생하지 않았을때를 의미
      if (searchvalue && openDropdown === true && searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener('mousedown', onCheckClickOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', onCheckClickOutside);
    };
  }, [searchvalue, openDropdown, searchRef.current]);

  const onReset = useCallback(
    () => {
      setSearchValue('');
      setOpenDropdown(false);
    },
    [searchvalue, openDropdown],
  );

  const onTabEnterLink = useCallback(
    (id) => (e: React.KeyboardEvent<HTMLLIElement>) => {
      if (e.key === 'Enter') {
        Router.push(`/product/${id}`);
      }
    },
    [],
  );

  const onSearchEnter = useCallback(
    () => {
      if (searchvalue && searchProductsList[0].id) {
        onReset();
        Router.push(`/product/${searchProductsList[0].id}`);
      }
    },
    [searchvalue, searchProductsList],
  );

  return (
    <SearchWrapper>
      <Search onSearch={onSearchEnter} onPressEnter={onSearchEnter} value={searchvalue} onChange={onChangeSearch} allowClear style={{ width: '20rem' }} placeholder="search" />
      <SearchResult ref={searchRef}>
        <SearchUl>
          {
            openDropdown && searchProductsList?.map(
              (v) => (
                <SearchLi onClick={onReset} tabIndex={0} onKeyPress={onTabEnterLink(v.id)}>
                  <Link href={`/product/${v.id}`}>
                    <SearchLinkAnchor>
                      {v.productName}
                    </SearchLinkAnchor>
                  </Link>
                </SearchLi>
              ),
            )
          }
        </SearchUl>
      </SearchResult>
    </SearchWrapper>
  );
};

export default SearchInput;
