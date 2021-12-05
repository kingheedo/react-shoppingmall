import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import {
  Form,
  InputNumber,
  Button,
  Upload,
  Input,
  
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AppLayout from '../components/AppLayout';
import { useDispatch, useSelector,} from 'react-redux';
import { REGISTER_PRODUCT_REQUEST, REMOVE_IMAGE, UPLOAD_IMAGES_REQUEST } from '../reducers/product';
import Router from 'next/router';
import useInput from '../hooks/useInput';

const FormLayout= styled(Form)`
    
}
    margin: 10rem 40rem;
`

const FormItem = styled(Form.Item)`
  &: first-child{
    margin-right : 1rem;
  }
`
const FirstFormItem = styled.div`
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  cursor: pointer;
`
const ImageWrapper = styled.div`
  display:flex;
  align-items: center;
  justify-content: center;
  margin : 2rem 0;

`
const ImageContainer = styled.div`
  display:flex;
  align-items: center;
  justify-content: space-evenly;

`

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label} 이 필요합니다!',
  
  
  stock: {
    range: '${label}은 최소 ${min} 이상이어야 합니다.',
  },
};

const ProductForm = () => {
  const {me} = useSelector(state => state.user)
  const {imagePath} = useSelector(state => state.product)

  const [productName, onChangeName] = useInput('')
  const [productPrice, onChangePrice] = useInput('')
  const [productStock , onChangeStock] = useInput('')

  const dispatch = useDispatch()
  const imageUpload = useRef()
  useEffect(() => {
    if(!me){
      Router.push('/')
    }
  }, [me])
  const onClickImageUpload = useCallback(
    () => {
      imageUpload.current.click();
    },
    [imageUpload.current],
  )
  const onChangeImages = useCallback(
        (e) => {
            console.log('images', e.target.files);
            const imageFormData = new FormData();
            Array.from(e.target.files).forEach(f =>
              imageFormData.append('image',f))
            dispatch({
                type: UPLOAD_IMAGES_REQUEST,
                data: imageFormData,
            });
            console.log(imageFormData)
        },
        [],
    );
  const onSubmitForm = useCallback(
    (e) => {
      if(imagePath.length !== 2 || !productName || !productPrice || !productStock){
        return alert('빈칸이 존재하거나 이미지는 2개 필요합니다.')
      }
      const formData = new FormData();
      imagePath.forEach(image =>{
        formData.append('image', image)
      });
      formData.append('productName', productName)
      formData.append('productPrice', productPrice)
      formData.append('productStock', productStock)
      console.log(formData)
      dispatch({
        type: REGISTER_PRODUCT_REQUEST,
        data : formData
      })
    },
    [imagePath,productName,productPrice,productStock],
  )
const onDeleteImage = useCallback(
  (index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index
    })
  },
  [],
)
    return (
        <AppLayout>
            <FormLayout onFinish={onSubmitForm} encType="multipart/form-data"  {...layout} name="nest-messages" validateMessages={validateMessages}>
                   <ImageContainer>
                     <FormItem>
                    <input type="file" name="image" ref={imageUpload} multiple hidden onChange={onChangeImages}/>
                    <FirstFormItem onClick={onClickImageUpload}>
                      <PlusOutlined />
                        Upload
                    </FirstFormItem>
                    
                </FormItem>
                 <ImageWrapper>
                {imagePath && imagePath.map((v,i) => 
                        (
                         <div>
                            <img src={`http://localhost:3065/${v}`} style={{width: '200px', height:'200px', marginRight: '0.5rem',display: 'block'}} alt ={v}/>
                            <Button style={{marginTop:'0.5rem'}} onClick= {onDeleteImage(i)}>삭제</Button>
                         </div>
                        )
                      )}
                </ImageWrapper>
                   </ImageContainer>
                <FormItem name={['name']} label="상품명" rules={[{type: 'string', required: true }]}>
                    <Input value={productName} onChange={onChangeName} />
                </FormItem>
                <FormItem name={['price']} label="상품가격" rules={[{required: true }]}>
                    <Input value={productPrice} type='number' onChange={onChangePrice} />
                </FormItem>
                <FormItem name={['stock']} label="재고수량" rules={[{required: true,  min: 1 }]}>
                    <Input min = '1' value={productStock}  type='number' onChange={onChangeStock}/>
                </FormItem>
                <FormItem wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button onClick={onSubmitForm} type="primary" htmlType="submit">
                        Submit
                    </Button>
                </FormItem>
            </FormLayout>
        </AppLayout>
    )
}

export default ProductForm
