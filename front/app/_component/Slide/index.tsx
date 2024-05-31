/* eslint-disable react/jsx-key */
'use client';

import React from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
const SlideWrap = styled.div`
    display: flex;
    
    .image-wrap{
        min-width: 1200px;
        height: 0;
        position: relative;
        padding-top: calc(100% * 0.45);

        &:after{
          content: '';
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.2);
        }

        img {
          position: relative;
          top: 0;
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
      }
        .swiper-slide{
          .text-wrap{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
          span{
            display: block;
            max-width: 400px;
            max-height: 84px;
            margin-bottom: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
            font-size: var(--fontH);
            line-height: var(--fontHL);
            font-weight: 700;
            color: #fff;
          }
          em {
            max-width: 400px;
            max-height: 46px;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
            font-size: var(--fontE);
            line-height: var(--fontEL);
            color: #fff;
          }
        }
    }


    .swiper-button-prev{
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
      z-index: 10;
      width: 64px;
      height: 64px;
      color: #fff;
    }

    .swiper-button-next{
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      z-index: 10;
      width: 64px;
      height: 64px;
      color: #fff;
    }
`;

const BgLists = [
  {
    src: '/background_1.webp',
    title: {
      main: '팔초빅데이',
      sub: ''
    },
  },
  {
    src: '/background_2.webp',
    title: {
      main: '나의 여름 버킷리스트' ,
      sub: '24 Summer Collection'
    },
  },
  {
    src: '/background_3.webp',
    title: {
      main: '돌아온 여름',
      sub: '2024 HOT 기획전'
    },
  },
  {
    src: '/background_4.webp',
    title: {
      main: 'fly up',
      sub: '블록코어 룩으로 자신감을 넣다'
    },
  },
];
const Slide = () => {
  return (
    <SlideWrap>
      <Swiper
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Navigation]}
        className="mySwiper"
      >
        {BgLists.map(
          (bg) => (
            <SwiperSlide key={bg.src}>
              <div className="image-wrap">
                <Image fill={true} src={bg.src} alt={bg.src}/>
              </div>
              <div className="text-wrap">
                <span>
                  {bg.title.main}
                </span>
                <em>
                  {bg.title.sub}
                </em>
              </div>
            </SwiperSlide>
          )
        )}
      </Swiper>
    </SlideWrap>
  );
};

export default Slide;
