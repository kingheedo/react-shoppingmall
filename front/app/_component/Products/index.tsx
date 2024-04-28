'use client';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import Item from './Item';
import useGetProducts from '../../../hooks/queries/useInfiniteQuery';

const ListContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;

  > li{
    width: 25%;
    padding: 0 8px;
    margin-bottom: 40px;
    :last-child(-n + 4){
      margin-bottom: 0;
    }
  }
`;

const ProductsArea = styled.section`
  max-width: 1440px;
  min-width: 1280px;
  width: auto;
  min-height: calc(100vh - 706px);
  margin: 120px auto 0;
  padding: 0 var(--gap) 120px;
`;

const Products = () => {
  const { loadRef, data } = useGetProducts();
  const list = useMemo(() => {
    return data?.pages?.flatMap(value => value);
  }, [data?.pages]);

  return (
    <ProductsArea>
      <ListContainer ref={loadRef}>
        {list?.map((product,idx) => (
          <Item
            key={product.id} 
            idx={idx + 1}
            product={product} />
        ))}
      </ListContainer>
    </ProductsArea>
  );
};

export default Products;