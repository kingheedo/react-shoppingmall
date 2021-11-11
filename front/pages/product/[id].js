import React, { useCallback, useEffect, useState } from 'react'
import {useRouter} from 'next/router'
import 'react-redux'
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_PRODUCT_REQUEST } from '../../reducers/product';
import AppLayout from '../../components/AppLayout'
import styled from 'styled-components';
import Link from 'next/link';
import { Button, Input, Select } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { ADD_PRODUCT_CART_REQUEST } from '../../reducers/user';

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
    const {cart} = useSelector(state => state.user)
    const router = useRouter();
    const {id} = router.query;
    const [sizeValue, setSizeValue] = useState('사이즈')
    const [amount, setAmount] = useState(1)
    useEffect(() => {
        dispatch({
            type: LOAD_PRODUCT_REQUEST
        })
    }, [])

    const onSelectSize  = useCallback(
        (e) => {
            setSizeValue(e.target.value)

        },
        [],
    )
    const ondecline = useCallback(
        () => {
            if(amount === 1){
                return alert('주문가능한 최소 수량입니다.')
            }
            setAmount(amount - 1)
        },
        [amount],
    )
    const onincrease = useCallback(
        () => {
            if(amount === (singleProduct && singleProduct.Stock)){
                return alert('주문가능한 최대 수량입니다.')
            }
            setAmount(amount + 1)
        },
        [amount],
    )
    const onClickCart = useCallback(
        () => {
            dispatch({
                type: ADD_PRODUCT_CART_REQUEST
            })
        },
        [],
    )
    return (
        <>
        <AppLayout>
            {singleProduct && 
            <Wrapper>
                <img src= {singleProduct.Images[0].src}/>
                <Product_Info>
                    <h2>{singleProduct.name}</h2>
                    <span>{singleProduct.price}</span>
                    <em>{singleProduct.uniqueId}</em>
                    <select
                        style={{width: 320,textAlign: 'center'}}
                        value={sizeValue}
                        onChange={onSelectSize}
                    >
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                </select>
                
                <div style={{display: 'flex'}}>
                    <Button onClick={ondecline}>
                        <MinusOutlined />
                    </Button>
                    <Input style={{textAlign: 'center'}} value={amount} placeholder="Basic usage" />
                    <Button onClick={onincrease}>
                        <PlusOutlined />
                    </Button>
                </div>
                
                <div style={{display:'flex'}}>
                <BtnCart onClick={onClickCart} type="Cart">장바구니</BtnCart>
                <BtnBuy type="BuyNow">바로구매</BtnBuy>
                </div>
                </Product_Info>
            </Wrapper>
            }
            
            <div>
                {cart && cart.map(v => 
                    <div>
                        {v.Product.name}
                        {v.Product.price}
                    </div>)}
            </div>

        </AppLayout>
        
        </>
    )
}

export default Product
