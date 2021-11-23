// eslint-disable-next-line no-unused-vars
import React from 'react';
import '../../css/dipper.css';

interface DipperProps {
  dipper: {
    title: string;
    image: string;
    link: string
  }[]
}

export function Dipper(props: DipperProps) {
  const { dipper } = props;

  const jumoDemo = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className='dippercontainer'>
      <div className='title'>Dipper 地理分析应用开发框架</div>
      <div className='subtitle'>Dipper 是基于 L7 地理分析应用开发框架，用于快速构建和开发地理分析应用。用户通过组件化、模块化低代码的方式配置地图分析、指挥类应用。</div>
      <div className='dipperdemo'>
        {dipper.map(item => {
          return (
            <div key={item.title} className='dipperitem' >
              <img className='dipperimg' src={item.image} />
              <span style={{cursor:'pointer'}} className='dippertitle'>{item.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
