import {
  Divider, List, Rate,
} from 'antd';
import React, { FC } from 'react';
import { SingleProduct } from '../reducers/reducerTypes/productType';

type Props = {
  product: SingleProduct
}
const ReviewLists: FC<Props> = ({ product }) => {
  return (
    <>
      <Divider orientation="left">상품 리뷰</Divider>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 3,
        }}
        dataSource={product?.Reviews}
        renderItem={(item: any) => (
          <List.Item
            key={item.id}
          // extra={(
          //   <img
          //     width={272}
          //     alt="logo"
          //     src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
          //   />
          //       )}
          >
            <List.Item.Meta
              description={item.User?.email}
            />
            <Rate disabled value={item?.rate} />
            <br />
            {item?.content}

            <br />
          </List.Item>
        )}
      />

    </>
  );
};
export default ReviewLists;
