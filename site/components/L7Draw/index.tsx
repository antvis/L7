// eslint-disable-next-line no-unused-vars
import React from 'react';
import '../../css/dipper.css';
import { Carousel } from 'antd';

interface DipperMapProps {
  draw: {
    desc: string;
    img: string;
    alt: string
  }[]
}

export function L7Draw(props: DipperMapProps) {
  const { draw } = props;

  const jumoDemo = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className='dippermapcontainer'>
      <div className='title'>L7Draw 地理围栏绘制组件库</div>
      <div className='subtitle'>L7Draw 是基于 L7 地理围栏绘制组件库，提供了圆、折线、多边形等图形的绘制方法，同时提供了圆形工具、框选工具、测距工具、矩形工具等一系列工具。</div>
      <div className='carousel'>
        <Carousel
          autoplay
          effect='fade'
          dotPosition='right'
        >
          {draw.map(item => {
            return (
              <div>
                <h3 style={{ textAlign: 'center' }}>{item.desc}</h3>
                <img key={item.alt}  alt={item.alt} src={item.img} />
              </div>
            );
          })}
        </Carousel>
        </div>
    </div>
  );
}
