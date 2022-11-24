# Contributing to L7

👍🎉 Welcome to contribute code to L7! 🎉👍

## Source Code

```bash
git clone https://github.com/antvis/L7  --depth=1
```

## Pre-installation

### Install Yarn

Since Yarn workspace is used, Yarn needs to be installed first: https://yarnpkg.com/en/docs/install#windows-stable

### Windows environment configuration

[The L7 test solution](https://github.com/antvis/L7/blob/master/dev-docs/%E8%87%AA%E5%8A%A8%E5%8C%96%E6%B5%8B%E8%AF%95%E6%96%B9%E6%A1%88.md) relies on headless-gl, which requires node-gyp [to compile local dependencies](https://github.com/nodejs/node-gyp#on-windows).

1. Start PowerShell as an administrator
2. Run `npm install --global --production windows-build-tools` to install Microsoft's windows-build-tools

See [other issues](https://github.com/antvis/L7/issues/101) during installation.

## Install dependencies

Install dependencies and complete Yarn workspace initialization:

```bash
yarn install
```

### Windows

```bash
copy node_modules/gl/deps/windows/dll/x64/*.dll c:\windows\system32
```

## Run DEMO

Start each package code change monitoring:

```bash
yarn watch
```

Start Storybook, it will automatically open `http://localhost:6006/`:

```bash
yarn storybook
```

## Run test

Run unit tests:

```bash
yarn test
```

Run unit tests and view code coverage:

```bash
yarn coveralls
```

## Add Lerna package

Add a new lerna package:

```bash
lerna create my-pack -y
```

Use ui-lib as a dependency of my-pack:

```bash
yarn workspace my-pack add ui-lib/1.0.0
```

Add lodash as a dependency of all packages (excluding root)

```bash
yarn workspaces run add lodash
```

Set typescript to root development dependency:

```bash
yarn add -W -D typescript jest
```

## Submit code

Instead of `git commit`:

```bash
yarn commit
```

## release

### Set the version number

```bash
yarn run version:prerelease
```

After setting, you need to commit the code

### release

yarn run release
