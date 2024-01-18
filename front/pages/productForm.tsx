import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import styled from 'styled-components';
import {
  Form,
  Button,
  Input,
  Checkbox,
  Divider,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Router from 'next/router';
import axios from 'axios';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import AppLayout from '../components/layout';
import useInput from '../hooks/useInput';

const CheckboxGroup = Checkbox.Group;

const Container = styled.div`
    width: 80vw;
    height: 100%;
    margin: 6rem auto 0;
    `;

const Wrapper = styled.div`
    justify-content: center;
    display: flex;
    align-items: center;
    `;

const FormItem = styled(Form.Item)`
  &: first-child{
    margin-right : 1rem;
  }
  .ant-form-item-label {
    text-align: left;
  }
`;
const FirstFormItem = styled.div`
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  cursor: pointer;
`;

const TextFormItem = styled.div`
  .ant-input { 
    width:  28vw;
  }
  @media only screen and (max-width: 1160px) {
    .ant-input { 
    width:  40vw;
`;
const ImageWrapper = styled.div`
  display: flex;

`;
const ImageContainer = styled.div`
  display: flex;
  margin-bottom: 4rem;
  
  @media only screen and (max-width: 670px) {
        flex-direction: column;
        }
  
`;
const Image = styled.img`
  width: 200px;
  height: 200px;
  margin-right: 0.5rem;
  display: block;
`;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const ProductForm = () => {

  const [productName, onChangeName, setProductName] = useInput('');
  const [productPrice, onChangePrice, setProductPrice] = useInput(0);
  const [productStock, onChangeStock, setProductStock] = useInput(0);
  const [indeterminate, setIndeterminate] = useState(true);
  const checkedOption = ['SM', 'M', 'L', 'XL'];
  const [allChecked, setAllChecked] = useState(false);
  const [checkedSize, setCheckedSize] = useState<CheckboxValueType[]>([]);
  const imageUpload = useRef<HTMLInputElement>(null);

  const onClickImageUpload = useCallback(
    () => {
      imageUpload.current?.click();
    },
    [imageUpload.current],
  );

  const onChangeImages = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log('images', e.target.files);
      const imageFormData = new FormData();
      if (e.target.files) {
        Array.from(e.target.files).forEach((f) => imageFormData.append('image', f));
      }
      // dispatch(uploadImages(imageFormData));
      console.log(imageFormData);
    },
    [],
  );
  console.log('productName',productName);
  console.log('productPrice',productPrice);
  console.log('productStock',productStock);
  console.log('checkedSize',checkedSize);
  const onSubmitForm = useCallback(
    (e: any) => {
      e.preventDefault();
      // if (imagePath.length !== 2 || !productName || !productPrice || !productStock || !checkedSize[0]) {
      //   return alert('빈칸이 존재하거나 이미지는 2개 필요합니다.');
      // }

      // const formData = new FormData();
      // imagePath.forEach((image: string) => {
      //   formData.append('image', image);
      // });
      // checkedSize.forEach((productSize: any) => {
      //   formData.append('productSize', productSize);
      // });
      // formData.append('productName', productName);
      // formData.append('productPrice', productPrice);
      // formData.append('productStock', productStock);
      // dispatch(registerProduct(formData));
      // setProductName('');
      // setProductPrice('');
      // setProductStock('');
      // setAllChecked(false);
      // setCheckedSize([]);
    },
    [productName, productPrice, productStock, allChecked, checkedSize],
  );

  const onDeleteImage = useCallback(
    (index: number) => () => {
      // dispatch(removeImage(index));
    },
    [],
  );

  const onChangeCheckBox = useCallback(
    (check: CheckboxValueType[]) => {
      console.log('checked', check);
      setCheckedSize(check);
      setIndeterminate(!!check.length && check.length < checkedOption.length);
      setAllChecked(check.length === checkedOption.length);
    },
    [checkedSize],
  );

  const onChangeAllCheck = useCallback(
    (e: CheckboxChangeEvent) => {
      setCheckedSize(e.target.checked ? checkedOption : []);
      setAllChecked(e.target.checked);
      setIndeterminate(false);
    },
    [],
  );
  
  return (
    <Container>
      <Wrapper>
        <Form onFinish={onSubmitForm} encType="multipart/form-data" {...layout} name="nest-messages">
          <ImageContainer>
            <FormItem>
              <input type="file" name="image" ref={imageUpload} multiple hidden onChange={onChangeImages} />
              <FirstFormItem onClick={onClickImageUpload}>
                <PlusOutlined />
                  Upload
              </FirstFormItem>

            </FormItem>
            <ImageWrapper>
              {/* {imagePath?.map((v: string, i: number) => (
                <div key={v}>
                  <Image
                    src={v}
                    alt={v}
                  />
                  <Button style={{ marginTop: '0.5rem' }} onClick={onDeleteImage(i)}>삭제</Button>
                </div>
              ))} */}
            </ImageWrapper>
          </ImageContainer>

          <TextFormItem>
            <FormItem name={['상품명']} label="상품명" rules={[{ type: 'string', required: true, message: '상품명을 입력해주세요.' }]}>
              <Input value={productName} onChange={onChangeName} />
            </FormItem>

            <FormItem name={['상품가격']} label="상품가격" rules={[{ type: 'number', required: true, message: '상품가격을 입력해주세요.' }]}>
              <Input value={productPrice} type="number" onChange={onChangePrice} />
            </FormItem>

            <FormItem name={['재고수량']} label="재고수량" rules={[{ type: 'number', required: true, message: '재고수량을 입력해주세요.' }]}>
              <Input min="1" value={productStock} type="number" onChange={onChangeStock} />
            </FormItem>

            <FormItem>
              <Checkbox indeterminate={indeterminate} onChange={onChangeAllCheck} checked={allChecked}>
                  Check all
              </Checkbox>
              <Divider />
              <CheckboxGroup options={checkedOption} value={checkedSize} onChange={onChangeCheckBox} />
            </FormItem>

            <FormItem wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button onClick={onSubmitForm} type="primary" htmlType="submit">
                  Submit
              </Button>
            </FormItem>
          </TextFormItem>
        </Form>
      </Wrapper>
    </Container>
  );
};
export default ProductForm;
