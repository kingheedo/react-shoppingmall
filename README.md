## 소개

ssf 에잇세컨즈를 모티브로 만든 쇼핑몰 사이트

## 주요기능

|  |  |
| --- | --- |
| 회원가입 및 로그인 | 쿠키, 세션을 이용한 회원가입 및 로그인 |
| 상품 목록 | 관리자가 등록한 상품 목록 불러오기 |
| 상품 검색  | 사용자가 상품 검색 시 등록한 상품 리스트 출력하기(클릭 시 해당 상품페이지로 이동) |
| 상품 하트 | 상품에 하트 클릭 및 취소 |
| 장바구니  | 원하는 상품의 사이즈, 수량을 선택해서 장바구니에 담기 |
| 상품 결제  | 토스 페이먼츠의 결제  라이브러리를 이용한 결제 기능 |
| 상품 리뷰 | 마이페이지에서 구매한 상품 리뷰 가능 |
| 상품 추가 | 판매하고자 하는 상품 등록 |
| 상품 수정등록 | 기존 상품의 정보(상품명, 판매가, 사이즈, 재고, 성별, 사진)등의 정보를 수정 |

## 주요작업

### 프론트엔드

- app router 기반 폴더 구조 적용
- useInfiniteQuery 및 intersection observer api를 이용하여 아래로 스크롤 시 상품 목록 추가로 불러오기
- 비동기 상태 관리로 Tanstack-query 라이브러리 사용,  api를 custom hook으로 분리
- 하트 클릭 시 optimistic update를 이용하여 사용자 경험성 향상
- input,  로직을 custom hook으로 분리
- 전역상태관리로 recoil 및 persist 기능을 활용하여 로컬스토리지에 로그인한 유저id 관리
- daum post 라이브러리를 활용하여 주소지 등록
- 토스페이먼츠 결제 모듈 연동

### 백엔드

- Sequelize로 각 모델 생성 및 관계 설정, mysql과 연동
- Sequelize를 활용하여 db 데이터 관리
- passport 전략을 이용하여 세션 로그인 기능 구현(카카오, 네이버 포함)
- 로그인 여부를 확인하는 middleware 구현하여 인증 및 인가
- multer-s3를 활용하여 aws s3에 상품 이미지 업로드 구현

*관리자 홈페이지: [https://github.com/kingheedo/react-shoppingmall-admin](https://github.com/kingheedo/react-shoppingmall-admin/blob/master/README.md)

![Untitled](https://github.com/kingheedo/react-shoppingmall/assets/52102550/f9aed77f-5872-48ee-aa85-8a7c589b10b0)
![Untitled 1](https://github.com/kingheedo/react-shoppingmall/assets/52102550/06c782b7-0288-4a44-926d-09deda97ebfd)
![Untitled 2](https://github.com/kingheedo/react-shoppingmall/assets/52102550/f23ecd00-4bf1-486a-a7a4-831e203e7170)
![Untitled 3](https://github.com/kingheedo/react-shoppingmall/assets/52102550/e19351ee-d6fe-4f8f-89c0-065a984cbb89)
![Untitled 4](https://github.com/kingheedo/react-shoppingmall/assets/52102550/d16c6380-c3d3-4255-99e9-9e3c412a3a21)
![Untitled 5](https://github.com/kingheedo/react-shoppingmall/assets/52102550/98f2df55-1900-4a14-b540-7a66507d8644)
![Untitled 6](https://github.com/kingheedo/react-shoppingmall/assets/52102550/82244b20-6364-438f-9fcb-b58afc0d84bc)
![Untitled 7](https://github.com/kingheedo/react-shoppingmall/assets/52102550/8784ad69-a201-41cf-a92e-bed30a703b1d)
![Untitled 8](https://github.com/kingheedo/react-shoppingmall/assets/52102550/2c668bc1-f407-449b-9586-faedde87c435)
![Untitled 9](https://github.com/kingheedo/react-shoppingmall/assets/52102550/66767589-2a38-432a-9be1-c98ccb311d1c)
![Untitled 10](https://github.com/kingheedo/react-shoppingmall/assets/52102550/9c8007a3-6ad3-4b3d-b3ea-33e89a5f470b)

