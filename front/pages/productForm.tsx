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
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import AppLayout from '../components/AppLayout';
import useInput from '../hooks/useInput';
import wrapper from '../store/configureStore';
import { RootState } from '../reducers';
import { UserState } from '../reducers/reducerTypes/userTypes';
import {
  ProductState,
} from '../reducers/reducerTypes/productType';
import { registerProduct, removeImages, uploadImages } from '../reducers/dispatchRequestTypes/productDispatchRequest';
import { loadCartProducts } from '../reducers/dispatchRequestTypes/cartDispatchRequest';
import { loadUser } from '../reducers/dispatchRequestTypes/userDispatchRequest';
import { backUrl } from '../config/backUrl';

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
  const { me, loadUserDone } = useSelector<RootState, UserState>((state) => state.user);
  const { imagePath, registerProductDone } = useSelector<RootState, ProductState>((state) => state.product);

  const [productName, onChangeName, setProductName] = useInput('');
  const [productPrice, onChangePrice, setProductPrice] = useInput(0);
  const [productStock, onChangeStock, setProductStock] = useInput(0);
  const checkedOption = ['SM', 'M', 'L', 'XL'];
  const [allChecked, setAllChecked] = useState(false);
  const [checkedSize, setCheckedSize] = useState<CheckboxValueType[]>([]);
  const dispatch = useDispatch();
  const imageUpload = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (registerProductDone) {
      setProductName('');
      setProductPrice(0);
      setProductStock(0);
      setAllChecked(false);
      setCheckedSize([]);
    }
  }, [registerProductDone]);

  useEffect(() => {
    if (!me) {
      Router.push('/');
    }
  }, [me, loadUserDone]);

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
      dispatch(uploadImages(imageFormData));
      console.log(imageFormData);
    },
    [],
  );

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (imagePath.length !== 2 || !productName || !productPrice || !productStock || !checkedSize[0]) {
        return alert('빈칸이 존재하거나 이미지는 2개 필요합니다.');
      }
      const formData = new FormData();
      imagePath.forEach((image) => {
        formData.append('image', image);
      });
      checkedSize.forEach((productSize: any) => {
        formData.append('productSize', productSize);
      });
      formData.append('productName', productName);
      formData.append('productPrice', productPrice);
      formData.append('productStock', productStock);
      dispatch(registerProduct(formData));
      setProductName('');
      setProductPrice('');
      setProductStock('');
      setAllChecked(false);
      setCheckedSize([]);
    },
    [imagePath, productName, productPrice, productStock, allChecked, checkedSize],
  );

  const onDeleteImage = useCallback(
    (index: number) => () => {
      dispatch(removeImages(index));
    },
    [],
  );

  const onChageCheckBox = useCallback(
    (check: CheckboxValueType[]) => {
      setCheckedSize(check);
      if (checkedSize.length === checkedOption.length) {
        setAllChecked((prev) => !prev);
      }
    },
    [checkedSize],
  );

  const onChangeAllCheck = useCallback(
    (e: CheckboxChangeEvent) => {
      setCheckedSize(e.target.checked ? checkedOption : []);
      setAllChecked((prev) => !prev);
    },
    [],
  );
  return (
    <AppLayout>
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
                {imagePath?.map((v, i) => (
                  <div key={v}>
                    <Image
                      src={`${backUrl}/${v}`}
                      alt={v}
                    />
                    <Button style={{ marginTop: '0.5rem' }} onClick={onDeleteImage(i)}>삭제</Button>
                  </div>
                ))}
              </ImageWrapper>
            </ImageContainer>

            <TextFormItem>
              <FormItem name={['name']} label="상품명" rules={[{ type: 'string', required: true }]}>
                <Input value={productName} onChange={onChangeName} />
              </FormItem>

              <FormItem name={['price']} label="상품가격" rules={[{ required: true }]}>
                <Input min="1" value={productPrice} type="number" onChange={onChangePrice} />
              </FormItem>

              <FormItem name={['stock']} label="재고수량" rules={[{ required: true }]}>
                <Input min="1" value={productStock} type="number" onChange={onChangeStock} />
              </FormItem>

              <FormItem>
                <Checkbox onChange={onChangeAllCheck} checked={allChecked}>
                  Check all
                </Checkbox>
                <Divider />
                <CheckboxGroup options={checkedOption} value={checkedSize} onChange={onChageCheckBox} />
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
    </AppLayout>
  );
};
export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  store.dispatch(loadUser());
  store.dispatch(loadCartProducts());
  store.dispatch(END);
  await store.sagaTask?.toPromise();
  return {
    props: {},
  };
});
export default ProductForm;
