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
const { Option } = Select;

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
const Product = () => {
    const dispatch = useDispatch()
    const {singleProduct} = useSelector(state => state.product)
    const router = useRouter();
    const {id} = router.query;
    const [sizeValue, setSizeValue] = useState('')
    const [amount, setAmount] = useState(0)
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
                return null
            }
            setAmount(amount - 1)
        },
        [amount],
    )
    const onincrease = useCallback(
        () => {
            if(amount > (singleProduct && singleProduct.Stock)){
                return alert('최대 수량입니다.')
            }
            setAmount(amount + 1)
        },
        [amount],
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
                        style={{width: 200}}
                        value={sizeValue}
                        onChange={onSelectSize}
                    >
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                </select>
                <Button onClick={ondecline}>
                    <MinusOutlined />
                </Button>
                <Input value={amount} placeholder="Basic usage" />
                <Button onClick={onincrease}>
                    <PlusOutlined />
                </Button>

                </Product_Info>
            </Wrapper>
            }
        </AppLayout>
        
        </>
    )
}

export default Product
