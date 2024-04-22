'use client';

import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { SizeOption } from '../../../../../apis/product/schema';
import { useModal } from '../../../../../context/ModalProvider';
import ReviewList from '../ReviewList';
import { useRouter } from 'next/navigation';
import useGetUser from '../../../../../hooks/queries/useGetUser';
import useGetSingleProduct from '../../../../../hooks/queries/useGetSingleProduct';
import useAddItemToCart from '../../../../../hooks/mutations/useAddItemToCart';

const Container = styled.div`
  max-width: 1440px;
  min-width: 1280px;
  height: 100%;
  margin: 6rem auto 0;
  padding: 0 20px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const ProductInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 120px;
`;
const ProductImage = styled.img`
  min-width: 541px;
`;

const InfoArea = styled.div`
  min-width: 483px;
`;

const BrandName = styled.div`
  text-decoration: underline;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: var(--fontJ);
  line-height: var(--fontJL);
  font-weight: 700;
  text-decoration: underline;
  margin-bottom: 8px;
`;
const Tags = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 53px;
  height: 20px;
  margin-bottom: 12px;
  font-size: var(--fontA);
  white-space: nowrap;
  margin-right: 4px;
  padding: 0 5px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  background: #fff;
`;
const ProductName = styled.div`
  max-height: 46px;
  margin-bottom: 16px;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: var(--fontE);
  line-height: var(--fontEL);
  color: #111111;
`;

const PriceInfo = styled.em`
    display: inline-block;
    margin-right: 2px;
    font-size: var(--fontJ);
    font-weight: 700;
}
`;
const ReviewWrap = styled.div`
  display: flex;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 11px;
  padding: 12px 0;
  font-size: var(--fontC);
  line-height: var(--fontCL);
  color: var(--gray600);
`;
const ScoreWrap = styled.div`
  display: flex;
  align-items: center;
  color: var(--gray900);
  font-weight: 700;
`;
const Rate = styled.i`
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 2px;
  background: url(/star-fill.svg) center/16px auto no-repeat;
`;
const Score = styled.em``;
const Review = styled(Link)`
  margin: 0 15px 0 6px;
  text-decoration: underline;
  color: #767676;
`;
const OptionWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
  margin-top: 20px;
  padding: 20px 0 40px;
  border-top: 1px solid #e5e5e5;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
`;
const Type = styled.span`
  width: 90px;
  align-self: flex-start;
  flex-basis: 90px;
  margin-top: 10px;
  font-size: var(--fontD);
  line-height: var(--fontDL);
  font-weight: 700;
`;

const SelectWrap = styled.ul`
  width: calc(100% - 90px);
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const SelectItm = styled.li`
  min-width: 72px;
  height: 36px;
  padding: 0 15px;
  border-radius: 6px;
  border: 0;
  overflow: hidden;
  cursor: pointer;
  box-sizing: border-box;
  line-height: 36px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  text-align: center;

  &.active {
    border: 2px solid var(--gray900);
  }
`;
const BuyWrap = styled.div`
  padding: 20px 0 40px;
  border-top: 2px solid var(--gray900);
`;

const BuyTxt = styled.p`
  max-width: 470px;
  margin-bottom: 20px;
  font-size: var(--fontD);
  line-height: var(--fontDL);
`;
const PriceArea = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Quantity = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 111px;
  font-weight: 400;
  padding: 0;
  height: 36px;
  border-radius: 6px;
  box-sizing: border-box;
  color: var(--gray900) !important;
  text-align: center;
  text-indent: 0;
  border: 1px solid #e5e5e5 !important;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 37px;
    width: 1px;
    height: 100%;
    background-color: var(--gray250);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 37px;
    width: 1px;
    height: 100%;
    background-color: var(--gray250);
  }
`;
const MinusBtn = styled.button`
  position: absolute;
  width: 36px;
  height: 36px;
  top: 0;
  left: 1px;
  font-size: 0;
  border-radius: 6px 0 0 6px;
  background-color: var(--gray900);
  cursor: pointer;
  mask: url(/minus.svg) center/16px auto no-repeat;

  &.disabled {
    background-color: var(--gray250);
  }
`;
const PlusBtn = styled.button`
  position: absolute;
  width: 36px;
  height: 36px;
  top: 0;
  right: 1px;
  font-size: 0;
  border-radius: 0 6px 6px 0;
  background-color: var(--gray900);
  cursor: pointer;
  mask: url(/plus.svg) center/16px auto no-repeat;
`;

