import pkg from './package.json';
import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import buble from 'rollup-plugin-buble';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import url from 'postcss-url';
export default {
  input: './src/index.ts',
  plugins: [
    // less(),
    typescript({
      exclude: 'node_modules/**',
      typescript: require('typescript')
    }),
    resolve({
      preferBuiltins: false
    }),
    postcss({
      plugins: [
        url({ url: 'inline' })
      ]
    }),
    commonjs({
      namedExports: {
        eventemitter3: [ 'EventEmitter' ],
        lodash: [ 'merge' ]
        // inversify: [ 'inject', 'injectable' ]
      },
      dynamicRequireTargets: [
        'node_modules/inversify/lib/syntax/binding_{on,when}_syntax.js'
      ]
    }),
    buble({
      transforms: { generator: false }
    }),
    terser()
  ],
  external: [
    '@antv/l7-core',
    '@antv/l7-scene',
    '@antv/l7-layers'
  ],
  output: [
    {
      format: 'umd',
      name: 'L7-Three',
      file: pkg.unpkg,
      sourcemap: true,
      globals: {
        '@antv/l7': 'L7'
      }
    }
  ]
};

