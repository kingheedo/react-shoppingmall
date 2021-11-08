
import React from 'react'
import { Carousel } from "antd";
import { Global } from './style';
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
const ImageSlider = () => {
    const Images = [
        {
          src: "https://img.ssfshop.com/display/category/BDM/A07/A01/contents/10771_187575_2_KOR_20211104142930.jpg"
        },
        {
          src: "https://img.ssfshop.com/display/category/BDM/A07/A01/contents/10771_186274_2_KOR_20211108102757.jpg"
        },
        {
          src: "https://img.ssfshop.com/display/category/BDM/A07/A01/contents/10771_189330_1_KOR_20211105145927.jpg"
        },

    ]
   
    return (
        <>
            <Global/>
            <Carousel style={{overflowX:'hidden'}} arrows prevArrow={<LeftOutlined />} nextArrow={<RightOutlined />} autoplay>

                {Images.map(v => (
                    <img style ={{width: '120rem',}} src={v.src} alt={v.src}/>
                ))}
                

            </Carousel>
        </>
      )
}

export default ImageSlider

