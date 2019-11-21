# TypeScript loader for Webpack

[![Join the chat at https://gitter.im/s-panferov/awesome-typescript-loader](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/s-panferov/awesome-typescript-loader?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/s-panferov/awesome-typescript-loader.svg?branch=master)](https://travis-ci.org/s-panferov/awesome-typescript-loader)

See also:

1. [tygen](https://github.com/s-panferov/tygen) — TypeScript documentation generator.

## Installation

```
npm install awesome-typescript-loader --save-dev
```

## Performance issues

Please note that ATL works **the same way as a TypeScript compiler** as much as possible. So please be careful with your `files`/`exclude`/`include` sections.

**ADVICE**: Turn on `useCache` option.

**ADVICE**: Typically you want your `files` section to include only entry points.

**ADVICE**: The loader works faster if you use `isolatedModules` or `forceIsolatedModules` options.

**ADVICE**: The loader works faster if you will use `reportFiles` to restrict
checking scope.

**ADVICE**: Use the loader together with [hard-source-webpack-plugin](https://github.com/mzgoddard/hard-source-webpack-plugin)

The world is changing, other solutions are evolving and ATL may work **slower**
for [some workloads](https://github.com/s-panferov/awesome-typescript-loader/issues/497). Feel free to try [`ts-loader`](https://github.com/TypeStrong/ts-loader) with [`HappyPack` ](https://github.com/amireh/happypack) or [`thread-loader`](https://webpack.js.org/loaders/thread-loader/) and [hard-source-webpack-plugin](https://github.com/mzgoddard/hard-source-webpack-plugin).

## Differences between [`ts-loader`](https://github.com/TypeStrong/ts-loader)

`awesome-typescript-loader` loader was created mostly to speed-up compilation in my own projects.
Some of them are quite big and I wanted to have full control on how my files are compiled. There are two major points:

1) atl has first-class integration with Babel and enables caching possibilities. This can be useful for those who use Typescript with Babel.
When `useBabel` and `useCache` flags are enabled, typescript's emit will be transpiled with Babel and cached.
So next time if source file (+environment) has the same checksum we can totally skip typescript's and babel's transpiling.
This significantly reduces build time in this scenario.

2) atl is able to fork type-checker and emitter to a separate process, which also speeds-up some development scenarios (e.g. react with react-hot-loader)
So your webpack compilation will end earlier and you can explore compiled version in your browser while your files are typechecked.

## Configuration

1. Add `.ts` as a resolvable extension.
2. Configure all files with a `.ts` extension to be handled by `awesome-typescript-loader`.

**webpack.config.js**

```javascript
// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {

  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },

  // Source maps support ('inline-source-map' also works)
  devtool: 'source-map',

  // Add the loader for .ts files.
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  plugins: [
      new CheckerPlugin()
  ]
};
```

After that, you will be able to build TypeScript files with webpack.

## NodeJS versions

**The loader supports NodeJS 4 and newer.**

## tsconfig.json

You can use the tsconfig.json file to configure your compiler and loader:

```
{
    "compilerOptions": {
        "noImplicitAny": true,
        "removeComments": true
    },
    "awesomeTypescriptLoaderOptions": {
        /* ... */
    }
}
```

## Supported TypeScript

`awesome-typescript-loader@2.x` aims to support only `typescript@2.x` and `webpack@2x`, if you need old compilers please use
`1.x` or `0.x` versions.

## Advanced path resolution in TypeScript 2.0

If you want to use new `paths` and `baseUrl` feature of TS 2.0 please include `TsConfigPathsPlugin`.
This feature is available only for `webpack@2.1`.

```
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

resolve: {
    plugins: [
        new TsConfigPathsPlugin(/* { configFileName, compiler } */)
    ]
}
```

## Loader options

### silent *(boolean) (default=false)*

No logging from the checker. Please note that this option disables async error reporting because
this option bans `console.log()` usage.

### compiler *(string) (default='typescript')*

Allows use of TypeScript compilers other than the official one. Must be
set to the NPM name of the compiler, e.g. *ntypescript* or the path to a package folder.
Note that the compiler must be installed in **your** project. You can also use
nightly versions.

### useTranspileModule (boolean) (default=false)*

Use fast `transpileModule` emit mode. Disables automatically when you set compilerOption `declaration: true` ([reference](https://www.typescriptlang.org/docs/handbook/compiler-options.html)).

### instance *(string) (default='at-loader')*

Allows the use of several TypeScript compilers with different settings in one app. Override `instance` to initialize another instance.

### configFileName *(string) (default='tsconfig.json')*

Specifies the path to a TS config file. This is useful when you have multiple config files. This setting is useless *inside* a TS config file.

### transpileOnly *(boolean)*

Use this setting to disable type checking, enabling this will nullify the `CheckerPlugin` usage in your webpack configuration.

### errorsAsWarnings *(boolean)*

Emit all typescript errors as warnings.

### forceIsolatedModules *(boolean)*

Use this setting to disable dependent module recompilation.

### ignoreDiagnostics *(number[]) (default=[])*

You can squelch certain TypeScript errors by specifying an array of [diagnostic codes](https://github.com/Microsoft/TypeScript/blob/master/src/compiler/diagnosticMessages.json) to ignore.
For example, you can transpile [stage 1 properties](https://github.com/jeffmo/es-class-fields-and-static-properties) from `*.js` using `"ignoreDiagnostics": [8014]`.

### useBabel *(boolean) (default=false)*

Invoke Babel to transpile files. Useful with ES6 target. Please see `useCache` option
which can improve warm-up time.

If you're using `babelOptions`, anything in `.babelrc` will take precedence. This breaks expected usage for scenarios where you need two sets of Babel configs (example: one for Webpack, one for your build tools).

You may want to `"babelrc": false` to disable `.babelrc` if you don't want it:

```json
{
    "useBabel": true,
    "babelOptions": {
        "babelrc": false, /* Important line */
        "presets": [
            ["@babel/preset-env", { "targets": "last 2 versions, ie 11", "modules": false }]
        ]
    },
    "babelCore": "@babel/core", // needed for Babel v7
}
```

### babelCore *(string) (default=undefined)*

Override the path used to find `babel-core`. Useful if `node_modules` is installed in a non-standard place or webpack is being invoked from a directory not at the root of the project.

For Babel 7, this should be set to `"@babel/core"`.

### babelOptions *(object) (default=null)*

Use this option to pass some options to Babel (e.g. presets). Please note that
[`.babelrc` file](https://babeljs.io/docs/usage/babelrc/) is more universal way to do this.

### useCache *(boolean) (default=false)*

Use internal file cache. This is useful with Babel, when processing takes a long time to complete. Improves warm-up time.

### usePrecompiledFiles *(boolean) (default=false)*

Use pre-compiled files if any. Files must be named as `{filename}.js` and `{filename}.map`.

### cacheDirectory *(string) (default='.awcache')*

Directory where cache is stored.

### reportFiles *(string[])*

Specify [globs](https://github.com/isaacs/minimatch) to report file diagnostics. ALL OTHER ERRORS WILL NOT BE REPORTED. Example:

```
reportFiles: [
    "src/**/*.{ts,tsx}"
]
```

### getCustomTransformers *(string | ((program: ts.Program) => ts.CustomTransformers | undefined)) (default=undefined)*

Provide custom transformers, TypeScript 2.4.1+. Example:

```js
const styledComponentsTransformer = require('typescript-plugin-styled-components').default;
const keysTransformer = require('ts-transformer-keys/transformer').default;

// ...
rules: [
    {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
            // ... other loader's options
            getCustomTransformers: program => ({
                before: [
                    styledComponentsTransformer(),
                    keysTransformer(program)
                ]
            })
        }
    }
]
```

## Compiler options

You can pass compiler options inside the loader query string or in a TS config file.
