# Babel PostCSS Transform

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Dependencies][david-image]][david-url]
[![devDependencies][david-dev-image]][david-dev-url]

A [Babel][babel] plugin to process CSS files via [PostCSS][postcss].

Using [PostCSS Modules][postcss-modules], it can transform:

```js
import styles from './styles';
```

```css
.example { color: cyan; }
```

Into an object that has properties mirroring the style names:

```js
var styles = {"example":"_example_amfqe_1"};
```

## Configuration

Install the transform as well as `postcss` and any PostCSS plugins you want to
use:

```bash
npm install --save-dev \
  babel-plugin-transform-postcss \
  postcss \
  postcss-modules
```

Add the transform to your babel configuration, i.e. `.babelrc`:

```json
{
  "presets": [
    ["env", { "targets": { "node": "current" }}]
  ],
  "plugins": [
    "transform-postcss"
  ]
}
```

Create a [`postcss.config.js`][postcss-load-config]:

```js
module.exports = (ctx) => ({
  plugins: [
    require('postcss-modules')({
      getJSON: ctx.extractModules || (() => {}),
    }),
  ],
});
```

You can also specify a location to load your `postcss.config.js` from in the options in your Babel configuration, i.e. `.babelrc`:
```json
{
  "plugins": [
    ["transform-postcss", {
      "config": "configuration/postcss.config.js"
    }]
  ]
}
```

## Details

The transform will transform all imports & require statements that have a `.css`
extension and run them through `postcss`. To determine the PostCSS config, it
uses [`postcss-load-config`][postcss-load-config] with
[additional context values](#postcss-load-config-context). One of those config
values, [`extractModules`](#extractmodules_-any-modules-object) should be
invoked in order to define the value of the resulting import.

No CSS is actually included in the resulting JavaScript. It is expected that you
transform your CSS using the same `postcss.config.js` file as the one used by
this transform. We recommend:

- [`postcss-cli`][postcss-cli] (v3 or later)
- [`gulp-postcsssrc`][gulp-postcssrc]

Finally, it's worth noting that this transform also adds a comment to the
generated code indicating the related CSS file so that it can be processed by
other tools, i.e. [`relateify`][relateify].

### PostCSS Load Config Context

#### `extractModules(_: any, modules: object)`

This option is a function that may be passed directly on to
[`postcss-modules`][postcss-modules] as the [`getJSON`
argument][postcss-modules-get-json]. Other uses, while unlikely, are
permittable, as well.

The function accepts two arguments. The transform uses only the
second value passed to the function. That value is the object value that
replaces the `import`/`require`.

## Using with Browserify & Watchify

This will work well with the [`babelify`][babelify] transform, but if you're
using [`watchify`][watchify], you will want to add the [`relateify`][relateify]
transform in order to ensure that changes to CSS files rebuild the appropriate
JS files.

## Caching

This module caches the results of the compilation of CSS files and stores the
cache in a directory under `/tmp/bptp-UNIQUE_ID`. The cache is only invalidated
when the CSS file contents change and not when the `postcss.config.js` file
changes (due to limitations at the time of implementation). Try removing the
cache if you're not seeing expected changes.

## Prior Art

This plugin is based of the work of:

- [`css-modules-transform`][css-modules-transform]
- [`css-modules-require-hook`][css-modules-require-hook]

Unlike the above, it supports both synchronous and asynchronous PostCSS plugins.

## License

This project is distributed under the MIT license.

[babel]: https://babeljs.io/
[postcss]: http://postcss.org/
[postcss-cli]: https://github.com/postcss/postcss-cli
[postcss-modules]: https://github.com/css-modules/postcss-modules
[postcss-modules-get-json]: https://github.com/css-modules/postcss-modules#saving-exported-classes
[postcss-load-config]: https://github.com/michael-ciniawsky/postcss-load-config
[css-modules-transform]: https://github.com/michalkvasnicak/babel-plugin-css-modules-transform
[css-modules-require-hook]: https://github.com/css-modules/css-modules-require-hook
[gulp-postcssrc]: https://github.com/michael-ciniawsky/gulp-postcssrc
[babelify]: https://github.com/babel/babelify
[watchify]: https://github.com/substack/watchify
[relateify]: https://github.com/wbyoung/relateify

[travis-image]: http://img.shields.io/travis/wbyoung/babel-plugin-transform-postcss.svg?style=flat
[travis-url]: http://travis-ci.org/wbyoung/babel-plugin-transform-postcss
[npm-image]: http://img.shields.io/npm/v/babel-plugin-transform-postcss.svg?style=flat
[npm-url]: https://npmjs.org/package/babel-plugin-transform-postcss
[coverage-image]: http://img.shields.io/coveralls/wbyoung/babel-plugin-transform-postcss.svg?style=flat
[coverage-url]: https://coveralls.io/r/wbyoung/babel-plugin-transform-postcss
[david-image]: http://img.shields.io/david/wbyoung/babel-plugin-transform-postcss.svg?style=flat
[david-url]: https://david-dm.org/wbyoung/babel-plugin-transform-postcss
[david-dev-image]: http://img.shields.io/david/dev/wbyoung/babel-plugin-transform-postcss.svg?style=flat
[david-dev-url]: https://david-dm.org/wbyoung/babel-plugin-transform-postcss#info=devDependencies
