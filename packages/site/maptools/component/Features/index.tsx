import { Link } from 'dumi';
import React, { type FC } from 'react';
import 'dumi/theme-default/slots/Features/index.less';

const Features: FC = () => {
  const frontmatter = {
    features: [
      {
        title: '数据下载',
        emoji: '💎',
        description: '符合民政部数据规格,省、市、县三级数据，提供历史版本数据。'

      },
      {
        title: '完备',
        emoji: '🧳',
        description: '提供在线可视化下载、服务SDK、服务、可视化组件能不同的数据应用方式'

      },
      {
        title: '方便',
        emoji: '💾',
        description: '提供 GeoJSON、JSON、TopoJSON、CSV、KML多种数据下载方式，提供 SVG 格式图像下载'

      }
    ]
  }

  return <div
      className="dumi-default-features"
      // auto render 2 or 3 cols by feature count
      data-cols={
        [3, 2].find((n) => frontmatter.features.length % n === 0) || 3
      }
    >
      <h1>特性</h1>
      {frontmatter.features.map(({ title, description, emoji, link }) => {
        let titleWithLink: React.ReactNode;
        if (link) {
          titleWithLink = /^(\w+:)\/\/|^(mailto|tel):/.test(link) ? (
            <a href={link} target="_blank" rel="noreferrer">
              {title}
            </a>
          ) : (
            <Link to={link}>{title}</Link>
          );
        }
        return (
          <div key={title} className="dumi-default-features-item">
            {emoji && <i>{emoji}</i>}
            {title && <h3>{titleWithLink || title}</h3>}
            {description && (
              <p dangerouslySetInnerHTML={{ __html: description }} />
            )}
          </div>
        );
      })}
    </div>
  
};

export default Features;
