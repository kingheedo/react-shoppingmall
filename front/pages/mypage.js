import Router from 'next/router'
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import AppLayout from '../components/AppLayout'
import { Breadcrumb, Card ,Typography, Divider } from 'antd';
import { LOAD_PAYMENT_LISTS_REQUEST, LOAD_USER_REQUEST } from '../reducers/user'
import Link from 'next/link';
import moment from 'moment';
moment.locale('ko');
const { Title } = Typography;

const { Meta } = Card;

const Wrapper = styled.div`
    width: 100vw;
    height : 100vh-60px;
    display : flex;
    align-items: left;
    flex-direction : column;
    margin: 200px;

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
            alert("로그인이 필요합니다.")
            Router.push('/')
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
                    <div style={{marginTop : '4rem'}}>
                        {
                            paymentLists && paymentLists.map(v =>
                                <Link href={`/product/${v.Cart.Product.id}`}>
                                    <a>
                                        <Card
                                            style={{ width: '458px',display: 'flex', marginBottom: '2rem' }}
                                            cover={<img alt={`${v.Cart.Product.Images[1]}`} src={`http://localhost:3065/${v.Cart.Product.Images[1].src}`} />}
                                            
                                        >
                                                        <Meta style={{float:'left',marginRight: '2rem'}} title={v.Cart.Product.productName}/>
                                                            <p style={{float:'right'}}>{moment(v.createdAt).format('LLL')}</p>
                                                        <br/>
                                                        <br/>
                                                        <span>{`${v.Cart.size} / ${v.Cart.quantity}`}</span>
                                                        <br/>
                                                        <strong>{v.Cart.totalPrice > 39900 ? v.Cart.totalPrice : (v.Cart.totalPrice + 2500)}</strong>
                                            
                                        </Card>
                                    </a>
                                </Link>
                                )
                        }
                    </div>  
            </Wrapper>
        </AppLayout>
    )
}

export default Mypage
