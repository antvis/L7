import { defineConfig } from 'father';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  esm: {
    output: 'es',
    transformer: 'esbuild',
    platform: 'browser',
  },
  cjs: isProduction
    ? {
        output: 'lib',
        transformer: 'esbuild',
        platform: 'node',
      }
    : undefined,
  extraBabelPlugins: [
    [
      // import glsl as raw text
      'babel-plugin-inline-import',
      { extensions: ['.glsl'] },
    ],
    // import css as inline
    'transform-import-css-l7',
  ],
  targets: { chrome: 51, node: 18 },
  // more config see father docs https://github.com/umijs/father/blob/master/docs/config.md
});
