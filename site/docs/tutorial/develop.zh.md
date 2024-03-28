---
title: 开发者教程
order: 5
---

<embed src="@/docs/api/common/style.md"></embed>

这里的开发者，是指开发 L7 的开发者，为 L7 修复 bug、完善文档、升级功能、新功能开发等能力。

### Fork 仓库

Fork L7 仓库 到自己的空间。

### 下载 Fork 后的代码

```bash

git clone https://github.com/antvis/L7  --depth=1

```

### 安装依赖

node 版本推荐 v16.20.2

```bash
yarn install

```

### 启动 Demo

如需功能调试

```bash

yarn run dev

```

打开 `http://localhost:6006/`：

### 启动 官网

如需更新 API 或者 写文档、demo,使用该命令

```bash

yarn start

```

打开 `http://localhost:8000/`：

### 运行单测

运行单元测试：

```bash
yarn test // 全量跑

yarn test ../tes.spec.ts // 单个文件

```

## 提交代码

可以使用 yarn commit 模板化提交：

```bash
yarn commit

```

## 开发任务

L7 Issue 和 Feature 通过开源社区的方式运作管理，可以完全的开放的探索、交流技术方案。开发任务，[认领查看](https://github.com/orgs/antvis/projects/16)

针对 L7 开发者 我们制定了成长计划，帮助大家从初级走向高级 GIS 领域 可视化引擎开发者。如有兴趣可以加 微信 "antv2030",注明 “参与L7研发”，期待你加入，一起学习。
