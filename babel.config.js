// @see https://babeljs.io/docs/en/next/config-files#project-wide-configuration
module.exports = (api) => {
  api.cache(() => process.env.NODE_ENV);

  const isSite = api.env('site');
  const isCDNBundle = api.env('bundle');
  const isCommonJS = api.env('cjs');
  const isESModule = api.env('esm');
  const isTest = api.env('test');

  if (isSite) { //
    return {
      "presets": [
        "babel-preset-gatsby"
      ],
      "plugins": [
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-nullish-coalescing-operator',
        [
          '@babel/plugin-proposal-decorators',
          {
            legacy: true,
          }
        ],
        [
          // import glsl as raw text
          'babel-plugin-inline-import',
          {
            extensions: [
              // 由于使用了 TS 的 resolveJsonModule 选项，JSON 可以直接引入，不需要当作纯文本
              // '.json',
              '.glsl',
            ]
          }
        ],
      ]
    };
  }
  return {
    presets: [
      [
        '@babel/env',
        {
          targets: {
            browsers: 'Last 2 Chrome versions, Firefox ESR',
            node: 'current',
          },
          // set `modules: false` when building CDN bundle, let rollup do commonjs works
          // @see https://github.com/rollup/rollup-plugin-babel#modules
          modules: (isCDNBundle || isESModule) ? false : 'auto',
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
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true,
        }
      ],
      [
        '@babel/plugin-proposal-class-properties',
        {
          // @see https://github.com/storybookjs/storybook/issues/6069#issuecomment-472544973
          loose: true,
        }
      ],
      '@babel/plugin-syntax-dynamic-import',
      // let rollup do commonjs works
      // @see https://github.com/rollup/rollup-plugin-babel#modules
      (isCDNBundle || isESModule) ? {} : '@babel/plugin-transform-modules-commonjs',
      // '@babel/plugin-transform-modules-commonjs',
      // 开发模式下以原始文本引入，便于调试
      isCDNBundle ? {} : [
        // import glsl as raw text
        'babel-plugin-inline-import',
        {
          extensions: [
            // 由于使用了 TS 的 resolveJsonModule 选项，JSON 可以直接引入，不需要当作纯文本
            // '.json',
            '.glsl',
          ]
        }
      ],
      [
        // @see https://github.com/babel/babel/issues/8741#issuecomment-509041135
        'const-enum',
        {
          transform: 'constObject',
        }
      ],
      // 按需引用 @see https://github.com/lodash/babel-plugin-lodash
      'lodash',
      // 内联 WebGL 常量 @see https://www.npmjs.com/package/babel-plugin-inline-webgl-constants
      isCDNBundle ? 'inline-webgl-constants' : {},
    ],
    ignore: [
      'node_modules',
      ...!isTest ? [
        '**/*.test.tsx',
        '**/*.test.ts',
        '**/*.story.tsx',
        '__snapshots__',
        '__tests__',
        '__stories__',
        '**/*/__snapshots__',
        '**/*/__tests__',
      ]: [],
    ],
  };
}
