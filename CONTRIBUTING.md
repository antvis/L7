<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> 简体中文 | [English](./CONTRIBUTING.en-US.md)

👍🎉 欢迎向 L7 贡献代码! 🎉👍

# 代码贡献规范

## 下载源码

```bash
git clone https://github.com/antvis/L7  --depth=1
```

## 前置依赖安装

### 安装 pnpm

由于使用了 pnpm workspace，首先需要安装 [pnpm](https://pnpm.io/installation)

### 安装项目依赖

```bash
pnpm install
```

## 运行项目

- `pnpm dev` 运行 DEMO
- `pnpm site:dev` 启动本地官网
- `pnpm test:unit` 运行单元测试
- `pnpm test-cover` 运行单元测试并查看代码覆盖率
- `pnpm test:integration` 运行集成测试
- `pnpm build` 构建源码包, 分别输出 umd, es 和 lib 目录

## 代码风格

[CODE_GUIDELINES](./CODE_GUIDELINES.md)

## 提交代码

### 提交 Pull Request

如果你有仓库的开发者权限，而且希望贡献代码，那么你可以创建分支修改代码提交 PR，AntV 开发团队会 review 代码合并到主干。

```bash
# 先创建开发分支开发，分支名应该有含义，避免使用 update、tmp 之类的
$ git checkout -b branch-name

# 开发完成后跑下测试是否通过，必要时需要新增或修改测试用例
$ npm test

# 测试通过后，提交代码，message 见下面的规范

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

### Commit 提交规范

根据 [angular 规范](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit-message-format)提交 commit，这样 history 看起来更加清晰。

```xml
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

（1）type

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

（2）scope

修改文件的范围

（3）subject

用一句话清楚的描述这次提交做了什么

（4）body

补充 subject，适当增加原因、目的等相关因素，也可不写。

（5）footer

- **当有非兼容修改(Breaking Change)时必须在这里描述清楚**
- 关联相关 issue，如 `Closes #1, Closes #2, #3`

示例

```bash
fix($compile): [BREAKING_CHANGE] couple of unit tests for IE9

Older IEs serialize html uppercased, but IE9 does not...
Would be better to expect case insensitive, unfortunately jasmine does
not allow to user regexps for throw expectations.

Document change on antvis/g#12

Closes #392

BREAKING CHANGE:

  Breaks foo.bar api, foo.baz should be used instead
```

查看具体[文档](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit)

### 提交代码变更集

我们使用了 [changesets](https://github.com/changesets/changesets) 进行全自动的语义化发布，当我们开发完成后执行 changeset 并提交变更集。

```bash
pnpm run changeset
git add .
git commit -a -m "chore: commit changeset"
```

## 发布管理

![Release](https://github.com/antvis/L7/assets/26923747/edf6b817-c699-4fbf-8168-0da1cb429031)

### 线上自动版本发布

1. 去 [GitHub Action](https://github.com/antvis/L7/actions/workflows/create-bumb-version-pr.yml) 触发 Create bump version PR Action 执行，选择发布分支，触发 Action 执行

![image.png](https://cdn.nlark.com/yuque/0/2024/png/196672/1712567418749-9cd348ec-18ce-412b-a943-5e005d69cb87.png#averageHue=%23f4ca92&clientId=uedbbbfd2-9b30-4&from=paste&height=1090&id=fPXKn&originHeight=1090&originWidth=3334&originalType=binary&ratio=1&rotation=0&showTitle=false&size=302270&status=done&style=stroke&taskId=ua8bba935-a23c-4aea-bf7b-cc6ccbe0bae&title=&width=3334)

2. 等待 Action 执行完成，执行完成会提一个变更版本的 PR

![image.png](https://cdn.nlark.com/yuque/0/2024/png/196672/1712567419188-7caaec0c-4abf-406f-961a-8b290dfd9b24.png#averageHue=%23e3e161&clientId=uedbbbfd2-9b30-4&from=paste&height=1416&id=j2tFP&originHeight=1416&originWidth=3578&originalType=binary&ratio=1&rotation=0&showTitle=false&size=261873&status=done&style=stroke&taskId=u8fc4ab77-a5cd-495a-ad90-95dc46ef00a&title=&width=3578)

3. 去确认 PR 版本变更内容，如果没有问题 approve PR，等待发布版本 Action 执行，期间会发布到 NPM、打 tag 到 Github、创建 GitHub Release

![确认 PR 版本变更内容](https://cdn.nlark.com/yuque/0/2024/png/196672/1712567418838-1efda60d-0f1e-4aa0-bb62-0143ccd2ec74.png#averageHue=%23fefefe&clientId=uedbbbfd2-9b30-4&from=paste&height=1702&id=OkIVa&originHeight=1702&originWidth=2568&originalType=binary&ratio=1&rotation=0&showTitle=true&size=488489&status=done&style=stroke&taskId=u905e9437-d38a-421c-b690-65b2e877bf0&title=%E7%A1%AE%E8%AE%A4%20PR%20%E7%89%88%E6%9C%AC%E5%8F%98%E6%9B%B4%E5%86%85%E5%AE%B9&width=2568 '确认 PR 版本变更内容')
![Approve PR](https://cdn.nlark.com/yuque/0/2024/png/196672/1712567419178-e830a2bd-2395-42d9-b508-8bea28aad477.png#averageHue=%23a3751a&clientId=uedbbbfd2-9b30-4&from=paste&height=1754&id=CVZvu&originHeight=1754&originWidth=3578&originalType=binary&ratio=1&rotation=0&showTitle=true&size=663654&status=done&style=stroke&taskId=u8a59ffb0-d799-409c-8983-72dbed6bcbf&title=Approve%20PR&width=3578 'Approve PR')
![Release Action](https://cdn.nlark.com/yuque/0/2024/png/196672/1712567418674-af123ce6-4372-4201-9a67-c8dbf2d42a08.png#averageHue=%23bc9422&clientId=uedbbbfd2-9b30-4&from=paste&height=1256&id=z8Y11&originHeight=1256&originWidth=2322&originalType=binary&ratio=1&rotation=0&showTitle=true&size=340425&status=done&style=stroke&taskId=u515d58b1-cbd4-4491-85ca-3ce6741bc0e&title=Release%20Action&width=2322 'Release Action')

4. 第 3 步成功，会进行钉钉消息通知，机器人自动合并 PR，后台自动部署新官网

![image.png](https://cdn.nlark.com/yuque/0/2024/png/196672/1712567419262-f24c8e03-1db0-4078-a069-9e54bcedc594.png#averageHue=%23e3dd56&clientId=uedbbbfd2-9b30-4&from=paste&height=996&id=dXQ3F&originHeight=996&originWidth=2526&originalType=binary&ratio=1&rotation=0&showTitle=false&size=349299&status=done&style=stroke&taskId=ub9261ebf-b752-4dcc-820c-5953023bf6c&title=&width=2526)

5. 第 3 步失败，会进行钉钉消息通知，去 GtiHub Action 查看失败原因

### 手动版本发布

1. 创建本地 `release` 分支
2. 若没有要发布的变更集，执行 `pnpm run changeset` 脚本，创建本次版本发布变更集，执行完成 coomit 变更集
3. 执行 `pnpm run version-packages` 脚本，更新要发布包的版本号和 Changelog，确认内容并 coomit
4. 执行 `pnpm run publish-packages` 脚本，会发布包到 NPM、打 tag 到 GitHub
5. 将 `release` 分支变更内容，以提交 PR 方式合并到发布分支
6. 去 [GitHub Releases](https://github.com/antvis/L7/releases) 创建本次发布的 Release，创建完成后会自动部署新官网

### 预发版 beta/alpha/next 发布流程

以预发 beta 为例，新增加一个功能，发布 beta 版本：

1. 创建本地 `beta` 分支
2. 执行 `pnpm exec changeset pre enter beta` [命令](https://github.com/changesets/changesets/blob/main/docs/command-line-options.md#pre)🔗，进入 `beta` 预发模式
3. 完成功能研发、添加变更集、push 到远端 `beta` 分支
4. 版本发布，与线上自动版本发布流程一致，也可以选择手动发布版本

beta 版本发布验证完成后，合并到主分支发布流程：

1. 执行 `pnpm exec changeset pre exit` [命令](https://github.com/changesets/changesets/blob/main/docs/command-line-options.md#pre)🔗，退出预发模式
2. 将 `beta` 分支变更内容，以提交 PR 方式合并到主分支
3. 版本发布，与线上自动版本发布流程一致，也可以选择手动发布版本
