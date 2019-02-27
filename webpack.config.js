const webpack = require('webpack');
const resolve = require('path').resolve;
const pkg = require('./package.json');
module.exports = {
  devtool: 'cheap-source-map',
  entry: {
    l7: './src/index.js',
    three: './src/core/three.js'
  },
  output: {
    filename: '[name].js',
    library: 'L7',
    libraryTarget: 'umd',
    path: resolve(__dirname, 'build/')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true
          }
        }
      },
      {
        test: /\.glsl$/,
        use: {
          loader: 'glsl-shaders-loader'
        }
      },
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: {
            inline: true,
            fallback: false
          }
        }
      },
      {
        test: /global\.js$/,
        use: {
          loader: 'string-replace-loader',
          options: {
            search: '____L7_VERSION____',
            replace: pkg.version
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ]
};
