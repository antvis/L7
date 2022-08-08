// @see https://babeljs.io/docs/en/next/config-files#project-wide-configuration
module.exports = api => {
  api.cache(() => process.env.NODE_ENV);
    return {
      presets: [
        '@babel/preset-env',
        [
          '@babel/preset-react',
        ]
      ],
      plugins: [
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        'transform-inline-environment-variables',
        [
          '@babel/plugin-proposal-decorators',
          {
            legacy: true
          }
        ],
        [
          // import glsl as raw text
          'babel-plugin-inline-import',
          {
            extensions: [
              // 由于使用了 TS 的 resolveJsonModule 选项，JSON 可以直接引入，不需要当作纯文本
              '.pbf',
              '.glsl'
            ]
          }
        ]
      ]
    };
};
