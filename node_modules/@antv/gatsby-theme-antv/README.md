# Gatsby Theme for AntV ⚛

[![](https://flat.badgen.net/npm/v/@antv/gatsby-theme-antv?icon=npm)](https://www.npmjs.com/package/@antv/gatsby-theme-antv)
[![NPM downloads](http://img.shields.io/npm/dm/@antv/gatsby-theme-antv.svg?style=flat-square)](http://npmjs.com/@antv/gatsby-theme-antv)
![CI status](https://github.com/antvis/gatsby-theme-antv/workflows/Node%20CI/badge.svg)
[![Dependency Status](https://david-dm.org/antvis/gatsby-theme-antv.svg?style=flat-square&path=@antv/gatsby-theme-antv)](https://david-dm.org/antvis/gatsby-theme-antv?path=@antv/gatsby-theme-antv)
[![devDependencies Status](https://david-dm.org/antvis/gatsby-theme-antv/dev-status.svg?style=flat-square&path=@antv/gatsby-theme-antv)](https://david-dm.org/antvis/gatsby-theme-antv?type=dev&path=@antv/gatsby-theme-antv)
![prettier code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)

## How to use it for AntV

- ✨ AntV 站点 [接入方式](https://github.com/antvis/antvis.github.io/issues/18#issuecomment-548754442)
- 参考例子: https://github.com/antvis/gatsby-theme-antv/tree/master/example

## Features

- ⚛ Prerendered static site
- 🌎 Internationalization support by i18next
- 📝 Markdown-based documentation and menus
- 🎬 Examples with live playground
- 🏗 Unified Theme and Layout
- 🆙 Easy customized header nav
- 🧩 Built-in home page components

## Usage

```bash
npm install gatsby @antv/gatsby-theme-antv react-i18next --save-dev
```

Add `gatsby-config.js`:

```js
// gatsby-config.js
const { repository } = require('./package.json');

module.exports = {
  plugins: [
    {
      resolve: `@antv/gatsby-theme-antv`,
      options: {
        // pagesPath: './site/pages',
        GATrackingId: `UA-XXXXXXXXX-X`,
        pathPrefix: '/g2',
        // antd 主题：https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
        theme: {
          'primary-color': '#722ED1',
        },
        pwa: true, // 是否开启 gatsby-plugin-offline
        cname: true, // 是否自动从 siteUrl 中提取 CNAME 文件
      },
    },
  ],
  siteMetadata: {
    title: `AntV`,
    description: `Ant Visualization solution home page`,
    githubUrl: repository.url,
    logoUrl: '', // 自定义 logo
    navs: [], // 用于定义顶部菜单
    docs: [], // 用于定义文档页面的二级分类菜单
    examples: [], // 用于定义演示页面的二级菜单，属性见下方
    showLanguageSwitcher: true, // 用于定义是否展示语言切换
    playground: {
      container: '<canvas id="container" />', // 定义演示的渲染节点，默认 <div id="container" />
      playgroundDidMount: 'console.log("playgroundDidMount");',
      playgroundWillUnmount: 'console.log("playgroundWillUnmount");',
    },
    redirects: [
      {
        from: /\/old-url/,
        to: '/new-url', // 不指定 to 时直接跳转到 https://antv-2018.alipay.com/***
      },
    ],
  },
};
```

- `navs`: [props](https://github.com/antvis/gatsby-theme-antv/blob/aa8cdd7e24e965174cbe7173a841fd7d23537e52/%40antv/gatsby-theme-antv/gatsby-node.js#L242-L264)
- `docs`: [props](https://github.com/antvis/gatsby-theme-antv/blob/aa8cdd7e24e965174cbe7173a841fd7d23537e52/%40antv/gatsby-theme-antv/gatsby-node.js#L242-L264)
- `examples`: [props](https://github.com/antvis/gatsby-theme-antv/blob/aa8cdd7e24e965174cbe7173a841fd7d23537e52/%40antv/gatsby-theme-antv/gatsby-node.js#L242-L264)

## Components

- [Header Props](https://github.com/antvis/gatsby-theme-antv/blob/master/%40antv/gatsby-theme-antv/site/components/Header.tsx#L13-L39)
- [Footer Props](https://github.com/antvis/gatsby-theme-antv/blob/046a9c4e32eea50b49347b114714425a9f99b4b7/%40antv/gatsby-theme-antv/site/components/Footer.tsx#L149-L159)
- [SEO Props](https://github.com/antvis/gatsby-theme-antv/blob/046a9c4e32eea50b49347b114714425a9f99b4b7/%40antv/gatsby-theme-antv/site/components/Seo.tsx#L12-L17)
- [Banner Props](https://github.com/antvis/gatsby-theme-antv/blob/c6178d1baeebce4ef4e31773a6b533020b662b27/%40antv/gatsby-theme-antv/site/components/Banner.tsx#L8-L31)
- [Features Props](https://github.com/antvis/gatsby-theme-antv/blob/c6178d1baeebce4ef4e31773a6b533020b662b27/%40antv/gatsby-theme-antv/site/components/Features.tsx#L7-L17)
- [Cases Props](https://github.com/antvis/gatsby-theme-antv/blob/c6178d1baeebce4ef4e31773a6b533020b662b27/%40antv/gatsby-theme-antv/site/components/Cases.tsx#L14-L25)
- [Companies Props](https://github.com/antvis/gatsby-theme-antv/blob/c6178d1baeebce4ef4e31773a6b533020b662b27/%40antv/gatsby-theme-antv/site/components/Companies.tsx#L6-L16)

```jsx
import SEO from '@antv/gatsby-theme-antv/site/components/Seo';
import Header from '@antv/gatsby-theme-antv/site/components/Header';
import Footer from '@antv/gatsby-theme-antv/site/components/Footer';
import Banner from '@antv/gatsby-theme-antv/site/components/Banner';
import Features from '@antv/gatsby-theme-antv/site/components/Features';
import Applications from '@antv/gatsby-theme-antv/site/components/Applications';
import Companies from '@antv/gatsby-theme-antv/site/components/Companies';

// @antv/gatsby-theme-antv/components/Header for commonjs version

const Layout = () => {
  const features = [
    {
      icon:
        'https://gw.alipayobjects.com/zos/basement_prod/5dbaf094-c064-4a0d-9968-76020b9f1510.svg',
      title: 'xxxxx',
      description: 'xxxxxxxxxxxxxxxxxxxxxxxxx',
    },
    {
      icon:
        'https://gw.alipayobjects.com/zos/basement_prod/0a0371ab-6bed-41ad-a99b-87a5044ba11b.svg',
      title: 'xxxxx',
      description: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    },
    {
      icon:
        'https://gw.alipayobjects.com/zos/basement_prod/716d0bc0-e311-4b28-b79f-afdd16e8148e.svg',
      title: 'xxxxx',
      description: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    },
  ];
  const cases = [
    {
      logo:
        'https://gw.alipayobjects.com/mdn/rms_23b644/afts/img/A*2Ij9T76DyCcAAAAAAAAAAABkARQnAQ',
      title: '灯塔专业版',
      description:
        '深入金融的基金深入金融的基金深入金融的基金深入金融的基金深入金融的基金深入金融的基金深入金融的基金深入金融的基金深入金融的基金深入金融的基金深入金融的基金',
      link: '#',
      image:
        'https://gw.alipayobjects.com/mdn/rms_23b644/afts/img/A*oCd7Sq3N-QEAAAAAAAAAAABkARQnAQ',
    },
    // ...
  ];
  const companies = [
    {
      name: '公司1',
      image:
        'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*Z1NnQ6L4xCIAAAAAAAAAAABkARQnAQ',
    },
    {
      name: '公司2',
      image:
        'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*6u3hTpsd7h8AAAAAAAAAAABkARQnAQ',
    },
    // ...
  ];
  const notifications = [
    {
      type: '测试',
      title: 'G6 3.2 全新上线！',
      date: '2019.12.04',
      link: '#',
    },
  ];

  const downloadButton = {
    text: '下载使用',
    link: 'https://antv.alipay.com/zh-cn/index.html',
  };

  return (
    <>
      <SEO title="蚂蚁数据可视化" lang="zh" />
      <Header
        subTitle="子产品名"
        logo={{
          link: 'https://antv.alipay.com',
          img: <img src="url" />,
        }}
        githubUrl="https://github.com/antvis/g2"
        // docs={[]}
        showSearch={false}
        showGithubCorner={false}
        showLanguageSwitcher={false}
        onLanguageChange={language => {
          console.log(language);
        }}
        defaultLanguage="zh"
      />
      <Footer
      // columns={[]}
      // bottom={<div>powered by antv</div>}
      />

      <Banner
        coverImage={<svg></svg>} // 右侧 banner svg 内容
        title="主页标题"
        description="主页描述内容描述内容描述内容描述内容"
        buttonText="按钮文字"
        buttonHref={'#按钮链接路径'}
        notifications={notifications} // 可传 1-2 个内容，若不传则显示 2 个默认通知
        style={{}}
        className="Banner 的 className"
        video="视频按钮点开后视频的链接，不传则不会出现视频按钮"
        githubStarLink="Github Star 链接，不传则不会出现 GitHub Start 按钮"
        downloadButton={downloadButton} // 不传则不会出现下载按钮
      />
      <Features
        title="优势页面名称" // 可不传
        features={features} // 必传
        style={{}}
        className="Features 的 className"
      />
      <Cases cases={cases} style={{}} className="Cases 的 className" />
      <Companies
        title="公司页面名称" // 必传
        companies={companies} // 必传
        style={{}}
        className="Companies 的 className"
      />
    </>
  );
};
```

## Develop

```bash
yarn install
yarn start
```

Visit https://localhost:8000 to preview.

## Publish to npm

```bash
cd @antv/gatsby-theme-antv
npm run release
```

## Deploy

```bash
npm run deploy
```

> Set envoironment variable `GATSBY_PATH_PREFIX` to `/` in deploy service like netlify to preview pathPrefix site in root domain.

## Add Dependency

```bash
cd @antv/gatsby-theme-antv
yarn add shallowequal
```

or

```bash
yarn workspace @antv/gatsby-theme-antv shallowequal
```

## Used libraries

- [Gatsby](https://www.gatsbyjs.org/docs/)
- [Ant Design](https://github.com/ant-design/ant-design)
- [gatsby-transformer-remark](https://www.gatsbyjs.org/packages/gatsby-transformer-remark/)
- [gatsby-remark-prismjs](https://www.gatsbyjs.org/packages/gatsby-remark-prismjs/?=highlight#line-highlighting)
- [Jest](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [react-i18next](https://react.i18next.com/)

## Websites using it

- https://github.com/antvis/antvis.github.io
