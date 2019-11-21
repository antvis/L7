# CoreJS Upgrade Webpack Plugin

I wrote this to ensure the latest version of core-js is used everywhere in an application.

Sometimes you're depending on components or libraries that haven't updated yet, and this can increase bundle-size, or even break your app if these dependencies didn't have core-js as a dependency themselves.

This Webpack Plugin will essentially do a search and replace on all requires and if the require path matches `/core-js/` it will try and resolve the require.
If it can, nothing happens. If the resolve fails (this would normally break your app) this plugin tries to map the old core-js path to the new path structure, and resolve that instead.

This plugin will allow you to specify a `resolveFrom` option, so you can resolve core-js from any path you'd like.
This is useful if you know there are going to be multiple core-js version installed, and you want to pick a specific one installed somewhere.

## Install

```sh
yarn add corejs-upgrade-webpack-plugin
```

## Usage

simple example:

```js
import CoreJSUpgradeWebpackPlugin from 'corejs-upgrade-webpack-plugin';

// add this to your webpack.plugins config
new CoreJSUpgradeWebpackPlugin();
```

example with options:

```js
import CoreJSUpgradeWebpackPlugin from 'corejs-upgrade-webpack-plugin';

// add this to your webpack.plugins config
new CoreJSUpgradeWebpackPlugin({
  resolveFrom: process.cwd(),
});
```
