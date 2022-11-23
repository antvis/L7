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

[L7 测试方案](https://github.com/antvis/L7/blob/master/dev-docs/%E8%87%AA%E5%8A%A8%E5%8C%96%E6%B5%8B%E8%AF%95%E6%96%B9%E6%A1%88.md)依赖 headless-gl，其中需要 node-gyp [编译本地依赖](https://github.com/nodejs/node-gyp#on-windows)。

1. 首先以管理员身份启动 PowerShell
2. 运行 `npm install --global --production windows-build-tools`，安装 Microsoft's windows-build-tools

安装过程中其他问题[详见](https://github.com/antvis/L7/issues/101)。

## 安装依赖

安装依赖并完成 Yarn workspace 初始化：

```bash
yarn install
```

### Windows

```bash
copy node_modules/gl/deps/windows/dll/x64/*.dll c:\windows\system32
```

## 运行 DEMO

```bash
yarn dev
```

打开 `http://localhost:6006/`：

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

yarn run release
