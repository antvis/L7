import pkg from './package.json';
import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import buble from 'rollup-plugin-buble';

export default {
  input: './src/index.ts',
  plugins: [
    typescript({
      exclude: 'node_modules/**',
      typescript: require('typescript')
    }),
    resolve(),
    commonjs(),
    buble({
      transforms: { generator: false }
    })
  ],
  output: [
    {
      format: 'umd',
      name: 'L7-Maps',
      file: pkg.unpkg,
      sourcemap: true
    }
  ]
};

