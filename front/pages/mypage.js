import Router from 'next/router'
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import AppLayout from '../components/AppLayout'
import { Breadcrumb, Card ,Typography, Divider } from 'antd';
import { LOAD_PAYMENT_LISTS_REQUEST, LOAD_USER_REQUEST } from '../reducers/user'
import Link from 'next/link';
import moment from 'moment';
import { END } from 'redux-saga'
import axios from 'axios'
import wrapper from '../store/configureStore'
import { LOAD_CART_PRODUCTS_REQUEST } from '../reducers/cart'
moment.locale('ko');
const { Title } = Typography;

const { Meta } = Card;

const Wrapper = styled.div`
    width: 80vw;
    height : 100vh-60px;
    display : flex;
    align-items: left;
    flex-direction : column;
    margin: 200px;

`
const CardItem = styled(Card)`
    .ant-card-body {
        width: 500px;
    }

`



const Mypage = () => {
    const {me,paymentLists} = useSelector(state => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({
            type : LOAD_USER_REQUEST
        })
    }, [])

    useEffect(() => {
        dispatch({
            type : LOAD_PAYMENT_LISTS_REQUEST
        })
    }, [])
    
    useEffect(() => {
        if(!me){
            Router.push('/signin')
        }
    }, [me])

    return (
        <AppLayout>
            <Wrapper>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link href="/">
                                <a>
                                    Home
                                </a>
                            </Link>    
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                                    마이페이지
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Title level={2} style={{marginTop : '3rem'}}>
                        주문내역
                    </Title>
                    <div style={{marginTop : '3rem', width: '36vw',}}>
                        {
                            paymentLists && paymentLists.map(v =>
                                <Link href={`/product/${v.Cart.Product.id}`} style={{overflow: 'hidden'}}>
                                    <a>
                                        <h3>{v.paymentID}</h3>
                                        <CardItem
                                            style={{ width: '680px',display: 'flex', marginBottom: '2rem', }}
                                            cover={<img alt={v.Cart.Product.Images[1]} src={`http://localhost:3065/${v.Cart.Product.Images[1].src}`} />}
                                            
                                        >
                                                        <Meta style={{float:'left',}} title={v.Cart.Product.productName}/>
                                                            <p style={{float:'right'}}>{moment(v.createdAt).format('LLL')}</p>
                                                        <br/>
                                                        <br/>
                                                        <span>{`${v.Cart.size} / ${v.Cart.quantity}`}</span>
                                                        <br/>
                                                        <strong>{v.Cart.totalPrice > 39900 ? v.Cart.totalPrice : (v.Cart.totalPrice + 2500)}</strong>
                                            
                                        </CardItem>
                                    </a>
                                </Link>
                                )
                        }
                    </div>  
            </Wrapper>
        </AppLayout>
    )
}
export const getServerSideProps = wrapper.getServerSideProps( (store) => async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if(context.req && cookie){
    axios.defaults.headers.Cookie = cookie;
  }
  store.dispatch({
    type: LOAD_USER_REQUEST,
  })
  store.dispatch({
    type : LOAD_PAYMENT_LISTS_REQUEST
    })
    store.dispatch({
    type: LOAD_CART_PRODUCTS_REQUEST,
  })
  store.dispatch(END);
  await store.sagaTask.toPromise();
})
export default Mypage
