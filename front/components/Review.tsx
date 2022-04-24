import {
  Button, Input, Modal, Rate,
} from 'antd';
import React, {
  FC, useCallback, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import useInput from '../hooks/useInput';
import { addProductReview } from '../reducers/dispatchRequestTypes/userDispatchRequest';
import { modalCountDown } from './ResultSuccessModal';

const ReviewButton = styled(Button)`
 margin-top: 1rem
`;
type Props = {
  reviewUniqueIds: string[];
  historyCartId: number;
  productId: number;
  paymentToken: string;

}
const Review: FC<Props> = ({
  reviewUniqueIds, historyCartId, productId, paymentToken,
}) => {
  const { TextArea } = Input;
  const exReview = reviewUniqueIds?.find((v) => v === `${paymentToken}_${historyCartId}`);

  const [reviewContent, onChangeText] = useInput('');
  const [reviewRate, onChangeRate] = useState(0);
  const [visibleModal, setVisibleModal] = useState(false);
  const dispatch = useDispatch();

  const onClickReview = useCallback(
    () => {
      if (reviewContent === '') {
        return alert('내용을 입력하세요');
      }
      if (reviewContent.length < 20) {
        return alert('최소 20글자를 입력해주세요 ');
      }
      if (reviewRate === 0) {
        return alert('별점을 평가해주세요.');
      }
      dispatch(
        addProductReview(
          {
            reviewUnique: `${paymentToken}_${historyCartId}`, historyCartId, productId, content: reviewContent, rate: reviewRate, paymentToken,
          },
        ),
      );
      setVisibleModal(false);
      modalCountDown('isReview');
    },
    [historyCartId, reviewContent, reviewRate, paymentToken],
  );
  return (
    <>
      {exReview ? <ReviewButton disabled>작성완료</ReviewButton> : <ReviewButton onClick={() => setVisibleModal(true)}>리뷰쓰기</ReviewButton>}
      <Modal
        visible={visibleModal}
        footer={
          [<Button onClick={onClickReview} key="write">작성</Button>,
          <Button onClick={() => setVisibleModal(false)} key="cancel">취소</Button>,
          ]
        }
        onCancel={() => setVisibleModal(false)}
      >
        <Rate value={reviewRate} onChange={onChangeRate} />
        <TextArea showCount maxLength={50} onChange={onChangeText} value={reviewContent} />

      </Modal>
    </>
  );
};

export default Review;
