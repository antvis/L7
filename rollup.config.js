import fs from 'fs';
import json from 'rollup-plugin-json';
import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import { createFilter } from 'rollup-pluginutils';
import postcss from 'rollup-plugin-postcss';
import url from 'postcss-url';
import { terser } from 'rollup-plugin-terser';
const { BUILD, MINIFY } = process.env;
const minified = MINIFY === 'true';
const production = BUILD === 'production';
const outputFile = !production
  ? 'build/L7.js'
  : minified
    ? 'build/L7-min.js'
    : 'build/L7-unminified.js';

const config = [
  {
    input: [ 'src/index.js', 'src/worker/worker.js' ],
    output: {
      dir: 'rollup/build/l7',
      format: 'amd',
      sourcemap: 'inline',
      indent: false,
      chunkFileNames: 'shared.js'
    },
    // experimentalCodeSplitting: true,
    treeshake: production,
    onwarn(warning, warn) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') return;
      warn(warning);
    },
    plugins: [
      glsl(
        [ './src/geom/shader/*.glsl', './src/core/engine/picking/*.glsl', './src/geom/shader/**/*.glsl' ],
        production
      ),
      minified ? terser() : false,
      json(),
      // css({ raw: './build/l7.css' }),
      postcss({
        plugins: [ url({ url: 'inline' }) ]
      }),
      // url({ url: 'inline' }),
      buble({
        transforms: { dangerousForOf: true },
        objectAssign: 'Object.assign'
      }),
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs({
        ignoreGlobal: true
      }),
      builtins()
    ]
  },
  {
    input: 'rollup/l7.js',
    output: {
      name: 'L7',
      file: outputFile,
      format: 'umd',
      sourcemap: production ? true : 'inline',
      indent: false,
      intro: fs.readFileSync(
        require.resolve('./rollup/bundle_prelude.js'),
        'utf8'
      )
    },
    treeshake: false,
    plugins: [
      // css()
    ]
  }
];

export default config;
function glsl(include, minify) {
  const filter = createFilter(include);
  return {
    name: 'glsl',
    transform(code, id) {
      if (!filter(id)) return;

      // barebones GLSL minification
      if (minify) {
        code = code
          .trim() // strip whitespace at the start/end
          .replace(/\s*\/\/[^\n]*\n/g, '\n') // strip double-slash comments
          .replace(/\n+/g, '\n') // collapse multi line breaks
          .replace(/\n\s+/g, '\n') // strip identation
          .replace(/\s?([+-\/*=,])\s?/g, '$1') // strip whitespace around operators
          .replace(/([;\(\),\{\}])\n(?=[^#])/g, '$1'); // strip more line breaks
      }

      return {
        code: `export default ${JSON.stringify(code)};`,
        map: { mappings: '' }
      };
    }
  };
}
