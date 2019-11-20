# L7 


[![版本](https://badgen.net/npm/v/@antv/l7)](https://www.npmjs.com/@antv/l7)
[![NPM downloads](http://img.shields.io/npm/dm/@antv/l7.svg)](http://npmjs.com/@antv/l7)
![最近提交](https://badgen.net/github/last-commit/antvis/L7)

L7 Large-scale WebGL-powered Geospatial data visualization analysis framework


### Installation

```
 npm install @l7/l7

```

### Features

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
