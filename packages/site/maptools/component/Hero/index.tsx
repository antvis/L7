import { Link } from 'dumi';
import 'dumi/theme-default/slots/Hero/index.less';
import HeroTitle from 'dumi/theme/slots/HeroTitle';
import React, { type FC } from 'react';
const Hero: FC = () => {
  const frontmatter = {
    hero: {
      title: '行政区划',
      description: '一站式行政区划数据下载、应用平台',
      actions: [
        {
          text: '地图下载',
          link: '../custom/tools/map',
        },
        {
          text: 'GITHUB',
          link: 'https://github.com/antvis/l7',
        },
      ],
    },
  };

  if (!('hero' in frontmatter)) { return null; }

  return (
    <div className="dumi-default-hero">
      <HeroTitle>{frontmatter.hero.title}</HeroTitle>
      {frontmatter.hero.description && (
        <p dangerouslySetInnerHTML={{ __html: frontmatter.hero.description }} />
      )}
      {Boolean(frontmatter.hero.actions.length) && (
        <div className="dumi-default-hero-actions">
          {frontmatter.hero.actions.map(({ text, link }) =>
            /^(\w+:)\/\/|^(mailto|tel):/.test(link) ? (
              <a href={link} target="_blank" rel="noreferrer" key={text}>
                {text}
              </a>
            ) : (
              <Link key={text} to={link}>
                {text}
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default Hero;
