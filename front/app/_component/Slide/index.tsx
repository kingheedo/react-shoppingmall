'use client';

import React from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

const BgSlide = styled.div`
    min-width: 1280px;
`;

const BgImg = styled.img`
  width: 100%;
`;
const BgLists = ['slide1.webp'];
const Slide = () => {
  return (
    <BgSlide>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
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
            <SwiperSlide key={bg}>
              <BgImg src={bg} alt={bg}/>
            </SwiperSlide>
          )
        )}
      </Swiper>
    </BgSlide>
  );
};

export default Slide;