const PriceWrap = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--fontE);
  line-height: var(--fontEL);
  font-weight: 700;
`;
const Price = styled.span`
  font-size: var(--fontG);
  line-height: var(--fontGL);
`;
const PriceUnit = styled.em``;

const DecisionWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px 0;
  margin-top: 0;
`;

const BasketBtn = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 60px;
  border-radius: 6px 0 0 6px;
  background: var(--gray900);
  color: #fff;
  font-size: 17px;
  padding: 0 15px;
  line-height: 48px;
  min-width: 243px;
  margin: 0;
  border: 1px solid #111;
  cursor: pointer;
`;
const BuyBtn = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 60px;
  border-radius: 0 6px 6px 0;
  background: var(--purpule500);
  color: #fff;
  font-size: 17px;
  padding: 0 15px;
  line-height: 48px;
  min-width: 243px;
  margin: 0;
  border: 1px solid var(--purpule500);
  cursor: pointer;
`;

export type RevieListType = {
    id: number;
    content: string;
    rate: number;
    userEmail: string;
    date: string;
    reviewImage: string
    
}

type BuyInfo = {
  productId: number;
  size: SizeOption | '';
  totalPrice: number;
  quantity: number;
};

interface IProductDetailProps{ 
  id: string;
}

const Products = ({ id }: IProductDetailProps) => {
  const router = useRouter();
  const modal = useModal();
  const { user } = useGetUser();
  const { product } = useGetSingleProduct(id);
  const { addItemToCart } = useAddItemToCart();

  const [buyInfo, setBuyInfo] = useState<BuyInfo>({
    productId: product?.id || -1,
    size: '',
    totalPrice: product?.price || 0,
    quantity: 1,
  });

  const reviewList: RevieListType[] = useMemo(() => {
    return product?.Reviews.map(review => ({
      id: review.id,
      content: review.content,
      rate: review.rate,
      userEmail: review.User?.email,
      date: review.createdAt,
      reviewImage: review.ReviewImages[0]?.src
    })) || [];
  },[product]);

  /** 평균 리뷰 점수 */
  const averageRate = useMemo(() => {
    let rate = 0;
    const reviewLength = product?.Reviews.length;
    product?.Reviews.forEach(review => rate += review.rate);

    return reviewLength ? (rate / reviewLength).toFixed(1) : 0;
  },[product]);
  
  /** 상품 장바구니 및 구매 가능 상태인지 여부 */
  const checkBuyInfoValid = () => {
    if (!product) {
      return false;
    }
    if (!user) {
      router.push('/signIn');
      
      return false;
    }
    if (!buyInfo.size) {
      modal?.confirm.sizeSlct.handleConfirm();
      
      return false;
    }
    if (
      buyInfo.productId &&
      buyInfo.size &&
      buyInfo.totalPrice &&
      buyInfo.quantity
    ) {
      return true;
    }
  };

  /** 사이즈 옵션 선택 시 */
  const onClickSize = (option: SizeOption) => {
    if (!product) {
      return;
    }
    if (buyInfo.totalPrice === 0) {
      setBuyInfo((prev: BuyInfo) => ({ ...prev, totalPrice: product.price * buyInfo.quantity }));
    }
    setBuyInfo((prev: BuyInfo) => ({ ...prev, productId: product.id, size: option }));
  };

  /** 수량 조절 */
  const onClickQuant = (quantity: 'inc' | 'dec') => {
    if (!product) {
      return;
    }

    if (quantity === 'inc') {
      setBuyInfo((prev) => ({
        ...prev,
        totalPrice: prev.totalPrice + product.price,
        quantity: prev.quantity + 1,
      }));
    } else {
      if (buyInfo.quantity !== 1) {
        setBuyInfo((prev) => ({
          ...prev,
          totalPrice: prev.totalPrice - product.price,
          quantity: prev.quantity - 1,
        }));
      }
    }
  };

  /** 장바구니 클릭 시 */
  const onClickAddCart = () => {
    if (checkBuyInfoValid()) {
      addItemToCart({
        productId: buyInfo.productId,
        size: buyInfo.size,
        totalPrice: buyInfo.totalPrice,
        quantity: buyInfo.quantity,
        buyNow: false
      }, {
        onSuccess: () => modal?.confirm.addCart.handleConfirm(() => router.push('/cart'))
      });
    }
  };

  //바로구매 클릭 시
  const onClickBuyNow = () => {
    if (checkBuyInfoValid()) {
      addItemToCart({
        productId: buyInfo.productId,
        size: buyInfo.size,
        totalPrice: buyInfo.totalPrice,
        quantity: buyInfo.quantity,
        buyNow: true
      },{
        onSuccess: (data) => router.push(`/order/?ids=${JSON.stringify(data.id)}`)
      });
    }
  };

  /** 리뷰 건 수 클릭 시 리뷰 리스트로 스크롤 */
  const onClickReviewLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.querySelector('#review-list')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <Container>
      <Wrapper>
        {product && (
          <>
            <ProductInfo>
              <ProductImage
                className="image"
                alt="product.Images[0]"
                src={`${product.Images[0].src}`}
              />
              <InfoArea className="info-area">
                <Tags>무료배송</Tags>
                <BrandName className="brand-name">
                  <Link href="/" prefetch={false}>8 seconds</Link>
                </BrandName>
                <ProductName>{product.productName}</ProductName>
                <PriceInfo>{product.price.toLocaleString('ko-KR')}</PriceInfo>
                <ReviewWrap>
                  <ScoreWrap>
                    <Rate />
                    <Score>{averageRate}</Score>
                  </ScoreWrap>
                  <Review
                    onClick={e => onClickReviewLink(e)}
                    href="#review-list"
                    prefetch={false}
                  >
                    {product.Reviews.length}건
                  </Review>
                </ReviewWrap>
                <OptionWrap>
                  <Row>
                    <Type>사이즈</Type>
                    <SelectWrap>
                      {product.Sizes.map((size) => (
                        <SelectItm
                          className={
                            buyInfo.size === size.option ? 'active' : ''
                          }
                          onClick={() => onClickSize(size.option)}
                          key={size.option}
                        >
                          {size.option}
                        </SelectItm>
                      ))}
                    </SelectWrap>
                  </Row>
                  <Row>
                    <Type>배송방법</Type>
                    <SelectWrap>
                      <SelectItm className={`${buyInfo.size ? 'active' : ''}`}>
                        택배
                      </SelectItm>
                    </SelectWrap>
                  </Row>
                </OptionWrap>
                <BuyWrap>
                  <BuyTxt>{buyInfo.size}</BuyTxt>
                  <PriceArea>
                    <Quantity>
                      <MinusBtn
                        className={buyInfo.quantity === 1 ? 'disabled' : ''}
                        onClick={() => onClickQuant('dec')}
                      />
                      {buyInfo.quantity}
                      <PlusBtn onClick={() => onClickQuant('inc')} />
                    </Quantity>
                    <PriceWrap>
                      <Price>
                        {(buyInfo.totalPrice || product.price).toLocaleString('ko-KR')}
                      </Price>
                      <PriceUnit>원</PriceUnit>
                    </PriceWrap>
                  </PriceArea>
                </BuyWrap>
                <DecisionWrap>
                  <BasketBtn onClick={onClickAddCart}>장바구니</BasketBtn>
                  <BuyBtn onClick={onClickBuyNow}>바로구매</BuyBtn>
                </DecisionWrap>
              </InfoArea>
            </ProductInfo>

            <ReviewList
              list={reviewList}
            />
          </>
        )}
      </Wrapper>
    </Container>
  );
};
export default Products;
