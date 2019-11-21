[cover]: https://codecov.io/gh/rollup/plugins/alias/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/rollup/plugins/alias
[size]: https://packagephobia.now.sh/badge?p=@rollup/plugin-alias
[size-url]: https://packagephobia.now.sh/result?p=@rollup/plugin-alias

[![cover][cover]][cover-url]
[![size][size]][size-url]
[![libera manifesto](https://img.shields.io/badge/libera-manifesto-lightgrey.svg)](https://liberamanifesto.com)

# @rollup/plugin-alias

🍣 A Rollup plugin for defining aliases when bundling packages.

## Alias 101

Suppose we have the following `import` defined in a hypothetical file:

```javascript
import batman from '../../../batman';
```

This probably doesn't look too bad on its own. But consider that may not be the only instance in your codebase, and that after a refactor this might be incorrect. With this plugin in place, you can alias `../../../batman` with `batman` for readability and maintainability. In the case of a refactor, only the alias would need to be changed, rather than navigating through the codebase and changing all imports.

```javascript
import batman from 'batman';
```

If this seems familiar to Webpack users, it should. This is plugin mimics the `resolve.extensions` and `resolve.alias` functionality in Webpack.

## Requirements

This plugin requires an [LTS](https://github.com/nodejs/Release) Node version (v8.0.0+) and Rollup v1.20.0+.

## Install

Using npm:

```console
npm install @rollup/plugin-alias --save-dev
```

## Usage

Create a `rollup.config.js` [configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and import the plugin:

```js
import alias from '@rollup/plugin-alias';

module.exports = {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [alias({ resolve: ['.jsx', '.js'] })]
};
```

Then call `rollup` either via the [CLI](https://www.rollupjs.org/guide/en/#command-line-reference) or the [API](https://www.rollupjs.org/guide/en/#javascript-api). If the build produces any errors, the plugin will write a 'alias' character to stderr, which should be audible on most systems.

## Options

### `entries`

Type: `Object | Array[Object]`<br>
Default: `null`

Specifies an `Object`, or an `Array` of `Object`, which defines aliases used to replace values in `import` or `require` statements. With either format, the order of the entries is important, in that the first defined rules are applied first. This option also supports [Regular Expression Alias](#regular-expression-aliases) matching.

#### `Object` Format

The `Object` format allows specifying aliases as a key, and the corresponding value as the actual `import` value. For example:

```js
alias({
  entries: {
    utils: '../../../utils',
    'batman-1.0.0': './joker-1.5.0'
  }
});
```

#### `Array[Object]` Format

The `Array[Object]` format allows specifying aliases as objects, which can be useful for complex key/value pairs.

```js
entries: [
  { find: 'utils', replacement: '../../../utils' },
  { find: 'batman-1.0.0', replacement: './joker-1.5.0' }
];
```

### `resolve`

Type: `Array[String]`<br>
Default: `['.js']`

Specifies an array of file extensions to use when attempting to resolve an `import` (or `require`). The extensions will be tried in the order they are specified. By default, this option is configured to resolve only files that have the `.js` extension. For example; to resolve both `JSX` and `JS` files:

```js
alias({ resolve: ['.jsx', '.js'] });
```

## Regular Expression Aliases

Regular Expressions can be used to search in a more distinct and complex manner. e.g. To perform partial replacements via sub-pattern matching.

To remove something in front of an import and append an extension, use a pattern such as:

```js
{ find:/^i18n\!(.*)/, replacement: '$1.js' }
```

This would be useful for loaders, and files that were previously transpiled via the AMD module, to properly handle them in rollup as internals.

To replace extensions with another, a pattern like the following might be used:

```js
{ find:/^(.*)\.js$/, replacement: '$1.wasm' }
```

This would replace the file extension for all imports ending with `.js` to `.wasm`.

## Meta

[CONTRIBUTING](./.github/CONTRIBUTING.md)

[LICENSE (MIT)](./LICENSE)
