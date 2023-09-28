import React from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';

const scriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
const Postcode = () => {
  const open = useDaumPostcodePopup(scriptUrl);

  /** 검색이 끝난후 정보를 받아올 콜백함수 */
  const handleComplete = (data: any) => {
    console.log('data',data);
    
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

    console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
  };

  /** 우편번호 버튼 클릭 시 */
  const handleClick = () => {
    console.log('handleClick');
    
    open({ onComplete: handleComplete });
  };

  return (
    <button type="button" onClick={handleClick}>
      Open
    </button>
  );
};

export default Postcode;