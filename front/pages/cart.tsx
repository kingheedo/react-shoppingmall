import {
  FC, useEffect, useState,
} from 'react';
import Router from 'next/router';
import axios from 'axios';
import { loadProductsInCart } from '../reducers/asyncRequest/cart';
import { loadUser } from '../reducers/asyncRequest/user';
import wrapper from '../store/configureStore';
import styled from 'styled-components';
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query';
import apis from '../apis';
import { GetCartListRes } from '../apis/cart/schema';

const Cart = styled.div`
`

const Breadcrumb = styled.div`
  padding: 20px var(--gap) 0px;
`

const BreadcrumbOl = styled.ol`
  display: flex;
`
const BreadcrumbLi = styled.li`
  margin-right: 8px;
  font-size: var(--fontB);
  line-height: var(--fontBL);
`

const HomeLink = styled(Link)`
  background: url('/chevron-right.svg') no-repeat right center/12px auto;
  padding-right: 20px;
  color: var(--gray450);
`

const OrderWrap = styled.div`
  display: grid;
  place-content: center;
  padding: 41px var(--gap) 120px;
`
const Title = styled.h1`
  margin-bottom: 40px;
  font-size: var(--fontI);
  line-height: var(--fontIL);
  color: var(--gray900);
  text-align: center;
`

const OrderHead = styled.div`
  display: flex;
  justify-content: space-between;

  > label {
      >span{
      color: #111;
      font-weight: 700;
    }
  }
`

const DltSlctedBtn = styled.button`
  padding: 0 20px;
  width: auto;
  height: 36px;
  font-size: 14px;
  line-height: 34px;
  border: 1px solid #e5e5e5;
  background: #fff;
  color: #111;
`


const CartPage = () => {
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const {data: list} = useQuery(['getCartList'], () => apis.Cart.getCartList())
  // const { userCart, cartTotalPrice, cartTotalDeliveryFee } = useSelector<RootState, CartState>((state) => state.cart);
  // const { me } = useSelector<RootState, UserState>((state) => state.user);
  // const dispatch = useAppDispatch();
  // const [checkedProductsList, setcheckedProductsList] = useState(userCart);
  // const [checkedAllProducts, setCheckedAllProducts] = useState(true);
  // const [checkedProductStates, setCheckedProductStates] = useState(
    // Array(userCart.length).fill(true),
  // );

  // useEffect(() => {
  //   if (!me) {
  //     Router.push('/signin');
  //   }
  // }, [me]);

  // useEffect(() => {
  //   dispatch(checkAllProducts());
  // }, []);

  // const onChangeAllCheckedProducts = useCallback(
  //   (e:any) => {
  //     setCheckedAllProducts((prev) => !prev);
  //     if (e.target.checked) {
  //       setCheckedProductStates(checkedProductStates.fill(true));
  //       setcheckedProductsList(userCart);
  //       dispatch(checkAllProducts());
  //     } else {
  //       setCheckedProductStates(checkedProductStates.fill(false));
  //       setcheckedProductsList([]);
  //       dispatch(unCheckAllProducts());
  //     }
  //   },
  //   [checkedProductsList, userCart, checkedProductStates],
  // );
  // const onChangeCheck = useCallback(
  //   (productId: any, index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const updatedCheckedProducts = checkedProductStates.map((productState, i) => (i === index ? !productState : productState));
  //     setCheckedProductStates(updatedCheckedProducts);
  //     setCheckedAllProducts(updatedCheckedProducts.every((v) => v === true));

  //     const checkedProduct = userCart.find((product) => product.id === productId);
  //     if (e.target.checked && checkedProduct) {
  //       setcheckedProductsList([...checkedProductsList, checkedProduct]);
  //       dispatch(checkProduct({ id: productId }));
  //     } else {
  //       setcheckedProductsList(checkedProductsList.filter((v) => v.id !== productId));
  //       dispatch(uncheckProduct({ id: productId }));
  //     }
  //   },
  //   [checkedProductsList, userCart, checkedProductStates],
  // );

  // const onDeleteCartItem = useCallback(
  //   (cartSingleProductId: any) => (e: React.MouseEvent) => {
  //     e.preventDefault();
  //     dispatch(deleteProductInCart({ id: cartSingleProductId }));
  //   },
  //   [],
  // );

  console.log('list',list);
  
  return (
    <Cart>
      <Breadcrumb>
        <BreadcrumbOl>
          <BreadcrumbLi>
            <HomeLink href="/">
              Home
            </HomeLink>
          </BreadcrumbLi>
          <BreadcrumbLi>장바구니</BreadcrumbLi>
        </BreadcrumbOl>
      </Breadcrumb>
      <div className="contents">
        <OrderWrap>
          <Title>
            장바구니
          </Title>
          <OrderHead>
            <label>
              <input type="checkbox" className='check-all' />
              <span>
                전체선택
              </span>
            </label>
            <DltSlctedBtn>
              선택 상품 삭제
            </DltSlctedBtn>
          </OrderHead>
          <table>
            <thead>
              <tr>
                <th>상품·혜택 정보</th>
                <th>배송정보</th>
                <th>주문금액</th>
              </tr>
            </thead>
            <tbody>
              {list?.map(info => (
          <tr>
                <td>
                  <label>
                      <input type="checkbox" />
                  </label>
                </td>
                <td>
                    <img src={`${process.env.NEXT_PUBLIC_SERVER_URL}/${info.Product.Images[0].src}`} alt={info.Product.Images[0].src} />
                </td>
                <td>
                  <div className="info">
                    <span className="brand">
                      8 seconds
                    </span>
                    <span className="name">
                      {info.Product.productName}
                    </span>
                    <em>
                       {info.size} / {info.quantity}
                    </em>
                    <button>
                      옵션/수량 변경
                    </button>
                  </div>
                </td>
                <td>
                  <span>
                    무료배송
                  </span>
                  <span>
                    오늘 18시 전까지 주문 시, 오늘출고예정
                  </span>
                </td>
                <td>
									<div className="price">
                    <span>{info.totalPrice}</span>
                    {/* <em>33%</em> */}
                  </div>
                  <button>
                    바로구매
                  </button>
                  <button>
                    X
                  </button>
                </td>
              </tr>
              ))}
              
            </tbody>
          </table>
        </OrderWrap>
      </div>
    </Cart>
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
export default CartPage;
