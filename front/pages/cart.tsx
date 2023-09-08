import axios from 'axios';
import CartComponent from '../components/Cart';

const CartPage = () => {
  return (
    <CartComponent/>
  );
};
// export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
//   const cookie = context.req ? context.req.headers.cookie : '';
//   axios.defaults.headers.Cookie = '';
//   if (context.req && cookie) {
//     axios.defaults.headers.Cookie = cookie;
//   }

//   await store.dispatch(loadUser());
//   await store.dispatch(loadProductsInCart());
  
//   return {
//     props: {}
//   };
// });
export default CartPage;
