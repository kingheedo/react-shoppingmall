import React, { FC, useCallback, useState } from 'react';
import Router from 'next/router';
import { Card } from 'antd';
import { MainProducts } from '../reducers/asyncActionTypes/productType';

type Props = {
  product: MainProducts
}
const MainProduct: FC<Props> = ({ product }) => {
  const [show, setShow] = useState(false);
  const onMouseHover = useCallback(
    () => {
      setShow((prev) => !prev);
    },
    [],
  );
  const onClickCard = useCallback(
    (id:number) => () => {
      Router.push(`/product/${id}`);
    },
    [],
  );
  return (
    <Card
      onClick={onClickCard(product.id)}
      onMouseEnter={onMouseHover}
      onMouseLeave={onMouseHover}
      style={{ width: 240, cursor: 'pointer' }}
      cover={show ? <img alt="Images[0]" src={`http://localhost:3065/${product.Images[0].src}`} /> : <img alt="Images[1]" src={`http://localhost:3065/${product.Images[1].src}`} />}
    >
      <div>
        <span>{product && product.productName}</span>
        <strong>{product && product.price}</strong>
      </div>
    </Card>
  );
};

export default MainProduct;
