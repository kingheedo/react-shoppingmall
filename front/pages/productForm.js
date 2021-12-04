import React, { useCallback, useRef } from 'react'
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

const FormLayout= styled(Form)`
    width: 700px;
    margin: 10rem 40rem;
`

const FormItem = styled(Form.Item)`
  &: first-child{
    margin-left: 150px;
  }
`
const FirstFormItem = styled.div`
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  cursor: pointer;
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
  const imageUpload = useRef()
    const onFinish = (values) => {
    console.log(values);
  };
  const onClickImageUpload = useCallback(
    (e) => {
      imageUpload.current.click();
    },
    [imageUpload.current],
  )
  const onChangeImages = useCallback(
    (e) => {
      console.log('images',e.target.files)
    },
    [],
  )

    return (
        <AppLayout>
            <FormLayout encType="multipart/form-data"  {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                   <FormItem>
                    <FirstFormItem onClick={onClickImageUpload}>
                      <PlusOutlined />
                        Upload
                    </FirstFormItem>
                    <input type="file" ref={imageUpload} multiple hidden onChange={onChangeImages}/>
                </FormItem>
                <FormItem name={['name']} label="상품명" rules={[{type: 'string', required: true }]}>
                    <Input />
                </FormItem>
                <FormItem name={['price']} label="상품가격" rules={[{required: true }]}>
                    <Input type='number' />
                </FormItem>
                <FormItem name={['stock']} label="재고수량" rules={[{required: true,  min: 1 }]}>
                    <InputNumber type='number' />
                </FormItem>
                <FormItem wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </FormItem>
            </FormLayout>
        </AppLayout>
    )
}

export default ProductForm
