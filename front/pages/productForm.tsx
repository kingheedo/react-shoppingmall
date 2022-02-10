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
import { LOAD_USER_REQUEST, UserState } from '../reducers/asyncActionTypes/userTypes';
import {
  ProductState,
} from '../reducers/asyncActionTypes/productType';
import { registerProduct, removeImages, uploadImages } from '../reducers/dispatchRequestTypes/productDispatchRequest';

const CheckboxGroup = Checkbox.Group;

const FormLayout = styled(Form)`
    
}
    margin: 10rem 40rem;
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
const ImageWrapper = styled.div`
  display:flex;
  align-items: center;
  justify-content: center;
  margin : 2rem 0;

`;
const ImageContainer = styled.div`
  display:flex;
  align-items: center;
  justify-content: space-evenly;

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
      setProductPrice('');
      setProductStock('');
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
    (e:React.ChangeEvent<HTMLInputElement>) => {
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
      checkedSize.forEach((productSize:any) => {
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
    [imagePath, productName, productPrice, productStock, checkedSize],
  );

  const onDeleteImage = useCallback(
    (index:number) => () => {
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
      <FormLayout onFinish={onSubmitForm} encType="multipart/form-data" {...layout} name="nest-messages">
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
                <img
                  src={`http://localhost:3065/${v}`}
                  style={{
                    width: '200px', height: '200px', marginRight: '0.5rem', display: 'block',
                  }}
                  alt={v}
                />
                <Button style={{ marginTop: '0.5rem' }} onClick={onDeleteImage(i)}>삭제</Button>
              </div>
            ))}
          </ImageWrapper>
        </ImageContainer>

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
      </FormLayout>
    </AppLayout>
  );
};
export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  store.dispatch({
    type: LOAD_USER_REQUEST,
  });

  store.dispatch(END);
  await store.sagaTask?.toPromise();
  return {
    props: {},
  };
});
export default ProductForm;
