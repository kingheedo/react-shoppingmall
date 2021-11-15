import { Breadcrumb,Table,Image, Checkbox } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AppLayout from '../components/AppLayout'
import Link from 'next/link'
import styled from 'styled-components'

const CartTable =  styled(Table)`
.ant-pagination {
    display:none;
},
`
   
    
    const Cart = () => {
        const {products} = useSelector(state => state.cart)
        const dispatch = useDispatch()
        const [checkedProducts, setcheckedProducts] = useState([])

        useEffect(() => {
            console.log('checkedProducts',checkedProducts)
            // dispatch({
            //     type: LOAD_ALL_PRICE_REQUEST,
            //     data :checkedProducts[id].productPluralPrice
            // })
        }, [checkedProducts])
        const onChangeCheck = useCallback(
           (productPluralPrice) => (e) => {
                console.log('target', e.target);
                if(e.target.checked){
                setcheckedProducts([...checkedProducts,{id: e.target.id, productPluralPrice
                }])
            }else{
                setcheckedProducts(checkedProducts.filter( v => v.id !== e.target.id))
            }
            },
            [checkedProducts],
        )

        
    return (
        <AppLayout>
                <Breadcrumb style= {{margin: '80px'}}>
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
                <div style={{margin:'80px',  }}>
                <table style={{width: '1100px', border: '1px solid'}}>
                    <thead style={{border: '1px solid'}}>
                        <tr>
                            <th>{' '}</th>
                            <th>{' '}</th>
                            <th style={{border: '1px solid'}}>상품정보</th>
                            <th style={{border: '1px solid'}}>배송정보</th>
                            <th style={{border: '1px solid'}}>주문금액</th>
                        </tr>
                    </thead>
                    
                    <tbody style={{height:'10rem', textAlign:'center'}} >
                    {products && products.map(product => 
                                <tr style={{border: '1px solid'}}>
                                    <td>
                                        <Checkbox id={product.id} value={checkedProducts} onChange ={onChangeCheck(product.pluralPrice)}/>
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
                                        {product.price > 40000 ? '무료배송' : `${2500}원`}
                                    </td>
                                    <td>
                                        {product.pluralPrice}원
                                    </td>
                                </tr>
                                )}
                        
                    </tbody>
                    </table>
                </div>
                    {/* {products && products.map(product => {
                        Price += product.price
                        Price > 1000000 ? Price : Price += 2500
                        return Price
                    }
                        )} */}
                {/* </div> */}
         </AppLayout>
    )
}

export default Cart
