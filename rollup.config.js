import fs from 'fs';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { plugins } from './build/rollup_plugins';
const { BUILD, MINIFY } = process.env;
const minified = MINIFY === 'true';
const production = BUILD === 'production';
const outputFile = !production
  ? 'dist/l7-dev.js'
  : minified
    ? 'dist/l7.js'
    : 'dist/l7-unminified.js';

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
    experimentalCodeSplitting: true,
    treeshake: production,
    plugins: plugins()
  },
  {
    input: 'rollup/mapboxgl.js',
    output: {
      name: 'mapboxgl',
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
