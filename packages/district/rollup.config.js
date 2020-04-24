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
    commonjs(),
    buble({
      transforms: { generator: false }
    }),
    terser()
  ],
  external: [
    '@antv/l7'
  ],
  output: [
    {
      format: 'umd',
      name: 'L7.District',
      file: pkg.unpkg,
      sourcemap: true,
      globals: {
        '@antv/l7': 'L7'
      }
    }
  ]
};

