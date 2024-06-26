'use client';
/* eslint-disable no-cond-assign */
/* eslint-disable no-constant-condition */
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { InfiniteData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GetSingleProductRes } from '../../../../apis/product/schema';
import apis from '../../../../apis';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useGetUser from '../../../../hooks/queries/useGetUser';
import useAddLike from '../../../../hooks/mutations/useAddLike';
import useUnLike from '../../../../hooks/mutations/useUnLike';

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

const CardItemImgWrap = styled.div`
  position: relative;
`;

const Rank = styled.span`
    font-size: var(--fontD);
    line-height: var(--fontDL);
    color: var(--gray900);
    font-weight: 700;
`;

const CardItemInfo = styled.div`
    display: flex;
    flex-direction: column;
    padding-right: 80px;
    padding-top: 8px;
`;

const CardItemBrand = styled.span`
  font-size: 14px;
  line-height: 20px;
  color: #111111;
  font-weight: 700;
  white-space: nowrap;
`;

const CardItemName = styled.span`
  font-size: 14px;
  line-height: 20px;
  color: #111111;
  word-wrap: break-word;
  max-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardItemPrice = styled.strong`
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
const CarItemScore = styled.div`
  
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
const Item = ({ idx,product }:IProductProps) => {
  const [show, setShow] = useState(false);
  const { user } = useGetUser();
  const { addLike } = useAddLike();
  const { unLike } = useUnLike();

  // const { mutate: addLike } = useMutation((data: number) => apis.Product.addLike(data),
  //   {
  //     onMutate: async(variable) => {
  //       await queryClient.cancelQueries({ queryKey: ['getProducts'] });
  //       const previous = queryClient.getQueryData(['getProducts']);

  //       queryClient.setQueryData<InfiniteData<Array<any>>>(['getProducts'], (old:any) => {
  //         const newData = old?.pages.map((page:any) => 
  //           page.map((value:any) => {
  //             if (value.id === variable) {
  //               return {
  //                 ...value,
  //                 Likers: [...value.Likers, { id: user?.info.id }]
  //               };
  //             } else {
  //               return value;
  //             }
  //           })
  //         );
            
  //         return {
  //           ...old,
  //           pages: newData
  //         };
  //       });
        
  //       return { previous };
  //     },
    
  //     onError: (err: any, param, context) => {
  //       if (err.response.status = 401) {
  //         router.push('/signIn');
  //       } else {
  //         queryClient.setQueryData(['getProducts'], context?.previous);
  //       }
  //     },
  //     onSettled: () => {
  //       queryClient.invalidateQueries({ queryKey: ['getProducts'] });
  //     }
  //   });
  // const { mutate: unLike } = useMutation((data: number) => apis.Product.unLike(data),
  //   {
  //     onMutate: async(variable) => {
  //       await queryClient.cancelQueries({ queryKey: ['getProducts'] });
  //       const previous = queryClient.getQueryData(['getProducts']);

  //       queryClient.setQueryData<InfiniteData<Array<any>>>(['getProducts'], (old:any) => {
  //         const newData = old?.pages.map((page:any) => 
  //           page.map((value:any) => {
  //             if (value.id === variable) {
  //               return {
  //                 ...value,
  //                 Likers: [...value.Likers.filter((liker: any) => liker.id !== user?.info.id)]
  //               };
  //             } else {
  //               return value;
  //             }
  //           })
  //         );

  //         return {
  //           ...old,
  //           pages: newData
  //         };
  //       });
        
  //       return { previous };
  //     },
    
  //     onError: (err: any, param, context) => {
  //       if (err.response.status = 401) {
  //         router.push('/signIn');
  //       } else {
  //         queryClient.setQueryData(['getProducts'], context?.previous);
  //       }
  //     },
  //     onSettled: () => {
  //       queryClient.invalidateQueries({ queryKey: ['getProducts'] });
  //     }
  //   });

  const onMouseHover = useCallback(
    () => {
      setShow((prev) => !prev);
    },
    [show]
  );

  const onClickLike = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.Likers.find(value => value.id === user?.info.id)) {
      unLike(product.id);
    } else {
      addLike(product.id);
    }
  };

  return (
    <CardItem
      onMouseEnter={onMouseHover}
      onMouseLeave={onMouseHover}
    >
      <Link href={`/product/${product.id}`}>
        <CardItemImgWrap>
          <Rank>
            {idx}
          </Rank>
          <Image alt={`${product?.Images[0]}`} src={`${product?.Images[0]?.src}`}/>
          <ImageHover alt={`${product?.Images[1]}`} src={`${product?.Images[1]?.src}`}/>
          <ProductLikeBtn style={{ background: product.Likers.find(value => value.id === user?.info.id) ? `url(${'like-28-fill-red.svg'}) no-repeat center center` : `url('${'like-28-white.svg'}') no-repeat center center` }} onClick={onClickLike}/>
        </CardItemImgWrap>
        <CardItemInfo>
          <CardItemBrand>8 seconds</CardItemBrand>
          <CardItemName>{product?.productName}</CardItemName>
          <CardItemPrice>
            {product.price?.toLocaleString('ko-KR')}
          </CardItemPrice>
          <CarItemScore>
            <HeartWrapper>
              <Heart src={'./like-fill-gray.svg'} alt="like-fill-gray" />
              <HeartTxt>{product.Likers.length}</HeartTxt>
            </HeartWrapper>
          </CarItemScore>
        </CardItemInfo>
      </Link>
    </CardItem>
  );
};

export default Item;
