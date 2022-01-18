import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import {
  Form,
  Button,
  Input,
  Checkbox,
  Divider,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AppLayout from '../components/AppLayout';
import { useDispatch, useSelector,} from 'react-redux';
import { REGISTER_PRODUCT_REQUEST, REMOVE_IMAGE, UPLOAD_IMAGES_REQUEST } from '../reducers/product';
import Router from 'next/router';
import useInput from '../hooks/useInput';
import { LOAD_USER_REQUEST } from '../reducers/user';
import axios from 'axios';
import wrapper from '../store/configureStore';
import { END } from 'redux-saga';

const CheckboxGroup = Checkbox.Group;

const FormLayout= styled(Form)`
    
}
    margin: 10rem 40rem;
`

const FormItem = styled(Form.Item)`
  &: first-child{
    margin-right : 1rem;
  }
  .ant-form-item-label {
    text-align: left;
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

const ProductForm = () => {
  const {me, loadUserDone,} = useSelector(state => state.user)
  const {imagePath,registerProductDone} = useSelector(state => state.product)

  const [productName, onChangeName, setProductName] = useInput('')
  const [productPrice, onChangePrice, setProductPrice] = useInput('')
  const [productStock , onChangeStock, setProductStock] = useInput('')
  const checkedOption = ['SM','M','L','XL'];
  const [allChecked, setAllChecked] = useState(false)
  const [checkedSize, setCheckedSize] = useState([])
  const dispatch = useDispatch()
  const imageUpload = useRef()
  
  useEffect(() => {
    if(registerProductDone){
      setProductName('')
      setProductPrice('')
      setProductStock('')
      setAllChecked(false)
      setCheckedSize([])
    }
  }, [registerProductDone])

  useEffect(() => {
    if(!me){
      Router.push('/')
    }
  }, [me,loadUserDone])

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
      e.preventDefault();
      if(imagePath.length !== 2 || !productName || !productPrice || !productStock || !checkedSize[0]){
        return alert('빈칸이 존재하거나 이미지는 2개 필요합니다.')
      }
      const formData = new FormData();
      imagePath.forEach(image =>{
        formData.append('image', image)
      });
      checkedSize.forEach(productSize =>{
        formData.append('productSize', productSize )
      })
      formData.append('productName', productName)
      formData.append('productPrice', productPrice)
      formData.append('productStock', productStock)
      
      dispatch({
        type: REGISTER_PRODUCT_REQUEST,
        data : formData
      })
      setProductName('')
      setProductPrice('')
      setProductStock('')
      setAllChecked(false)
      setCheckedSize([])
    },
    [imagePath,productName,productPrice,productStock,checkedSize],
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

const onChageCheckBox = useCallback(
  (check) => {
    setCheckedSize(check)
    if(checkedSize.length === checkedOption.length){
      setAllChecked(prev => !prev)
    }
  },
  [checkedSize],
)

const onChangeAllCheck = useCallback(
  (e) => {
    setCheckedSize(e.target.checked ? checkedOption : []);
    setAllChecked(prev => !prev);
  },
  [],
)
    return (
        <AppLayout>
            <FormLayout onFinish={onSubmitForm} encType="multipart/form-data"  {...layout} name="nest-messages">
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
                         <div key={v.id}>
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

                <FormItem name={['price']} label="상품가격" rules={[{required: true, }]}>
                    <Input min ='1' value={productPrice} type='number' onChange={onChangePrice} />
                </FormItem>

                <FormItem name={['stock']} label="재고수량" rules={[{required: true, }]}>
                    <Input min ='1' value={productStock}  type='number' onChange={onChangeStock}/>
                </FormItem>

                <FormItem>
                  <Checkbox onChange={onChangeAllCheck} checked= {allChecked}>
                    Check all
                  </Checkbox>
                  <Divider />
                  <CheckboxGroup options={checkedOption} value={checkedSize} onChange={onChageCheckBox}/>
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
export const getServerSideProps = wrapper.getServerSideProps( (store) => async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if(context.req && cookie){
    axios.defaults.headers.Cookie = cookie;
  }
  store.dispatch({
    type: LOAD_USER_REQUEST,
  })
  
  store.dispatch(END);
  await store.sagaTask.toPromise();
})
export default ProductForm
