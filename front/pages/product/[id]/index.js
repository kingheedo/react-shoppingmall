import React, { useCallback, useEffect, useState } from 'react'
import {useRouter} from 'next/router'
import 'react-redux'
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_PRODUCT_REQUEST } from '../../../reducers/product';
import AppLayout from '../../../components/AppLayout'
import styled from 'styled-components';
import Link from 'next/link';
import { Button, Image, Input, Select } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { ADD_PRODUCT_CART_REQUEST } from '../../../reducers/cart';

const Wrapper = styled.div`
    display:flex;
    padding: 60px 200px;
    width: 1242px;
` 
const Product_Info = styled.div`
   display: flex;
   flex-direction : column;
   padding-left: 30px;
` 
const BtnCart = styled(Button)`
    width: 160px
` 
const BtnBuy = styled(Button)`
    width: 160px
` 
const Product = () => {
    const dispatch = useDispatch()
    const {singleProduct,} = useSelector(state => state.product)
    const {cart} = useSelector(state => state.cart)

    const router = useRouter();
    const {id,color} = router.query;
    const [size, setSize] = useState('사이즈')
    const [quantity, setQuantity] = useState(1)
    useEffect(() => {
        dispatch({
            type: LOAD_PRODUCT_REQUEST
        })
    }, [])

    const onSelectSize  = useCallback(
        (e) => {
            console.log('SIZE',e.target.value)
            setSize(e.target.value)

        },
        [],
    )
    const ondecline = useCallback(
        () => {
            if(quantity === 1){
                return alert('주문가능한 최소 수량입니다.')
            }
            setQuantity(quantity - 1)
        },
        [quantity],
    )
    const onincrease = useCallback(
        () => {
            if(quantity === (singleProduct && singleProduct.Stock)){
                return alert('주문가능한 최대 수량입니다.')
            }
            setQuantity(quantity + 1)
        },
        [quantity],
    )
    const onClickCart = useCallback(
        (price) => () => {
            const pluralPrice = price * quantity;
            console.log('size',size)
            if(size === '사이즈'){
                return alert('사이즈를 선택해주세요.')
            }
            dispatch({
                type: ADD_PRODUCT_CART_REQUEST,
                data: {productId: id, size, quantity, pluralPrice}
            })
        },
        [id,quantity,size],
    )
    return (
        <>
        <AppLayout>
            {singleProduct && 
            <Wrapper>
                <Image src= {singleProduct.Images[0].src}/>
                <Product_Info>
                    <h2>{singleProduct.name}</h2>
                    <ul>
                        {singleProduct && singleProduct.Colors.map(Color =>
                            <li>
                                <Link href="/product/[id]/[color]" as={`/product/${id}/${Color}`}>
                                    <a>{Color}</a>
                                </Link>
                            </li>
                        )}
                    </ul>
                    <span>{singleProduct.price}</span>
                    <em>{singleProduct.uniqueId}</em>
                    <select
                        style={{width: 320,textAlign: 'center'}}
                        value={size}
                        onChange={onSelectSize}
                    >
                        <option value="사이즈">사이즈</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                </select>
                
                <div style={{display: 'flex'}}>
                    <Button onClick={ondecline}>
                        <MinusOutlined />
                    </Button>
                    <Input style={{textAlign: 'center'}} value={quantity} placeholder="Basic usage" />
                    <Button onClick={onincrease}>
                        <PlusOutlined />
                    </Button>
                </div>
                
                <div style={{display:'flex'}}>
                <BtnCart onClick={onClickCart(singleProduct.price)} type="Cart">장바구니</BtnCart>
                <BtnBuy type="BuyNow">바로구매</BtnBuy>
                </div>
                </Product_Info>
            </Wrapper>
            }
            
            

        </AppLayout>
        
        </>
    )
}

export default Product
