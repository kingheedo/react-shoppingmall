import { Breadcrumb, Typography } from 'antd';
import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import styled from 'styled-components';
import Router from 'next/router';
import { CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import dynamic from 'next/dynamic';
import AppLayout from '../components/AppLayout';
import { CartState } from '../reducers/reducerTypes/cartTypes';
import { UserState } from '../reducers/reducerTypes/userTypes';
import { deleteProductInCart, loadProductsInCart } from '../reducers/asyncRequest/cart';
import { loadUser } from '../reducers/asyncRequest/user';
import {
  checkAllProducts, checkProduct, unCheckAllProducts, uncheckProduct,
} from '../reducers/cart';
import wrapper, { RootState } from '../store/configureStore';

const DynamicPaypalComponent = dynamic(() => import('../components/Paypal'), { ssr: false });

const { Title } = Typography;

const Container = styled.div`
    width: 80vw;
    height: 100%;
    margin: 6rem auto 0;
`;

const Wrapper = styled.div`
    display : flex;
    align-items: left;
    flex-direction : column;
`;
const ProductInfo = styled.div`
    @media only screen and (max-width: 690px) {
        width: 16vw;
        }
    
`;
const ProductInfoUl = styled.ul`
     list-style: none; 
     margin: 0; 
     padding: 0;
    
`;
const ProductInfoLi = styled.li`
     list-style: none;
    
`;
const BreadCrumb = styled(Breadcrumb)`
     width: 36vw;
`;
const PageTitle = styled(Title)`
     margin-top: 3rem;
     width: 36vw;
`;
const TableDiv = styled.div`
     margin-top: 3rem;
`;
const Table = styled.table`
     width: 60vw;
`;
const Thead = styled.thead`
     border-bottom: 1px solid;
`;
const CheckAll = styled.input`
    width: 20px; 
    height: 20px;
`;
const Tbody = styled.tbody`
    height: 10rem;
    text-align: center;
`;
const Check = styled.input`
     width: 20px;
     height: 20px;
`;
const Image = styled.img`
        width: 500px;
        height: 500px;
@media only screen and (max-width: 1160px) {
        width: 442px;
        }
@media only screen and (max-width: 690px) {
        width: 290px;
        height: 290px;
        }
`;
const DelteBtn = styled(CloseOutlined)`
    font-size: 20px; 
    cursor: pointer;
`;
const Em = styled.em`
     font-style: normal
`;
const TotalDiv = styled.div`
    margin-top: 2rem;
`;
const Cart: FC = () => {
  const { userCart, cartTotalPrice, cartTotalDeliveryFee } = useSelector<RootState, CartState>((state) => state.cart);
  const { me } = useSelector<RootState, UserState>((state) => state.user);
  const dispatch = useDispatch();
  const [checkedProductsList, setcheckedProductsList] = useState(userCart);
  const [checkedAllProducts, setCheckedAllProducts] = useState(true);
  const [checkedProductStates, setCheckedProductStates] = useState(
    Array(userCart.length).fill(true),
  );

  useEffect(() => {
    if (!me) {
      Router.push('/signin');
    }
  }, [me]);

  useEffect(() => {
    dispatch(checkAllProducts());
  }, []);

  const onChangeAllCheckedProducts = useCallback(
    (e) => {
      setCheckedAllProducts((prev) => !prev);
      if (e.target.checked) {
        setCheckedProductStates(checkedProductStates.fill(true));
        setcheckedProductsList(userCart);
        dispatch(checkAllProducts());
      } else {
        setCheckedProductStates(checkedProductStates.fill(false));
        setcheckedProductsList([]);
        dispatch(unCheckAllProducts());
      }
    },
    [checkedProductsList, userCart, checkedProductStates],
  );
  const onChangeCheck = useCallback(
    (productId, index) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedCheckedProducts = checkedProductStates.map((productState, i) => (i === index ? !productState : productState));
      setCheckedProductStates(updatedCheckedProducts);
      setCheckedAllProducts(updatedCheckedProducts.every((v) => v === true));

      const checkedProduct = userCart.find((product) => product.id === productId);
      if (e.target.checked && checkedProduct) {
        setcheckedProductsList([...checkedProductsList, checkedProduct]);
        dispatch(checkProduct({ id: productId }));
      } else {
        setcheckedProductsList(checkedProductsList.filter((v) => v.id !== productId));
        dispatch(uncheckProduct({ id: productId }));
      }
    },
    [checkedProductsList, userCart, checkedProductStates],
  );

  const onDeleteCartItem = useCallback(
    (cartSingleProductId) => (e: React.MouseEvent) => {
      e.preventDefault();
      dispatch(deleteProductInCart({ id: cartSingleProductId }));
    },
    [],
  );
  return (
    <AppLayout>
      <Container>
        <Wrapper>
          <BreadCrumb>
            <Breadcrumb.Item>
              <Link href="/">
                <a>
                  Home
                </a>
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              장바구니
            </Breadcrumb.Item>
          </BreadCrumb>

          <PageTitle level={2}>
            장바구니
          </PageTitle>

          <TableDiv>
            <Table>
              <Thead>
                <tr>
                  <th>
                    <CheckAll type="checkbox" checked={checkedAllProducts} onChange={onChangeAllCheckedProducts} />
                  </th>
                  <th colSpan={2}>상품정보</th>
                  <th>배송정보</th>
                  <th>주문금액</th>
                </tr>
              </Thead>

              <Tbody>
                <tr>
                  <td />
                </tr>
                {userCart[0] && userCart.map((cartSingleProduct, index) => (
                  <tr key={cartSingleProduct.id}>
                    <td>
                      <Check checked={checkedProductStates[index]} type="checkbox" onChange={onChangeCheck(cartSingleProduct.id, index)} />
                    </td>
                    <td>
                      <Image alt={cartSingleProduct.Product.Images[1].src} src={`${cartSingleProduct.Product.Images[1].src}`} />
                    </td>
                    <td>
                      <ProductInfo>
                        <span>{cartSingleProduct.Product.productName}</span>
                        <ProductInfoUl>
                          <ProductInfoLi>
                            {cartSingleProduct.size}
                            /
                            {cartSingleProduct.quantity}
                            개
                          </ProductInfoLi>
                        </ProductInfoUl>
                      </ProductInfo>
                    </td>
                    <td>
                      {cartSingleProduct.totalPrice > 39900 ? '무료배송' : '2,500원'}
                    </td>
                    <td>
                      {cartSingleProduct.totalPrice.toLocaleString('ko-KR')}
                      원
                    </td>
                    <td>
                      <DelteBtn onClick={onDeleteCartItem(cartSingleProduct.id)} />
                    </td>
                  </tr>
                ))}

              </Tbody>
            </Table>
          </TableDiv>
          <TotalDiv>
            <h5>스토어 주문금액 합계</h5>
            <span>
              상품금액
              {' '}
              <Em>
                {(cartTotalPrice - cartTotalDeliveryFee).toLocaleString('ko-KR')}
                원
              </Em>
              {' '}
              + 배송비
              {' '}
              <Em>
                {cartTotalDeliveryFee.toLocaleString('ko-KR')}
                원 =
                {' '}
              </Em>
            </span>
            <span>
              {cartTotalPrice.toLocaleString('ko-KR')}
              원
            </span>
          </TotalDiv>
          {userCart[0] && <DynamicPaypalComponent headers="buylater" checkedProductsList={checkedProductsList} cartTotalPrice={cartTotalPrice} checkedProduct={undefined} />}
        </Wrapper>
      </Container>
    </AppLayout>
  );
};
export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  await store.dispatch(loadUser());
  await store.dispatch(loadProductsInCart());
  return {
    props: {},
  };
});
export default Cart;
