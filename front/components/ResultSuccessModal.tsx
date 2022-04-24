import { Modal } from 'antd';
import Router from 'next/router';

export const modalCountDown = (isReview?: string) => {
  let seconds = 5;
  const modal = Modal.success({
    title: (isReview ? '리뷰가 성공적으로 작성되었습니다.' : '상품이 성공적으로 결제되었습니다.'),
    content: `${seconds}초 후에 메인페이지로 이동합니다.`,
  });
  const timer = setInterval(() => {
    seconds -= 1;
    if (seconds > 0) {
      modal.update({
        content: `${seconds}초 후에 메인페이지로 이동합니다.`,
      });
    }
  }, 1000);
  setTimeout(() => {
    clearInterval(timer);
    modal.destroy();
    Router.push('/');
  }, seconds * 1000);
};
