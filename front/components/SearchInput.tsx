import { Input } from 'antd';
import Link from 'next/link';
import Router from 'next/router';
import React, { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import useInput from '../hooks/useInput';
import { RootState } from '../reducers';
import { ProductState } from '../reducers/asyncActionTypes/productType';
import { searchProduct } from '../reducers/dispatchRequestTypes/productDispatchRequest';

const { Search } = Input;
const SearchWrapper = styled.div`
      z-index: 1000;
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
const SearchLink = styled.a`
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
const SearchInput:FC = () => {
  const { searchProductsList } = useSelector<RootState, ProductState>((state) => state.product);
  const [searchvalue, onChangeSearch] = useInput(null);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(searchvalue);
    if (searchvalue) {
      dispatch(searchProduct(searchvalue));
    }
  }, [searchvalue]);
  const onEnterLink = useCallback(
    (id) => (e: React.KeyboardEvent<HTMLLIElement>) => {
      console.log(e.target);
      if (e.key === 'Enter') {
        Router.push(`/product/${id}`);
      }
    },
    [],
  );

  // useEffect(() => {
  //   if (Array.isArray(searchProductsList)) {
  //     searchProductsList.map(
  //       (v) => <div>{v.productName}</div>,
  //     );
  //   } else {
  //     <div>{searchProductsList.productName}</div>;
  //   }
  // }, [searchvalue, searchProductsList]);

  // const onSearch = useCallback(
  //   () => {
  //     return alert(searchvalue);
  //   },
  //   [searchvalue],
  // );
  return (
    <SearchWrapper>
      <Search value={searchvalue} onChange={onChangeSearch} allowClear style={{ width: '20rem' }} placeholder="input search text" />
      <SearchResult>
        <SearchUl>
          {
            searchvalue && searchProductsList && searchProductsList.map(
              (v) => (
                <SearchLi tabIndex={0} onKeyPress={onEnterLink(v.id)}>
                  <Link href={`/product/${v.id}`}>
                    <SearchLink>
                      {v.productName}
                    </SearchLink>
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
