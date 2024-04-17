<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> [简体中文](./CONTRIBUTING.md)｜English

🎉 Welcome to contribute code to L7! 🎉

# Contribution Guide

## 1.Source Code

```bash
git clone https://github.com/antvis/L7  --depth=1
```

## 2.Pre-installation

### 2.1.Install pnpm

Since pnpm workspace is used, [pnpm](https://pnpm.io/installation) needs to be installed first

### 2.2.Install dependencies

```bash
pnpm install
```

## 3.Run Project

```bash
# Run DEMO
pnpm dev
```

**Other commands**：

- `pnpm site:dev` Run local website
- `pnpm test:unit` Run unit tests
- `pnpm test-cover` Run unit tests and view code coverage:
- `pnpm test:integration` Run integration tests
- `pnpm build` build source code pakages, output to umd, es and lib directory

## 4.Style Guide

[CODE GUIDELINES](./CODE_GUIDELINES.md)

## 5.Submitting Code

### 5.1.Commit Message Format

You are encouraged to use [angular commit-message-format](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit-message-format) to write commit message. In this way, we could have a more trackable history and an automatically generated changelog.

Commit type must be one of the following:

- feat: A new feature
- fix: A bug fix
- docs: Documentation-only changes
- style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- refactor: A code change that neither fixes a bug nor adds a feature
- perf: A code change that improves performance
- test: Adding missing tests
- chore: Changes to the build process or auxiliary tools and libraries such as documentation generation

Use succinct words to describe what did you do in the commit change. Look at [these files](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit) for more details.

### 5.2.Submit code changeset

we use [changesets](https://github.com/changesets/changesets) for fully automated semantic releases. It can automatically create GitHub Releases and automatically associate the release to the corresponding issue. When we complete development, execute changeset and submit the changeset.

```bash
pnpm run changeset
git add .
git commit -m "chore: commit changeset"
```

### 5.3.Pull Request Guide

If you are developer of AntV repo and you are willing to contribute, feel free to create a new branch, finish your modification and submit a PR. AntV group will review your work and merge it to master branch.

```bash
# Create a new branch for development. The name of branch should be semantic, avoiding words like 'update' or 'tmp'. We suggest to use feature/xxx, if the modification is about to implement a new feature.
$ git checkout -b branch-name

# Push your work back to us. Notice that the commit message should be written in the following format.
$ git add . # git add -u to delete files
$ git commit -m "fix: role.use must xxx"
$ git push origin branch-name
```

Then you can create a Pull Request at [L7](https://github.com/antvis/l7/pulls).

No one can guarantee how much will be remembered about certain PR after some time. To make sure we can easily recap what happened previously, please provide the following information in your PR.

1. Need: What function you want to achieve (Generally, please point out which issue is related).
2. Updating Reason: Different with issue. Briefly describe your reason and logic about why you need to make such modification.
3. Related Testing: Briefly describe what part of testing is relevant to your modification.
4. User Tips: Notice for scale users. You can skip this part, if the PR is not about update in API or potential compatibility problem.

## 6.Release

![Release](https://github.com/antvis/L7/assets/26923747/edf6b817-c699-4fbf-8168-0da1cb429031)

### 6.1.Online automatic version release

1. Go to [GitHub Action](https://github.com/antvis/L7/actions/workflows/create-bumb-version-pr.yml) to trigger Create bump version PR Action execution, select the release branch, and trigger Action execution

2. Wait for the Action to be executed. When the execution is completed, a PR of the changed version will be raised.

3. Confirm the PR version changes. If there is no problem, approve the PR and wait for the release version Action to be executed. During this period, it will be published to NPM, tagged to GitHub, and GitHub Release will be created.

4. If step 3 is successful, DingTalk will be notified, the robot will automatically merge the PR, and the new official website will be automatically deployed in the background.

5. If step 3 fails, a DingTalk message will be notified. Go to GtiHub Action to check the reason for the failure.

### 6.2.Manual version release

1. Create a local `release` branch
2. If there is no change set to be published, execute the `pnpm run changeset` script to create a change set for this version release, and execute the coomit change set
3. Execute the `pnpm run version-packages` script, update the version number and Changelog of the package to be released, confirm the content and coomit
4. Execute the `pnpm run publish-packages` script, which will publish the package to NPM and tag it to GitHub
5. Merge the changes in the `release` branch to the release branch by submitting a PR
6. Go to [GitHub Releases](https://github.com/antvis/L7/releases) to create a Release for this release. After the creation is completed, the new official website will be automatically deployed.

### 6.3.Pre-release beta/alpha/next release process

Taking the pre-release beta as an example, a new function is added to release the beta version:

1. Create a local `beta` branch
2. Execute `pnpm exec changeset pre enter beta` [command](https://github.com/changesets/changesets/blob/main/docs/command-line-options.md#pre)🔗 to enter `beta` pre hair mode
3. Complete function development, add change sets, and push to the remote `beta` branch
4. Version release is consistent with the online automatic version release process. You can also choose to release the version manually.

After the beta version release verification is completed, it is merged into the main branch release process:

1. Execute `pnpm exec changeset pre exit` [Command](https://github.com/changesets/changesets/blob/main/docs/command-line-options.md#pre)🔗 to exit pre-release mode
2. Merge the changes in the `beta` branch to the main branch by submitting a PR
3. Version release is consistent with the online automatic version release process. You can also choose to release the version manually.
