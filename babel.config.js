// @see https://babeljs.io/docs/en/next/config-files#project-wide-configuration
module.exports = (api) => {
  api.cache(() => process.env.NODE_ENV);
  const isSite = api.env('site');
  const isCDNBundle = api.env('bundle');
  const isCommonJS = api.env('cjs');
  const isESModule = api.env('esm');
  const isTest = api.env('test');

  if (isSite) {
    return {
      skipEnvCheck: true,
      presets: [
        '@babel/preset-env',
        [
          '@babel/preset-react',
          {
            development: isCommonJS,
          },
        ],
        // 'babel-preset-gatsby', {
        //   silence: true
        // },
      ],
      plugins: [
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        'transform-inline-environment-variables',
        [
          '@babel/plugin-proposal-decorators',
          {
            legacy: true,
          },
        ],
        [
          // import glsl as raw text
          'babel-plugin-inline-import',
          {
            extensions: [
              // 由于使用了 TS 的 resolveJsonModule 选项，JSON 可以直接引入，不需要当作纯文本
              '.pbf',
              '.glsl',
            ],
          },
        ],
      ],
    };
  }

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          // https://babeljs.io/docs/en/babel-preset-env#usebuiltins
          // useBuiltIns: 'usage',
          ...(isCDNBundle ? { corejs: 3 } : {}),
          useBuiltIns: isCDNBundle ? 'usage' : false,
          // set `modules: false` when building CDN bundle, let rollup do commonjs works
          // @see https://github.com/rollup/rollup-plugin-babel#modules
          modules: isCDNBundle || isESModule ? false : 'auto',
          targets: {
            chrome: 58,
            browsers: ['ie >= 11'],
          },
        },
      ],
      [
        '@babel/preset-react',
        {
          development: isCommonJS,
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      isCDNBundle ? {} : '@babel/plugin-transform-runtime',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-syntax-async-generators',
      // '@babel/plugin-transform-parameters',
      'transform-node-env-inline',
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true,
        },
      ],
      [
        '@babel/plugin-proposal-class-properties',
        {
          // @see https://github.com/storybookjs/storybook/issues/6069#issuecomment-472544973
          loose: false,
        },
      ],
      '@babel/plugin-syntax-dynamic-import',
      // let rollup do commonjs works
      // @see https://github.com/rollup/rollup-plugin-babel#modules
      isCDNBundle || isESModule
        ? {}
        : '@babel/plugin-transform-modules-commonjs',
      // 开发模式下以原始文本引入，便于调试
      isCDNBundle
        ? {}
        : [
            // import glsl as raw text
            'babel-plugin-inline-import',
            {
              extensions: [
                // 由于使用了 TS 的 resolveJsonModule 选项，JSON 可以直接引入，不需要当作纯文本
                // '.json',
                '.glsl',
                '.worker.js',
              ],
            },
          ],
      isCDNBundle
        ? {}
        : [
            'transform-import-css-l7',
            // 'transform-import-styles' // babel 编译将样式打包到js
          ],
      [
        // @see https://github.com/babel/babel/issues/8741#issuecomment-509041135
        'const-enum',
        {
          transform: 'constObject',
        },
      ],
      // 按需引用 @see https://github.com/lodash/babel-plugin-lodash
      'lodash',
      // 内联 WebGL 常量 @see https://www.npmjs.com/package/babel-plugin-inline-webgl-constants
      // isCDNBundle ? 'inline-webgl-constants' : {},
    ],
    ignore: [
      // /node_modules\/(?![kdbush|supercluster|async])/,
      'node_modules',
      ...(!isTest
        ? [
            '**/*.test.tsx',
            '**/*.test.ts',
            '**/*.story.tsx',
            '__snapshots__',
            '__tests__',
            '__stories__',
            '**/*/__snapshots__',
            '**/*/__tests__',
          ]
        : []),
    ],
  };
};
