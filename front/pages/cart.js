import { Breadcrumb,Table, Checkbox, Divider } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AppLayout from '../components/AppLayout'
import Link from 'next/link'
import styled from 'styled-components'
import { CHECK_ALL_PRODUCTS, CHECK_CART_PRODUCT, DELETE_CART_PRODUCT_REQUEST, LOAD_CART_PRODUCTS_REQUEST, UNCHECK_ALL_PRODUCTS, UNCHECK_CART_PRODUCT } from '../reducers/cart'
import Router from 'next/router'
import Payment from '../components/payment'
import { LOAD_USER_REQUEST } from '../reducers/user'
import Paypal from '../components/Paypal'
import { CloseOutlined } from '@ant-design/icons'
import ResultSuccess from '../components/ResultSuccess'

const CheckboxGroup = Checkbox.Group;

const CartTable =  styled(Table)`
.ant-pagination {
    display:none;
},
`
const Wrapper = styled.div`
    width: 100vw;
    height : 100vh-60px;
    display : flex;
    align-items: left;
    flex-direction : column;
    margin: 200px;
`
   
    
    const Cart = () => {
        const {userCart,cartTotalPrice,cartTotalDeliveryFee,} = useSelector(state => state.cart);
        const {me,addPaymentDone} = useSelector(state => state.user);
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

        const onDeleteCartItem = useCallback(
            (cartSingleProductId) => (e) => {
                e.preventDefault();
                dispatch({
                    type: DELETE_CART_PRODUCT_REQUEST,
                    data: {id: cartSingleProductId}
                })
            },
            [],
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
                    <table style={{width: '1100px', }}>
                        <thead style={{borderBottom: '1px solid'}}>
                            <tr>
                                {userCart[0] 
                                ?
                                (
                                <>
                                <th>
                                    <input type="checkbox" style={{width:'20px',height:'20px',}} checked={checkedAllProducts} onChange={onChangeAllCheckedProducts}/>
                                </th>
                                <th>{' '}</th>
                                </>

                                )
                                : null
                            }
                                
                                <th>상품정보</th>
                                <th>배송정보</th>
                                <th>주문금액</th>
                            </tr>
                        </thead>
                        
                        <tbody style={{height:'10rem', textAlign:'center'}} >
                                <tr>
                                    <td>
                                        
                                    </td>
                                </tr>
                        {userCart[0] && userCart.map((cartSingleProduct,index) => 
                                    (<tr key={cartSingleProduct.id}>
                                        <td>
                                            <input style={{width:'20px',height:'20px',}} checked={checkedProductState[index]} type="checkbox" onChange={onChangeCheck(cartSingleProduct.id,index)}/>
                                        </td>
                                        <td>
                                            <img style={{width: '150px', height: '150px'}} src={`http://localhost:3065/${cartSingleProduct.Product.Images[1].src}`}/>
                                        </td>
                                        <td>
                                            {cartSingleProduct.Product.productName}
                                            <br/>
                                            {cartSingleProduct.size}/
                                            {cartSingleProduct.quantity}개
                                        </td>
                                        <td>
                                            {cartSingleProduct.totalPrice > 39900 ? '무료배송' : '2500원' }
                                        </td>
                                        <td>
                                            {cartSingleProduct.totalPrice}원
                                        </td>
                                        <td>
                                            <CloseOutlined onClick={onDeleteCartItem(cartSingleProduct.id)} style={{fontSize:'20px', cursor: 'pointer'}} />
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
                       {/* <Payment checkedProductsList={checkedProductsList}/> */}

                       {userCart[0] && <Paypal checkedProductsList = {checkedProductsList} cartTotalPrice = {cartTotalPrice}/>}

                        {addPaymentDone && <ResultSuccess/>}
                </Wrapper>
         </AppLayout>
    )
}

export default Cart
