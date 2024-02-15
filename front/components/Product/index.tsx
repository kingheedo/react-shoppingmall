/* eslint-disable no-cond-assign */
/* eslint-disable no-constant-condition */
import React, { FC, useCallback, useState } from 'react';
import Router, { useRouter } from 'next/router';
import styled from 'styled-components';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from 'antd';
import { GetSingleProductRes } from '../../apis/product/schema';
import { getUser } from '../../context/AuthProvider';
import apis from '../../apis';

const CardItem = styled.li`
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
`;

const Image = styled.img`
  width: 100%;
  height: 450px;
  object-fit: cover;
  display: block;
  transition: opacity 0.2s ease-out;
  opacity: 1;
  &:hover {
    opacity: 0;
  }
`;
const ImageHover = styled.img`
  width: 100%;
  height: 450px;
  object-fit: cover;
  display: block;
  transition: opacity 0.2s ease-out;
  opacity: 0;
  position: absolute;
  bottom: 0;
  left: 0;
  &:hover {
    opacity: 1;
  }
`;

const ProductImgWrapper = styled.div`
  position: relative;
`;

const Rank = styled.span`
    font-size: var(--fontD);
    line-height: var(--fontDL);
    color: var(--gray900);
    font-weight: 700;
`;

const ProductInfoWrapper = styled.div`
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
`;

const ProductName = styled.span`
  font-size: 14px;
  line-height: 20px;
  color: #111111;
  word-wrap: break-word;
  max-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductPrice = styled.strong`
  margin-top: 6px;
  color: #111111;
  font-weight: 700;
`;

const ProductLikeBtn = styled.button`
  display: block;
  user-select: none;
  cursor: pointer;
  border: none;
  width: 28px;
  height: 28px;
  position: absolute;
  right: 10px;
  bottom: 10px;
`;
const ProductScore = styled.div`
  
`;
const HeartWrapper = styled.div`
  display: flex;
`;

const Heart = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 2px;
`;
const HeartTxt = styled.em`
  color: var(--gray450);
  font-size: 11px;
  line-height: 17px;
  font-weight: 500;
  font-style: inherit;
`;

interface IProductProps {
  idx: number;
  product: Omit<GetSingleProductRes, 'Sizes'>;
}

//메인페이지 상품
const Product = ({ idx,product }:IProductProps) => {
  const [show, setShow] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [modal, contextHolder] = Modal.useModal();
  const me = getUser();
  const { mutate: addLike } = useMutation((data: number) => apis.Product.addLike(data),
    {
      onMutate: async(variable) => {
        await queryClient.cancelQueries({ queryKey: ['getProducts'] });
        const previous = queryClient.getQueryData(['getProducts']);

        queryClient.setQueryData<InfiniteData<Array<any>>>(['getProducts'], (old:any) => {
          const newData = old?.pages.map((page:any) => 
            page.map((value:any) => {
              if (value.id === variable) {
                return {
                  ...value,
                  Likers: [...value.Likers, { id: me?.info.id }]
                };
              } else {
                return value;
              }
            })
          );

          return {
            ...old,
            pages: newData
          };
        });
        
        return { previous };
      },
    
      onError: (err: any, param, context) => {
        if (err.response.status = 401) {
          router.push('/signin');
        } else {
          queryClient.setQueryData(['getProducts'], context?.previous);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['getProducts'] });
      }
    });
  const { mutate: unLike } = useMutation((data: number) => apis.Product.unLike(data),
    {
      onMutate: async(variable) => {
        await queryClient.cancelQueries({ queryKey: ['getProducts'] });
        const previous = queryClient.getQueryData(['getProducts']);

        queryClient.setQueryData<InfiniteData<Array<any>>>(['getProducts'], (old:any) => {
          const newData = old?.pages.map((page:any) => 
            page.map((value:any) => {
              if (value.id === variable) {
                return {
                  ...value,
                  Likers: [...value.Likers.filter((liker: any) => liker.id !== me?.info.id)]
                };
              } else {
                return value;
              }
            })
          );

          return {
            ...old,
            pages: newData
          };
        });
        
        return { previous };
      },
    
      onError: (err: any, param, context) => {
        if (err.response.status = 401) {
          router.push('/signin');
        } else {
          queryClient.setQueryData(['getProducts'], context?.previous);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['getProducts'] });
      }
    });

  const onMouseHover = useCallback(
    () => {
      setShow((prev) => !prev);
    },
    [show]
  );
  const onClickCard = useCallback(
    (id: number) => () => {
      Router.push(`/product/${id}`);
    },
    []
  );

  const onClickLike = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.Likers.find(value => value.id === me?.info.id)) {
      unLike(product.id);
    } else {
      addLike(product.id);
    }
  };

  return (
    <CardItem
      onClick={onClickCard(product.id)}
      onMouseEnter={onMouseHover}
      onMouseLeave={onMouseHover}
    >
      <ProductImgWrapper>
        <Rank>
          {idx}
        </Rank>
        <Image alt={`${product?.Images[0]}`} src={`http://localhost:3065/${product?.Images[0]?.src}`}/>
        <ImageHover alt={`${product?.Images[1]}`} src={`http://localhost:3065/${product?.Images[1]?.src}`}/>
        <ProductLikeBtn style={{ background: product.Likers.find(value => value.id === me?.info.id) ? `url(${'like-28-fill-red.svg'}) no-repeat center center` : `url('${'like-28-white.svg'}') no-repeat center center` }} onClick={onClickLike}/>
      </ProductImgWrapper>
      <ProductInfoWrapper>
        <ProductBrand>8 seconds</ProductBrand>
        <ProductName>{product?.productName}</ProductName>
        <ProductPrice>
          {product.price?.toLocaleString('ko-KR')}
        </ProductPrice>
        <ProductScore>
          <HeartWrapper>
            <Heart src={'./like-fill-gray.svg'} alt="like-fill-gray" />
            <HeartTxt>{product.Likers.length}</HeartTxt>
          </HeartWrapper>
        </ProductScore>
      </ProductInfoWrapper>
      {contextHolder}
    </CardItem>
  );
};

export default Product;
