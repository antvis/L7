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

Since the new Node for Windows already includes tools for building, there is no need to rely on installing Windows-build-Tools as before.

Required environment: 'python>= 3.6.0&&node >= 16.16.0' (node version v16.20.2 recommended)

1. The first installation > = 3.6.0 python version, can be in the website (https://www.python.org/downloads/) installed directly, also can download package management tools such as conda first before you install python

2. Open the CLI and run it

```
where python
```

Find your native python installation path，Such as...

```
C:\Users\42297\anaconda3\python.exe
```

3.Then switch to the project path

```bash
npm config set python "${path}\python.exe"
```

At this point, the required dependencies are installed.

See [other issues](https://github.com/antvis/L7/issues/101) during installation.

## Install dependencies

Install dependencies and complete Yarn workspace initialization:

```bash
yarn install

```

## Run DEMO

Start each package code change monitoring:

```bash
yarn  run dev
```

Start Storybook, it will automatically open `http://localhost:6006/`:

## Start-up project

```bash
yarn start
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
