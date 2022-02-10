import { createGlobalStyle } from 'styled-components';

export const Global = createGlobalStyle`
.ant-carousel .slick-prev,
.ant-carousel .slick-prev:hover {
  left: 10px;
  z-index: 2;
  color: white;
  font-size: 40px;
  height: 30px;
},
.ant-carousel .slick-next,
.ant-carousel .slick-next:hover {
  right: 32px;
  z-index: 2;
  color: white;
  font-size: 40px;
  height: 30px;
}
 `;
