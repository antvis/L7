import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import pkg from './package.json';

const extractPackagePeerDependencies = () =>
  Object.keys(pkg.peerDependencies) || [];

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  external: extractPackagePeerDependencies(),
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
        [
          'es2015',
          {
            modules: false,
          },
        ],
        'stage-2',
        'react',
        'flow',
      ],
    }),
    resolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs({
      sourceMap: true,
      namedExports: {
        react: ['isValidElement'],
      },
    }),
    globals(),
    builtins(),
  ],
};
