# react-github-button

[![](https://img.shields.io/travis/benjycui/react-github-button.svg?style=flat-square)](https://travis-ci.org/benjycui/react-github-button)
[![npm package](https://img.shields.io/npm/v/react-github-button.svg?style=flat-square)](https://www.npmjs.org/package/react-github-button)
[![NPM downloads](http://img.shields.io/npm/dm/react-github-button.svg?style=flat-square)](https://npmjs.org/package/react-github-button)
[![Dependency Status](https://david-dm.org/benjycui/react-github-button.svg?style=flat-square)](https://david-dm.org/benjycui/react-github-button)

Unofficial GitHub buttons in React.

## Installation

```bash
npm install --save react-github-button
```

## Usage

```jsx
import GitHubButton from 'react-github-button';

ReactDOM.render(
  <GitHubButton type="stargazers" size="large" namespace="benjycui" repo="react-github-button" />
  , mountNode
);
```

## API

### type

> Enum{ 'stargazers', 'watchers', 'forks' }

### size

> Enum{ 'default', 'large' }

### namespace

> String

Your GitHub id or organization name.

### repo

> String

The name of your repository.

## Liscense

MIT
