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
      <div className='title'>Dipper 地理可视化开发框架</div>
      <div className='subtitle'>简单易用React 结合,一切皆组件,灵活配置,注册机制,任意扩展</div>
      <div className='dipperdemo'>
        {dipper.map(item => {
          return (
            <div key={item.title} className='dipperitem' onClick={() => jumoDemo(item.link)}>
              <img className='dipperimg' src={item.image} />
              <span className='dippertitle'>{item.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
