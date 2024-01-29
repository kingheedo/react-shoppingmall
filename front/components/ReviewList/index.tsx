import styled from 'styled-components';
import { RevieListType } from '../../pages/product/[id]';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';
import { backUrl } from '../../config/backUrl';
import { useRef, useState } from 'react';

interface IContentProps{
  isOpened: boolean;
}

const Wrapper = styled.div`
    padding-top: 30px;
    border-top: 4px solid #111;
    
  > h3 {
    font-size: var(--fontG);
    line-height: var(--fontGL);
    font-weight: 700;
    margin-bottom: 30px;
  }
  ul{
    li{
      min-height: 125px;
      :first-child{
        border-top: 1px solid #111;
      };
      display: flex;
      padding: 20px 0;
    }
  }
`;

const Rating = styled.div`
  width: 102px;
  flex: none;
  .filled{
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url(/star-fill.svg) no-repeat center/16px auto;
  }

  .unfilled{
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url(/start-unfill.svg) no-repeat center/16px auto;
  }
`;

const Content = styled.div`
    display: flex;
    flex-direction: ${(props:IContentProps) => props.isOpened ? 'column' : 'row'};
    flex: 1;
    justify-content: space-between;
    padding: 0 72px 0 36px;
    position: relative;
    cursor: pointer;
    p {
      font-size: var(--fontD);
      font-weight: 400;
      line-height: 24px;
      color: var(--gray900);
      word-break: break-word;
      ${(props) => !props.isOpened && `
      height: 24px;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      `}
    }
    img{
      position: ${(props) => props.isOpened ? 'initial' : 'absolute'};
      right: 0;
      bottom: 0;
      width: ${(props) => props.isOpened ? '338px' : '52px'};
      height: ${(props) => props.isOpened ? '451px' : '52px'};
      margin: 20px 0;
    }
    
`;

const UserEmail = styled.span`
    width: 220px;
    flex: none;
    overflow: hidden;
    width: 220px;
    margin-right: 16px;
    font-size: var(--fontD);
    line-height: var(--fontDL);
    color: var(--gray500);
    text-align: center;
    word-break: break-word;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
const PurchaseDate = styled(UserEmail)`
  width: 102px;
  flex: none;
`;

interface IReviewListProps{
  list: RevieListType[]
}

const ReviewList = ({ list }: IReviewListProps) => {

  /** 별점 리스트 표기 */
  const starList = (rate: number) => {
    const arr = [];
    for (let i = 0; i < 5; i++) {
      if (arr.length < rate) {
        arr.push(true);
      } else {
        arr.push(false);
      }
    }

    return arr;
  };

  /** 이메일을 앞 세자리 표기 및 이후 @ 까지 * 표기처리 */
  const secretEmail = (payload: string) => {
    let str = '';
    for (let i = 0; i < 3; i++) {
      str += payload[i];
    }
    
    for (let j = 3; j < payload.length; j++) {
      if (payload[j].charCodeAt(0) === 64) {
        break;
      }
      str += '*';
    }
    console.log('str',str);
    
    for (let k = str.length; str.length < payload.length; k++) {
      str += payload[k];
    }

    return str;
  };
  const [openedList, setOpenedList] = useState<number[]>([]);

  /** 리뷰 콘텐츠 클릭 시 open 제어*/
  const onClickReview = (idx: number) => {
    let tempList: number[] = [];
    if (openedList.includes(idx)) {
      tempList = openedList?.filter(val => val !== idx);
    } else {
      tempList = [...openedList, idx];
    }
    setOpenedList(tempList);
  };

  return (
    <Wrapper id="review-list">
      <h3>상품리뷰 &#40;{list.length}&#41;</h3>
      <ul>
        {list.length > 0 ? list.map((val, idx) => (
          <li key={val.id}>
            <Rating>
              {starList(val.rate).map((star, idx) => {
                if (star) {
                  return (
                    <i key={idx} className="filled"/>
                  );
                } else {
                  return (
                    <i key={idx} className="unfilled"/>
                  );
                }
              })}
            </Rating>
            <Content isOpened={openedList.includes(idx) ? true : false} onClick={() => onClickReview(idx)}>
              <p>
                {val.content}
              </p>
              {val.reviewImage && <img src={`${backUrl}/${val.reviewImage}`} />}
            </Content>
            <UserEmail>
              {secretEmail(val.userEmail)}
            </UserEmail>
            <PurchaseDate>
              {val.date && format(new Date(val.date),'yyyy-MM-dd', { locale: ko })}
            </PurchaseDate>
          </li>
        )) : null}
        
      </ul>
    </Wrapper>
  );
};

export default ReviewList;