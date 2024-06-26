import React from 'react';
import styled from 'styled-components';
import { GetCartListRes } from '../../../../apis/cart/schema';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  > tr{
      > th {
      text-align: center;
      color: #767676;
      font-size: 14px;
      border-bottom: 1px solid #b8b8b8;
      padding: 10px 0;
      font-weight: 400;
    }
  }
}
`;
const Td = styled.td`
    padding: 25px 0;
    line-height: 18px;
    color: #767676;
    vertical-align: middle;
    text-align: center;
    border-bottom: 1px solid #e5e5e5;

    &:nth-of-type(2){
      text-align: left;
    }
`;

const ProductImg = styled.img`
  object-fit: cover;
  width: 100px;
`;

const BrandName = styled.span`
    display: block;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #8e8e8e;
`;

const ProductName = styled(BrandName)`
    color: #111;
    line-height: 20px;
    font-size: 14px;
    margin-bottom: 6px;
    max-width: 240px;
`;

const Option = styled(BrandName)`
  padding-top: 3px;
  color: #767676;
`;

const Quantity = styled.span`
    display: block;
    margin-top: 8px;
    color: #111;
`;

const OrderPrice = styled.span`
  font-size: 15px;
  color: #111;
  font-weight: 700;
`;

interface IProductsProps{
  list: GetCartListRes[];
}

const Products = ({
  list
}: IProductsProps) => {
  return (
    <Table>
      <colgroup>
        <col width={142} />
        <col width={'*'} />
        <col width={200} />
        <col width={200} />
        <col width={180} />
      </colgroup>
      <Thead>
        <tr>
          <th colSpan={2} scope="col">
                상품정보
          </th>
          <th>
                할인/혜택
          </th>
          <th>
                배송 정보
          </th>
          <th>
                주문금액
          </th>
        </tr>
      </Thead>
      <tbody>
        {list?.map((info) => (
          <tr key={info.id}>
            <Td>
              <ProductImg src={info.Product.Images[0].src}/>
            </Td>
            <Td>
              <BrandName>
                    8 seconds
              </BrandName>
              <ProductName>
                {info.Product.productName}
              </ProductName>
              <Option className="option">
                {info.size}
              </Option>
              <Quantity>
                {info.quantity} 개
              </Quantity>
            </Td>
            <Td/>
            <Td>
              무료배송
            </Td>
            <Td>
              <OrderPrice>
                {info.totalPrice.toLocaleString('ko-KR')}원
              </OrderPrice>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default Products;