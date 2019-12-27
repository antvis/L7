import path from 'path';
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import analyze from 'rollup-plugin-analyzer';
import babel from 'rollup-plugin-babel';
import glsl from './rollup-plugin-glsl';
import postcss from 'rollup-plugin-postcss';
import url from 'postcss-url';

function resolveFile(filePath) {
  return path.join(__dirname, '..', filePath);
}

module.exports = [
  {
    input: resolveFile('build/bundle.ts'),
    output: {
      file: resolveFile('packages/l7/dist/l7.js'),
      format: 'umd',
      name: 'L7',
      globals: {
        'mapbox-gl': 'mapboxgl'
      }
    },
    external: [
      'mapbox-gl'
    ],
    treeshake: true,
    plugins: [
      alias(
        {
          resolve: [ '.tsx', '.ts' ],
          entries: [
            {
              find: /^@antv\/l7-(.*)/,
              replacement: resolveFile('packages/$1/src'),
            },
            {
              find: /^@antv\/l7$/,
              replacement: resolveFile('packages/l7/src'),
            },
          ]
        }
      ),
      resolve({
        browser: true,
        preferBuiltins: false,
        extensions: [ '.js', '.ts' ]
      }),
      glsl(
        [ '**/*.glsl' ],
        true
      ),
      json(),
      postcss({
        plugins: [
          url({ url: 'inline' })
        ]
      }),
      // @see https://github.com/rollup/rollup-plugin-node-resolve#using-with-rollup-plugin-commonjs
      commonjs({
        namedExports: {
          eventemitter3: [ 'EventEmitter' ],
          // @see https://github.com/rollup/rollup-plugin-commonjs/issues/266
          lodash: [
            'isNil',
            'uniq',
            'clamp',
            'isObject',
            'isFunction',
            'cloneDeep',
            'isString',
            'isNumber',
            'merge'
          ]
        }
      }),
      babel({
        extensions: [ '.js', '.ts' ]
      }),
      terser(),
      analyze({
        summaryOnly: true,
        limit: 20
      })
    ]
  }
];
