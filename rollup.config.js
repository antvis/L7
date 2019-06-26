import fs from 'fs';
// import sourcemaps from 'rollup-plugin-sourcemaps';
import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { createFilter } from 'rollup-pluginutils';
import { terser } from 'rollup-plugin-terser';
const { BUILD, MINIFY } = process.env;
const minified = MINIFY === 'true';
const production = BUILD === 'production';
const outputFile = !production
  ? 'build/L7.js'
  : minified
  ? 'build/l7.js'
  : 'build/l7-unminified.js';

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
    treeshake: false,
    plugins: [
      glsl(
        [ './src/geom/shader/*.glsl', './src/core/engine/picking/*.glsl', './src/geom/shader/**/*.glsl' ],
        production
      ),
      minified ? terser() : false,
      buble({
        transforms: { dangerousForOf: true },
        objectAssign: 'Object.assign'
      }),
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs({
        // global keyword handling causes Webpack compatibility issues, so we disabled it:
        // https://github.com/mapbox/mapbox-gl-js/pull/6956
        ignoreGlobal: true
      })
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
      // Ingest the sourcemaps produced in the first step of the build.
      // This is the only reason we use Rollup for this second pass
      // sourcemaps()
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
