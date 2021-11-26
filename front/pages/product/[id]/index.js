import React, { useCallback, useEffect, useState } from 'react'
import Router, {useRouter} from 'next/router'
import 'react-redux'
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_PRODUCT_REQUEST } from '../../../reducers/product';
import AppLayout from '../../../components/AppLayout'
import styled from 'styled-components';
import Link from 'next/link';
import { Button, Image, Input, Modal, Result, Select } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { ADD_PRODUCT_CART_REQUEST } from '../../../reducers/cart';
import Review from '../../../components/Review';

const Wrapper = styled.div`
    display:flex;
    padding: 60px 200px;
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
const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
`
const Product = () => {
    const dispatch = useDispatch()
    const {singleProduct,} = useSelector(state => state.product)
    const {cart,} = useSelector(state => state.cart)

    const router = useRouter();
    const {id,color} = router.query;
    const [size, onSelectSize] = useState('사이즈')
    const [quantity, setQuantity] = useState(1)
    const [visibleModal, setVisibleModal] = useState(false)

    
    useEffect(() => {
        dispatch({
            type: LOAD_PRODUCT_REQUEST,
            data : id
        })
    }, [id])

    const onhandleModal = useCallback(
        () => {
            setVisibleModal(false)
            Router.push('/cart')

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
           else{ dispatch({
                type: ADD_PRODUCT_CART_REQUEST,
                data: {productId: id, size, quantity, pluralPrice}
            })
            setVisibleModal(true)
            }
            
            
        },
        [id,quantity,size],
    )
    return (
        <>
        <AppLayout>
            {singleProduct && 
            <Wrapper>
                <ContentWrapper>
                        <div style={{display: 'flex'}}>
                        <Image src= {singleProduct.Images[0].src}/>
                        <Product_Info>
                            <h2 style={{margin: '2rem'}}>{singleProduct.name}</h2>
                            {/* <ul>
                                {singleProduct && singleProduct.Colors.map(Color =>
                                    <li>
                                        <Link href="/product/[id]/[color]" as={`/product/${id}/${Color}`}>
                                            <a>{Color}</a>
                                        </Link>
                                    </li>
                                )}
                            </ul> */}
                            <span  style={{margin: '2rem 0' }}>{singleProduct.price}</span>
                            <em  style={{margin: '2rem 0'}}>{singleProduct.uniqueId}</em>
                            <select
                                style={{margin: '1rem 0', width: 320,textAlign: 'center'}}
                                value={size}
                                onChange={onSelectSize}
                            >
                                <option value="사이즈">사이즈</option>
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                        </select>
                        
                        <div style={{display: 'flex',width: '20rem'}}>
                            <Button onClick={ondecline}>
                                <MinusOutlined />
                            </Button>
                            <Input style={{textAlign: 'center'}} value={quantity} placeholder="Basic usage" />
                            <Button onClick={onincrease}>
                                <PlusOutlined />
                            </Button>
                        </div>
                        
                        <div style={{display:'flex', marginTop : '1rem'}}>
                        <BtnCart onClick={onClickCart(singleProduct.price)} type="Cart">장바구니</BtnCart>
                        <BtnBuy type="BuyNow">바로구매</BtnBuy>
                        </div>
                        </Product_Info>
                        <Modal
                                centered
                                visible={visibleModal}
                                footer={null}
                                onCancel = {() => setVisibleModal(false)}
                                >
                                <Result
                                    status="success"
                                    title= {`장바구니에 상품이 담겼습니다.
                                    장바구니로 이동하시겠습니까?`}
                                    extra={[
                                    <Button onClick={onhandleModal} key="move">확인</Button>,
                                    <Button onClick={() => setVisibleModal(false)} key="cancel">취소</Button>,
                                    ]}
                                />
                        </Modal>
                        </div>
                            
                    <Review product = {singleProduct}/>
                </ContentWrapper>
            </Wrapper>
            }

            
            

        </AppLayout>
        
        </>
    )
}

export default Product
