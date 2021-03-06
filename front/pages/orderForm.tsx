import { Breadcrumb, Typography } from 'antd';
import React, {
  FC, useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import styled from 'styled-components';
import Router from 'next/router';
import axios from 'axios';
import dynamic from 'next/dynamic';
import AppLayout from '../components/AppLayout';
import { loadUser } from '../reducers/asyncRequest/user';
import { loadProductsInCart } from '../reducers/asyncRequest/cart';
import { CartState } from '../reducers/reducerTypes/cartTypes';
import { UserState } from '../reducers/reducerTypes/userTypes';
import { checkProduct } from '../reducers/cart';
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
const Tbody = styled.tbody`
    height: 10rem;
    text-align: center;
`;
const Image = styled.img`
    width: 150px
    height: 150px
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
const Em = styled.em`
     font-style: normal
`;
const TotalDiv = styled.div`
    margin-top: 2rem;
`;
const OrderForm: FC = () => {
  const {
    userCart, cartTotalPrice, cartTotalDeliveryFee,
  } = useSelector<RootState, CartState>((state) => state.cart);
  const { me } = useSelector<RootState, UserState>((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkProduct({ id: userCart[0]?.id }));
  }, [userCart]);

  useEffect(() => {
    if (!me) {
      Router.push('/signin');
    }
  }, [me]);

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
              ??????
            </Breadcrumb.Item>
          </BreadCrumb>

          <PageTitle level={2}>
            ??????
          </PageTitle>

          <TableDiv>
            <Table>
              <Thead>
                <tr>
                  <th colSpan={2}>????????????</th>
                  <th>????????????</th>
                  <th>????????????</th>
                </tr>
              </Thead>

              <Tbody>
                <tr key={userCart[0]?.id}>
                  <td>
                    <Image alt={userCart[0]?.Product.Images[1].src} src={`${userCart[0]?.Product.Images[1].src}`} />

                  </td>
                  <td>
                    <ProductInfo>
                      <span>{userCart[0]?.Product.productName}</span>
                      <ProductInfoUl>
                        <ProductInfoLi>
                          {userCart[0]?.size}
                          /
                          {userCart[0]?.quantity}
                          ???
                        </ProductInfoLi>
                      </ProductInfoUl>
                    </ProductInfo>
                  </td>

                  <td>
                    {userCart[0]?.totalPrice > 39900 ? '????????????' : '2,500???'}
                  </td>
                  <td>
                    {userCart[0]?.totalPrice}
                    ???
                  </td>
                </tr>

              </Tbody>
            </Table>
          </TableDiv>
          <TotalDiv>
            <h5>????????? ???????????? ??????</h5>
            <span>
              ????????????
              {' '}
              <Em style={{ fontStyle: 'normal' }}>
                {(cartTotalPrice - cartTotalDeliveryFee).toLocaleString('ko-KR')}
                ???
              </Em>
              {' '}
              + ?????????
              {' '}
              <Em style={{ fontStyle: 'normal' }}>
                {cartTotalDeliveryFee.toLocaleString('ko-KR')}
                ??? =
                {' '}
              </Em>
            </span>
            <span>
              {cartTotalPrice.toLocaleString('ko-KR')}
              ???
            </span>
          </TotalDiv>
          {/* <Payment checkedProductsList={checkedProductsList}/> */}

          {userCart[0] && <DynamicPaypalComponent headers="buynow" checkedProduct={userCart[0]} cartTotalPrice={cartTotalPrice} checkedProductsList={undefined} />}
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
export default OrderForm;
