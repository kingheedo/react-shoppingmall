import { Breadcrumb,Table, Checkbox } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AppLayout from '../components/AppLayout'
import Link from 'next/link'
import styled from 'styled-components'
import { CHECK_ALL_PRODUCTS, CHECK_CART_PRODUCT, LOAD_CART_PRODUCTS_REQUEST, UNCHECK_ALL_PRODUCTS, UNCHECK_CART_PRODUCT } from '../reducers/cart'
import Router from 'next/router'
import Payment from '../components/payment'
import { LOAD_USER_REQUEST } from '../reducers/user'

const CheckboxGroup = Checkbox.Group;

const CartTable =  styled(Table)`
.ant-pagination {
    display:none;
},
`
const Wrapper = styled.div`
    margin: 200px;
`
   
    
    const Cart = () => {
        const {userCart,cartTotalPrice,cartTotalDeliveryFee,} = useSelector(state => state.cart);
        const {me} = useSelector(state => state.user);
        const dispatch = useDispatch()
        const [checkedProductsList, setcheckedProductsList] = useState(userCart);
        const [checkedAllProducts, setCheckedAllProducts] = useState(true);
        const [checkedProductState, setCheckedProductState] = useState(
            new Array(userCart.length).fill(true)
        )
        // const checkItem = checkedProductsList.find(v => v.id === cartSingleProduct.id && v.size === cartSingleProduct.size)
        useEffect(() => {
            dispatch({
                type: LOAD_USER_REQUEST
            })
        }, [])
        useEffect(() => {
            dispatch({
                type: LOAD_CART_PRODUCTS_REQUEST
            })
        }, [])
        useEffect(() => {
            dispatch({
                type: CHECK_ALL_PRODUCTS,
            })
        }, [])

        useEffect(() => {
            if(!me){
                Router.push('/signin')
            }
        }, [me])
        
        const onChangeAllCheckedProducts = useCallback(
            (e) => {
                setCheckedAllProducts(prev => !prev)
                if(e.target.checked){
                    setCheckedProductState(checkedProductState.fill(true))
                    setcheckedProductsList(userCart)
                    dispatch({
                        type: CHECK_ALL_PRODUCTS,
                    })
                    
                }else{
                    setCheckedProductState(checkedProductState.fill(false))
                    setcheckedProductsList('')
                    dispatch({
                        type: UNCHECK_ALL_PRODUCTS,
                    })
                    
                }
                
            },
            [checkedProductsList,userCart],
        )
        const onChangeCheck = useCallback(
           (productId,index) => (e) => {
                const updateCheckState = checkedProductState.map((productState,i) => 
                    i === index ? !productState : productState
                );
                setCheckedProductState(updateCheckState)
                setCheckedAllProducts(updateCheckState.every(v => v===true))
                const checkProduct = userCart.find(product => product.id === productId)
                if(e.target.checked){
                setcheckedProductsList([...checkedProductsList,checkProduct])
                dispatch({
                type: CHECK_CART_PRODUCT,
                data : {id : productId,}
                })
            }else{
               setcheckedProductsList(checkedProductsList.filter( v => v.id !== productId))
               dispatch({
                type: UNCHECK_CART_PRODUCT,
                data : {id : productId,}
            })
            }

            },
            [checkedProductsList,userCart,checkedProductState],
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
                        <thead>
                            <tr>
                                {userCart[0] 
                                ?
                                (
                                <>
                                <th style={{borderRight: '1px solid'}}>
                                    <Checkbox checked={checkedAllProducts} onChange={onChangeAllCheckedProducts}/>
                                </th>
                                <th style={{borderRight: '1px solid'}}>{' '}</th>
                                </>

                                )
                                : null
                            }
                                
                                <th style={{borderRight: '1px solid'}}>상품정보</th>
                                <th style={{borderRight: '1px solid'}}>배송정보</th>
                                <th style={{borderRight: '1px solid'}}>주문금액</th>
                            </tr>
                        </thead>
                        
                        
                        <tbody style={{height:'10rem', textAlign:'center'}} >
                                <tr>
                                    <td>
                                        
                                    </td>
                                </tr>
                        {userCart[0] && userCart.map((cartSingleProduct,index) => 
                                    (<tr key={cartSingleProduct.id} style={{border: '1px solid'}}>
                                        <td>
                                            <input checked={checkedProductState[index]} type="checkbox" onChange={onChangeCheck(cartSingleProduct.id,index)}/>
                                        </td>
                                        <td>
                                            <img style={{width: '8rem'}} src={`http://localhost:3065/${cartSingleProduct.Product.Images[1].src}`}/>
                                        </td>
                                        <td>
                                            {cartSingleProduct.Product.productName}
                                            <br/>
                                            {cartSingleProduct.size}/
                                            {cartSingleProduct.quantity}개
                                        </td>
                                        <td>
                                            {cartSingleProduct.totalPrice > 3000 ? '무료배송' : '2500원' }
                                        </td>
                                        <td>
                                            {cartSingleProduct.totalPrice}원
                                        </td>
                                    </tr>)
                                    )
                                    }
                            
                                </tbody>
                            </table>
                            </div>
                        <div>
                            <h5>스토어 주문금액 합계</h5>
                            <span>상품금액 <em>{cartTotalPrice-cartTotalDeliveryFee}원</em> + 배송비 <em>{cartTotalDeliveryFee}원 = </em></span>
                            <span>{cartTotalPrice}원</span>
                        </div>
                       {/* <Payment checkedProducts={checkedProductsList}/> */}
                </Wrapper>
         </AppLayout>
    )
}

export default Cart
