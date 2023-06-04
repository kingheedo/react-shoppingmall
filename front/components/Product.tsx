import React, { FC, useCallback, useState } from 'react';
import Router, { useRouter } from 'next/router';
// import { Card } from 'antd';
import styled from 'styled-components';
import { MainProduct } from '../reducers/reducerTypes/productType';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import apis from '../apis';
import { getUser } from '../context/LoginProvider';
import { AxiosError } from 'axios';
import { Modal } from 'antd';

const CardItem = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`

const ProductWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-right: 80px;
    padding-top: 8px;
`;


const ProductBrand = styled.span`
  font-size: 14px;
  line-height: 20px;
  color: #111111;
  font-weight: 700;
  white-space: nowrap;
`

const ProductName = styled.span`
  font-size: 14px;
  line-height: 20px;
  color: #111111;
  word-wrap: break-word;
  max-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ProductPrice = styled.strong`
  margin-top: 6px;
  color: #111111;
  font-weight: 700;
`

const ProductLikeBtn = styled.button`
  display: block;
  user-select: none;
  cursor: pointer;
  border: none;
  width: 28px;
  height: 28px;
  position: absolute;
  right: 10px;
  bottom: 83px;
`

type Props = {
  product: MainProduct
}
const Product: FC<Props> = ({ product }) => {
  const [show, setShow] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [modal, contextHolder] = Modal.useModal();
  const me = getUser();
  const {mutate: addLike} = useMutation((data: number) => apis.Product.addLike(data),
  {
    onMutate: async(variable) => {
      await queryClient.cancelQueries({queryKey: ['getProducts']})
      const previous = queryClient.getQueryData(['getProducts']);

      queryClient.setQueryData<InfiniteData<Array<any>>>(['getProducts'], (old:any) => {
        console.log('old',old);
        const newData = old?.pages.map((page:any) => 
          page.map((value:any) => {
            if(value.id === variable){
              return {
                ...value,
                Likers: [...value.Likers, {id: me?.id}]
              }
            }else{
              return value
            }
          })
          )

          return {
            ...old,
            pages:newData
          }
      })
      return { previous }
    },
    
    onError: (err: any, param, context) => {
      if(err.response.status = 401){
        router.push('/signin')
      }else{
        queryClient.setQueryData(['getProducts'], context?.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['getProducts']})
    }
  });
  const {mutate: unLike} = useMutation((data: number) => apis.Product.unLike(data),
  {
    onMutate: async(variable) => {
      await queryClient.cancelQueries({queryKey: ['getProducts']})
      const previous = queryClient.getQueryData(['getProducts']);

      queryClient.setQueryData<InfiniteData<Array<any>>>(['getProducts'], (old:any) => {
        const newData = old?.pages.map((page:any) => 
          page.map((value:any) => {
            if(value.id === variable){
              return {
                ...value,
                Likers: [...value.Likers.filter((liker: any) => liker.id !== me?.id)]
              }
            }else{
              return value
            }
          })
          )

          return {
            ...old,
            pages:newData
          }
      })
        return { previous }
    },
    
    onError: (err: any, param, context) => {
      if(err.response.status = 401){
        router.push('/signin')
      }else{
        queryClient.setQueryData(['getProducts'], context?.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['getProducts']})
    }
  });

  const onMouseHover = useCallback(
    () => {
      setShow((prev) => !prev);
    },
    [show],
  );
  const onClickCard = useCallback(
    (id: number) => () => {
      Router.push(`/product/${id}`);
    },
    [],
  );

  const onClickLike = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if(product.Likers.find(value => value.id === me?.id)){
          unLike(product.id);
    }else{
          addLike(product.id);
    }
  }

  return (
    <CardItem
      onClick={onClickCard(product.id)}
      onMouseEnter={onMouseHover}
      onMouseLeave={onMouseHover}
    >
      <Image alt="Images[0]" src={ show ? `http://localhost:3065/${product?.Images[0]?.src}` : `http://localhost:3065/${product?.Images[1]?.src}`}/>
      <ProductLikeBtn style={{background: product.Likers.find(value => value.id === me?.id) ?  `url(${'like-28-fill-red.svg'}) no-repeat center center` : `url('${'like-28-white.svg'}') no-repeat center center`}} onClick={onClickLike}/>
      <ProductWrapper>
        <ProductBrand>8 seconds</ProductBrand>
        <ProductName>{product?.productName}</ProductName>
        <ProductPrice>
          {product.price?.toLocaleString('ko-KR')}
        </ProductPrice>
        
      </ProductWrapper>
      {contextHolder}
    </CardItem>
  );
};

export default Product;
