# L7 

![最近提交](https://badgen.net/github/last-commit/antvis/L7)

L7 Large-scale WebGL-powered Geospatial data visualization analysis framework


<<<<<<< HEAD
<video id="video" controls="" preload="none" poster="https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*rjkiQLCoZxUAAAAAAAAAAABkARQnAQ">
<source id="mp4" src="https://gw.alipayobjects.com/mdn/antv_site/afts/file/A*viKwSJl2OGIAAAAAAAAAAABkARQnAQ"; type="video/map4">
      <source id="webm" src="https://gw.alipayobjects.com/os/basement_prod/65d5dbe8-d78d-4c6b-9318-fa06b1456784.webm" type="video/webm">
      <source id="ogv" src="http://media.w3.org/2010/05/sintel/trailer.ogv" type="video/ogg">
<p>Your user agent does not support the HTML5 Video element.</p>
</video>


=======
>>>>>>> f40e44f... fix(fix): fix
### Installation

```
 npm install @antv/l7@beta

```

### Features

<<<<<<< HEAD

=======
>>>>>>> f40e44f... fix(fix): fix
### Links


## Development

使用 Yarn Workspace 完成依赖安装以及各包之间的 link 工作：
```bash
yarn install
```

开发模式：
```bash
yarn watch
```

运行 Demo
```bash
yarn storybook
```

代替 `git commit` 提交：
```bash
yarn commit
```

## view doc example

```bash
  npm  start
```
visit http://localhost:8000/

## Add Package

add new package：
```bash
lerna create my-pack -y
```

将 ui-lib 作为 my-pack 的依赖：
```bash
yarn workspace my-pack add ui-lib/1.0.0
```

将 lodash 添加为所有 package 的依赖(不包含root）
```bash
yarn workspaces run add lodash
```

将 typescript 设置为 root 的开发依赖
```bash
yarn add -W -D typescript jest
```
