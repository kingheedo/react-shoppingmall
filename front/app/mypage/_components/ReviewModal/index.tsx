import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import apis from '../../../../apis';
import { PostReviewReq } from '../../../../apis/product/schema';
import { TargetPaymentType } from '../MyPageMain';

const Bg = styled.div`
  position: fixed;
  display: grid;
  place-content: center;
  inset: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.25);
  z-indeX: 100;
`;

const ContentArea = styled.div`
  position: relative;
  width: 600px;
  background: #fff;
  padding: 40px 30px;

  > h2{
    font-size: 25px;
    line-height: 36px;
    color: #111;
    font-weight: 700;
    border-bottom: 1px solid #b8b8b8;
    padding-bottom: 20px;
  }
`;

const CloseBtn = styled.button`
    position: absolute;
    top: 13px;
    right: 17px;
    width: 30px;
    height: 30px;
    border: 0;
    border-radius: 0;
    background: url('/btn_x.svg') no-repeat center center/20px 20px;
`;

const StarArea = styled.div`
  display: flex;
  padding: 20px 0;

  .star{
      &.filled{
      display: inline-block;
      width: 32px;
      height: 32px;
      background: url(/star-fill.svg) no-repeat center/32px auto;
    }
    &.unfilled{
      display: inline-block;
      width: 32px;
      height: 32px;
      background: url(/start-unfill.svg) no-repeat center/32px auto;
    }
  }
`;

const FileInput = styled.input`
  display: none;
`;

const ImageSelect = styled.div`
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  border: 1px solid black;
  font-size: 30px;
  cursor: pointer;
`;

const Form = styled.form`
  margin-top: 20px;
  textarea {
    width: 100%;
    border: 1px solid #b8b8b8;
    border-radius: 4px; 
  }
`;

const Notice = styled.div`
`;

const ButtonGroup = styled.div`
  display:flex;
  padding: 10px;

  button {
    flex: 1;
    height: 50px;
    line-height: 48px;
    font-weight: 400;
    font-size: 15px;
    border-radius: 0;
  }
  .cancel-btn{
    color: #111;
    background: #fff;
    border: 1px solid #111;
  }
  .submit-btn{
    color: #fff;
    background: #111;
    border: 1px solid #111;
  }
`;

const ImageWrap = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin-top: 20px;

  button {
    position: absolute;
    display: block;
    content: '';
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    background: rgba(0,0,0,0.25) url(/btn_x.svg) no-repeat center center/20px 20px;
    cursor: pointer;
  }
`;

const TempImage = styled.img`
  width: 100%;
  height: 100%;
`;

interface IReviewModalProps{
  target: TargetPaymentType;
  onClose: () => void;
}

const startCnt = [true,true,true,true,true];
const ReviewModal = ({ target, onClose }: IReviewModalProps) => {
  const [content, setContent] = useState(''); // 내용
  const [starScore, setStarScore] = useState(5); //별점
  const [tempImage, setTempImage] = useState<string[]>([]); //리뷰 임시 이미지
  const [starEdit, setStarEdit] = useState(true); //별점 수정가능 여부
  const inputRef = useRef<HTMLInputElement | null>(null);
  const formData = new FormData();

  const queryClient = useQueryClient();
  const { mutateAsync: postReview } = useMutation({
    mutationFn: (data: PostReviewReq) => apis.Product.postReview(data),
    onSuccess: async() => {
      await queryClient.invalidateQueries({
        queryKey: ['getAllPayments'],
      });
      onClose();
    },
    onError: () => {
      alert('리뷰 작성에 실패하였습니다.');
    }
  });
  
  /** 별점 마우스 호버시 */
  const onMouseStar = (idx: number) => {
    let cnt = 0;
    for (let i = 0; i <= idx; i++) {
      cnt++;      
    }

    if (starEdit) {
      setStarScore(cnt);
    }
  };

  /** 폼 제출시 */
  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log('content', content);
    // console.log('starScore', starScore);
    postReview({
      content,
      rate: starScore,
      productId: target.productId,
      paymentId: target.paymentId,
      image: tempImage
    });
  };

  const onChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const onClickFileInput = () => {
    inputRef.current?.click();
  };

  const onChangeImgFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('onchange');
    
    const fileData = e.currentTarget.files?.[0];
    if (!fileData) {
      return;
    }

    formData.append('image', fileData);
    //리뷰 이미지 등록 api
    apis.Product.postReviewImage(formData).then((res) => {
      // console.log('changefile',res);
      setTempImage([res[0]]);
    });
  };

  const onClickDeleteRq = () => {
    // console.log('inputRef.current?.files',inputRef.current?.files);
    formData.delete('image');
    if (!inputRef.current) {
      return;
    }
    inputRef.current.value = '';
    setTempImage([]);
  };
  
  return (
    <Bg onClick={onClose}>
      <ContentArea onClick={e => e.stopPropagation()}>
        <CloseBtn onClick={onClose}/>
        <h2>상품평쓰기</h2>
        <StarArea> 
          {startCnt.map((cnt, idx) => (
            <i 
              key={idx} 
              onClick={() => {
                setStarEdit(prev => !prev);
                setStarScore(idx + 1);
              }} 
              onMouseOver={(e) => onMouseStar(idx)} className={idx < starScore ? 'star filled' : 'star unfilled'}/>
          ))}
        </StarArea>
        <FileInput
          ref={inputRef}
          name="image"
          type="file"
          accept="image/*"
          onChange={onChangeImgFile}
        />
        <ImageSelect onClick={onClickFileInput}>
          <span>
            +
          </span>
        </ImageSelect>
        {tempImage.length > 0 && (
          <ImageWrap>
            <TempImage src={`${tempImage[0]}`} alt={tempImage[0]} />
            <button className="delete-req-btn" onClick={onClickDeleteRq}/>
          </ImageWrap>
        )}
        <Form onSubmit={e => onSubmitForm(e)}>
          <textarea onChange={(e) => onChangeContent(e)} rows={8}/>
          <Notice>
            <p>
            - 아이디, 비밀번호 및 개인정보는 작성하지 않도록 주의해 주세요.
            </p>
            <p>
            - 개인정보,저작권침해,음란,욕설,비방,홍보성 글을 등록한 경우 관리자에 의해 임의 삭제됩니다.
            </p>
          </Notice>
          <ButtonGroup>
            <button onClick={onClose} className="cancel-btn"> 
              취소
            </button>
            <button type="submit" className="submit-btn">
              등록
            </button>
          </ButtonGroup>
        </Form>
      </ContentArea>
    </Bg>
  );
};

export default ReviewModal;