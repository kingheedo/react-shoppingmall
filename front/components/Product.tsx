import React, { FC, useCallback, useState } from 'react';
import Router from 'next/router';
import { Card } from 'antd';
import styled from 'styled-components';
import { MainProduct } from '../reducers/reducerTypes/productType';

const CardItem = styled(Card)`
  width: 240px;
  cursor: pointer;
`;
const ProductInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

type Props = {
  product: MainProduct
}
const Product: FC<Props> = ({ product }) => {
  const [show, setShow] = useState(false);
  const onMouseHover = useCallback(
    () => {
      setShow((prev) => !prev);
    },
    [show],
  );
  const onClickCard = useCallback(
    (id: number) => () => {
      Router.push(`/product/${id}`);
    },
    [],
  );
  return (
    <CardItem
      onClick={onClickCard(product.id)}
      onMouseEnter={onMouseHover}
      onMouseLeave={onMouseHover}
      cover={show ? <img alt="Images[0]" src={`${product.Images[0] && product.Images[0].src}`} /> : <img alt="Images[1]" src={`${product.Images[1] && product.Images[1].src}`} />}
    >
      <ProductInfo>
        <span>{product?.productName}</span>
        <strong>
          {product.price?.toLocaleString('ko-KR')}
          {' '}
          원
        </strong>
      </ProductInfo>
    </CardItem>
  );
};

export default Product;
