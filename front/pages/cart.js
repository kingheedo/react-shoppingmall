import { Breadcrumb,Table,Image, Checkbox, Empty } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AppLayout from '../components/AppLayout'
import Link from 'next/link'
import styled from 'styled-components'
import { CHECK_CART_PRODUCT_REQUEST, UNCHECK_CART_PRODUCT_REQUEST } from '../reducers/cart'
import Router from 'next/router'
import Payment from '../components/payment'

const CartTable =  styled(Table)`
.ant-pagination {
    display:none;
},
`
const Wrapper = styled.div`
    margin: 200px;
`
   
    
    const Cart = () => {
        const {products,totalPrice,totalDeliveryFee,} = useSelector(state => state.cart)
        const {me} = useSelector(state => state.user)
        const dispatch = useDispatch()
        const [checkedProducts, setcheckedProducts] = useState([])
        
        useEffect(() => {
            if(!me){
                Router.push('/signin')
            }
        }, [me])
        const onChangeCheck = useCallback(
           (productSize) => (e) => {
                console.log('target', e.target);
                if(e.target.checked){
                setcheckedProducts([...checkedProducts,{id: e.target.id, Size : productSize}])
                dispatch({
                type: CHECK_CART_PRODUCT_REQUEST,
                data : {id : e.target.id, Size: productSize}
            })
            }else{
               setcheckedProducts(checkedProducts.filter( v => v.id !== e.target.id))
               dispatch({
                type: UNCHECK_CART_PRODUCT_REQUEST,
                data : {id : e.target.id, Size: productSize}
            })
            }
            },
            [checkedProducts,],
        )

        
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
                                    장바구니
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <div>
                    <table style={{width: '1100px', border: '1px solid'}}>
                        <thead style={{border: '1px solid'}}>
                            <tr>
                                {products[0] 
                                ?
                                (
                                <>
                                <th>{' '}</th>
                                <th>{' '}</th>
                                </>

                                )
                                : null
                            }
                                <th style={{border: '1px solid'}}>상품정보</th>
                                <th style={{border: '1px solid'}}>배송정보</th>
                                <th style={{border: '1px solid'}}>주문금액</th>
                            </tr>
                        </thead>
                        
                        
                        <tbody style={{height:'10rem', textAlign:'center'}} >
                        {products[0] && products.map(product => 
                                    (<tr key={product.Size} style={{border: '1px solid'}}>
                                        <td>
                                            <Checkbox id={product.id} value={checkedProducts.find(v => v.id === product.id && v.Size === product.Size)} onChange ={onChangeCheck(product.Size)}/>
                                        </td>
                                        <td>
                                            <img style={{width: '8rem'}} src={product.Images[0].src}/>
                                        </td>
                                        <td>
                                            {product.name}
                                            <br/>
                                            {product.Size}/
                                            {product.quantity}개
                                        </td>
                                        <td>
                                            {product.DeliveryFee ===0 ? '무료배송' : `${product.DeliveryFee}원`}
                                        </td>
                                        <td>
                                            {product.pluralPrice}원
                                        </td>
                                    </tr>)
                                    )
                                    }
                            
                                </tbody>
                            </table>
                            </div>
                        <div>
                            <h5>스토어 주문금액 합계</h5>
                            <span>상품금액 <em>{totalPrice - totalDeliveryFee }원</em> + 배송비 <em>{totalDeliveryFee}원 = </em></span>
                            <span>{totalPrice}원</span>
                        </div>
                       <Payment checkedProducts={checkedProducts}/>
                </Wrapper>
         </AppLayout>
    )
}

export default Cart
