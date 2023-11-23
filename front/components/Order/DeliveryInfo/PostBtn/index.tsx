import React, { PropsWithChildren } from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import styled from 'styled-components';
const PostNumBtn = styled.button`
    width: 100px;
    margin-left: 10px;
    line-height: 38px;
    display: inline-block;
    box-sizing: border-box;
    padding: 0 20px;
    line-height: 34px;
    font-size: 14px;
    color: #444;
    text-align: center;
    background: #fff;
    border: 1px solid #e5e5e5;
`;

const scriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

interface IPostBtnProps{
  handlePost: ({ postNum, baseAddress }: { postNum: string, baseAddress: string }) => void;
}
const PostBtn = ({
  handlePost,
  children
}: IPostBtnProps & PropsWithChildren) => {
  const open = useDaumPostcodePopup(scriptUrl);

  /** 검색이 끝난후 정보를 받아올 콜백함수 */
  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    if (data.zonecode && (data.address || data.roadAddress)) {
      handlePost({ postNum: data.zonecode, baseAddress: data.address || data.roadAddress });
    }
  };

  /** 우편번호 버튼 클릭 시 */
  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  return (
    <PostNumBtn 
      className="post-num-btn"
      type="button"
      onClick={handleClick}
    >
      {children}
    </PostNumBtn>
  );
};

export default PostBtn;