// eslint-disable-next-line no-unused-vars
import { Carousel } from 'antd';
import React from 'react';
import '../../css/dippermap.css';

interface DipperMapProps {
  dippermap: {
    desc: string;
    img: string;
    alt: string
  }[]
}

export function DipperMap(props: DipperMapProps) {
  const { dippermap } = props;

  const jumpDipperMap = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className='dippermapcontainer'>
      <div className='title'>Dipper Map 地理可视化分析工具</div>
      <div className='subtitle'>DipperMap 基于L7 地图可视分析工具，用户自由上传地理数据进行可视化化配置。</div>
      <div className='carousel'>
        <Carousel
          autoplay
          effect='fade'
          dotPosition='right'
        >
          {dippermap.map(item => {
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
