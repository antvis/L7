// @see https://babeljs.io/docs/en/next/config-files#project-wide-configuration
module.exports = (api) => {
  api.cache(() => process.env.NODE_ENV);
  return {
    presets: [
      [
        '@babel/env',
        {
          targets: {
            browsers: 'Last 2 Chrome versions, Firefox ESR',
            node: 'current',
          },
        },
      ],
      '@babel/preset-react',
      '@babel/preset-typescript',
      'babel-preset-gatsby',
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
      '@babel/plugin-transform-modules-commonjs',
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
      [
        // @see https://github.com/babel/babel/issues/8741#issuecomment-509041135
        'const-enum',
        {
          transform: 'constObject',
        }
      ],
      // TODO：减少最终打包产物大小
      // 1. 去除 Shader 中的注释
      // @see https://www.npmjs.com/package/babel-plugin-remove-glsl-comments
      // 2. 内联 WebGL 常量
      // @see https://www.npmjs.com/package/babel-plugin-inline-webgl-constants
    ],
    env: {
      build: {
        ignore: [
          '**/*.test.tsx',
          '**/*.test.ts',
          '**/*.story.tsx',
          '__snapshots__',
          '__tests__',
          '__stories__',
          '**/*/__snapshots__',
          '**/*/__tests__',
        ],
      },
    },
    ignore: ['node_modules'],
  };
}
