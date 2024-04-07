# Contributing to L7

👍🎉 欢迎向 L7 贡献代码! 🎉👍

## 下载源码

```bash
git clone https://github.com/antvis/L7  --depth=1
```

## 前置依赖安装

### 安装 Yarn

由于使用了 Yarn workspace，首先需要安装 Yarn：https://yarnpkg.com/en/docs/install#windows-stable

### Windows 环境配置

由于新Node for Windows中已包含用来构建的工具，所以无需像以前安装windows-build-tools依赖。

所需环境：`python>=3.6.0 && node >= 16.16.0` (官网node版本推荐 v16.20.2)

1.首先安装>=3.6.0的python版本，可以在[官网](https://www.python.org/downloads/)直接安装，也可以先下载conda等包管理工具后再安装python

2.打开命令行，运行

```
where python
```

找到自己本机的python安装路径,如

```
C:\Users\42297\anaconda3\python.exe
```

3.再切换到项目路径下，输入

```bash
npm config set python "${path}\python.exe"
```

到此，所需的依赖就安装完毕。安装过程中其他问题[详见](https://github.com/antvis/L7/issues/101)。

## 安装依赖

安装依赖并完成 Yarn workspace 初始化：

```bash
yarn install
```

## 运行 DEMO

```bash
yarn dev
```

打开 `http://localhost:6006/`：

## 启动项目

```bash
yarn start
```

## 运行测试

运行单元测试：

```bash
yarn test
```

运行单元测试并查看代码覆盖率：

```bash
yarn coveralls
```

## 添加 Lerna package

添加一个新的 lerna package：

```bash
lerna create my-pack -y
```

将 ui-lib 作为 my-pack 的依赖：

```bash
yarn workspace my-pack add ui-lib/1.0.0
```

将 lodash 添加为所有 package 的依赖(不包含 root）

```bash
yarn workspaces run add lodash
```

将 typescript 设置为 root 的开发依赖

```bash
yarn add -W -D typescript jest
```

## 提交代码

代替 `git commit` 提交：

```bash
yarn commit
```

## 发布

### 设置版本号

```bash
yarn run version:prerelease
```

设置完成后需要 commit 一下代码

### 发布

```bash
yarn run release
```
