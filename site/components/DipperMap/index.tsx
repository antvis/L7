// eslint-disable-next-line no-unused-vars
import { Carousel } from 'antd';
import React from 'react';
import '../../css/dippermap.css';

interface DipperMapProps {
  dippermap: {
    title: string;
    image: string;
    link: string
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
      <div className='subtitle'>静态配置底图可视化平台，快速绘制地理数据图层，让地理数据可视化无边界、无门槛</div>
      <div className='carousel'>
        <Carousel
          // autoplay
          effect='fade'
          dotPosition='right'
        >
          {dippermap.map(item => {
            return (
              <div onClick={() => jumpDipperMap(item.link)}>
                <div style={{ textAlign: 'center' }}>{item.title}</div>
                <img key={item.link} src={item.image} />
              </div>
            );
          })}
        </Carousel>
      </div>
    </div>
  );
}
