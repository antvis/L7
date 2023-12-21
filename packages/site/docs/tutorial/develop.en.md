---
title: Develop
order: 5
---

<embed src="@/docs/api/common/style.md"></embed>

The developers here refer to developers who develop L7 and have the ability to fix bugs, improve documentation, upgrade functions, and develop new functions for L7.

### Fork warehouse

Fork the L7 repository into its own space.

### Download the code after Fork

```bash
git clone https://github.com/antvis/L7  --depth=1
```

### Install dependencies

node version recommended v16.20.2

```bash
yarn install
```

### Start Demo

If you need function debugging

```bash
yarn run dev
```

Open`http://localhost:6006/`：

### Start official website

If you need to update the API or write documentation or demo, use this command

```bash
yarn start
```

Open`http://localhost:8000/`：

### Run a single test

Run unit tests:

```bash
yarn test // run in full

yarn test ../tes.spec.ts // single file
```

## Submit code

Commits can be templated using yarn commit:

```bash
yarn commit
```

## Development tasks

L7 Issues and Features are operated and managed through open source communities, allowing for completely open exploration and exchange of technical solutions. development tasks,[Claim View](https://github.com/orgs/antvis/projects/16)

For L7 developers, we have formulated a growth plan to help everyone move from junior to advanced visualization engine developers in the GIS field. If you are interested, you can add WeChat "antv2030" and indicate "Participate in L7 R\&D". We look forward to your joining and learning together.
