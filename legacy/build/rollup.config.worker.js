import path from 'path';
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
// import analyze from 'rollup-plugin-analyzer';
import babel from 'rollup-plugin-babel';

const { BUILD } = process.env;
const production = BUILD === 'production';
const outputFile = production
  ? 'packages/utils/dist/l7-utils.worker.js'
  : 'packages/utils/dist/l7-utils.worker.js';
function resolveFile(filePath) {
  return path.join(__dirname, '..', filePath);
}

module.exports = [
  {
    input: resolveFile('packages/utils/src/workers/index.ts'),
    output: {
      file: resolveFile(outputFile),
      format: 'iife',
      name: 'L7',
    },
    context: 'self',
    treeshake: true,
    plugins: [
      alias({
        resolve: ['.tsx', '.ts'],
        entries: [
          {
            find: /^@antv\/l7-(.*)\/src\/(.*)/,
            replacement: resolveFile('packages/$1/src/$2'),
          },
          {
            find: /^@antv\/l7-(.*)/,
            replacement: resolveFile('packages/$1/src'),
          },
          {
            find: /^@antv\/l7$/,
            replacement: resolveFile('packages/l7/src'),
          },
        ],
      }),
      resolve({
        browser: true,
        preferBuiltins: false,
        extensions: ['.js', '.ts'],
      }),
      json(),
      commonjs(),
      babel({
        extensions: ['.js', '.ts'],
      }),
      production ? terser() : false,
      // analyze({
      //   summaryOnly: true,
      //   limit: 20,
      // }),
    ],
  },
];
