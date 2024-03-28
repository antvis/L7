import React, { type FC } from 'react';
import './index.less';

const WhoAreUsing: FC = () => {
  return (
    <div className="dumi-default-features">
      <h1>谁在使用</h1>
      <ul className="dumi-site-who-are-using">
        <li>
          <a href="https://antv.antgroup.com" target="_blank" rel="noreferrer">
            <img
              src="https://gw.alipayobjects.com/zos/antfincdn/nc7Fc0XBg5/8a6844f5-a6ed-4630-9177-4fa5d0b7dd47.png"
              alt="AntV"
            />
            AntV
          </a>
        </li>
        <li>
          <a href="https://l7.antv.antgroup.com/zh" target="_blank" rel="noreferrer">
            <img
              src="https://gw.alipayobjects.com/zos/antfincdn/OI%26h7HXH33/L7%252520dilikongjianshujukeshihua.svg"
              alt="AntV"
            />
            L7
          </a>
        </li>
        <li>
          <a href="https://l7.antv.antgroup.com/zh" target="_blank" rel="noreferrer">
            <img
              src="https://gw.alipayobjects.com/zos/antfincdn/OI%26h7HXH33/L7%252520dilikongjianshujukeshihua.svg"
              alt="L7Draw"
            />
            L7Draw
          </a>
        </li>
        <li>
          <a href="https://larkmap.antv.antgroup.com/" target="_blank" rel="noreferrer">
            <img
              src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*2QRBRLk3dH0AAAAAAAAAAAAADmJ7AQ/original"
              alt="LarkMap"
            />
            LarkMap
          </a>
        </li>
        <li>
          <a
            href="https://locationinsight.antv.antgroup.com/#/home"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*xuDWR7uXkbkAAAAAAAAAAAAADmJ7AQ/original"
              alt="L7VP"
            />
            L7VP
          </a>
        </li>
      </ul>
    </div>
  );
};

export default WhoAreUsing;
