<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> 简体中文 | [English](./CONTRIBUTING.en-US.md)

🎉 欢迎向 L7 贡献代码! 🎉

# 代码贡献规范

## 1.下载源码

```bash
git clone https://github.com/antvis/L7  --depth=1
```

## 2.前置依赖安装

### 2.1.安装 pnpm

由于使用了 pnpm workspace，首先需要安装 [pnpm](https://pnpm.io/installation)

### 2.2.安装项目依赖

```bash
pnpm install
```

## 3.运行项目

```bash
# 运行 DEMO
pnpm dev
```

**其它命令**：

- `pnpm site:dev` 启动本地官网
- `pnpm test:unit` 运行单元测试
- `pnpm test-cover` 运行单元测试并查看代码覆盖率
- `pnpm test:integration` 运行集成测试
- `pnpm build` 构建源码包, 分别输出 umd, es 和 lib 目录

## 4.代码风格

[CODE GUIDELINES](./CODE_GUIDELINES.md)

## 5.提交代码

### 5.1.Commit 提交规范

根据 [angular 规范](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit-message-format) 提交 commit，这样 history 看起来更加清晰。

提交 commit 的类型，包括以下几种

- feat: 新功能
- fix: 修复问题
- docs: 修改文档
- style: 修改代码格式，不影响代码逻辑
- refactor: 重构代码，理论上不影响现有功能
- perf: 提升性能
- test: 增加修改测试用例
- chore: 修改工具相关（包括但不限于文档、代码生成等）
- deps: 升级依赖

尽量用一句话清楚的描述这次提交做了什么，查看具体参考[文档](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit)。

### 5.2.提交代码变更集

我们使用了 [changesets](https://github.com/changesets/changesets) 进行全自动的语义化发布，当我们开发完成后执行 changeset 并提交变更集。

```bash
pnpm run changeset
git add .
git commit -m "chore: commit changeset"
```

### 5.3.提交 Pull Request

如果你有仓库的开发者权限，而且希望贡献代码，那么你可以创建分支修改代码提交 PR，AntV 开发团队会 review 代码合并到主干。

```bash
# 先创建开发分支开发，分支名应该有含义，避免使用 update、tmp 之类的
$ git checkout -b branch-name

# 提交代码，message 见下面的规范

$ git add . # git add -u 删除文件
$ git commit -m "fix: role.use must xxx"
$ git push origin branch-name
```

提交后就可以在 [L7](https://github.com/antvis/l7/pulls) 创建 Pull Request 了。

由于谁也无法保证过了多久之后还记得多少，为了后期回溯历史的方便，请在提交 MR 时确保提供了以下信息。

1. 需求点（一般关联 issue 或者注释都算）
2. 升级原因（不同于 issue，可以简要描述下为什么要处理）
3. 框架测试点（可以关联到测试文件，不用详细描述，关键点即可）
4. 关注点（针对用户而言，可以没有，一般是不兼容更新等，需要额外提示）

## 6.版本发布

![Release](https://github.com/antvis/L7/assets/26923747/edf6b817-c699-4fbf-8168-0da1cb429031)

### 6.1.线上自动版本发布

> 详细流程 [版本发布指南](https://www.yuque.com/antv/l7/qqburqndl8g584kw?singleDoc)

1. 去 [GitHub Action](https://github.com/antvis/L7/actions/workflows/create-bumb-version-pr.yml) 触发 Create bump version PR Action 执行，选择发布分支，触发 Action 执行

2. 等待 Action 执行完成，执行完成会提一个变更版本的 PR

3. 去确认 PR 版本变更内容，如果没有问题 approve PR，等待发布版本 Action 执行，期间会发布到 NPM、打 tag 到 Github、创建 GitHub Release

4. 第 3 步成功，会进行钉钉消息通知，机器人自动合并 PR，后台自动部署新官网

5. 第 3 步失败，会进行钉钉消息通知，去 GtiHub Action 查看失败原因

### 6.2.手动版本发布

1. 创建本地 `release` 分支
2. 若没有要发布的变更集，执行 `pnpm run changeset` 脚本，创建本次版本发布变更集，执行完成 coomit 变更集
3. 执行 `pnpm run version-packages` 脚本，更新要发布包的版本号和 Changelog，确认内容并 coomit
4. 执行 `pnpm run publish-packages` 脚本，会发布包到 NPM、打 tag 到 GitHub
5. 将 `release` 分支变更内容，以提交 PR 方式合并到发布分支
6. 去 [GitHub Releases](https://github.com/antvis/L7/releases) 创建本次发布的 Release，创建完成后会自动部署新官网

### 6.3.预发版 beta/alpha/next 发布流程

以预发 beta 为例，新增加一个功能，发布 beta 版本：

1. 创建本地 `beta` 分支
2. 执行 `pnpm exec changeset pre enter beta` [命令](https://github.com/changesets/changesets/blob/main/docs/command-line-options.md#pre)🔗，进入 `beta` 预发模式
3. 完成功能研发、添加变更集、push 到远端 `beta` 分支
4. 版本发布，与线上自动版本发布流程一致，也可以选择手动发布版本

beta 版本发布验证完成后，合并到主分支发布流程：

1. 执行 `pnpm exec changeset pre exit` [命令](https://github.com/changesets/changesets/blob/main/docs/command-line-options.md#pre)🔗，退出预发模式
2. 将 `beta` 分支变更内容，以提交 PR 方式合并到主分支
3. 版本发布，与线上自动版本发布流程一致，也可以选择手动发布版本
