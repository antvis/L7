const path = require('path');

const isProduction = (process.env.NODE_ENV === 'production');

module.exports = {
  entry: './src/main',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? 'geotiff.bundle.min.js' : 'geotiff.bundle.js',
    library: 'GeoTIFF',
    libraryTarget: 'umd',
  },

  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: {
            name: isProduction ? '[hash].decoder.worker.min.js' : '[hash].decoder.worker.js',
            inline: true,
            fallback: true,
          },
        },
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },

  node: {
    fs: 'empty',
    buffer: 'empty',
    http: 'empty',
  },

  devServer: {
    host: '0.0.0.0',
    port: 8090,
    inline: true,
    disableHostCheck: true,
    watchContentBase: true,
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  cache: true,
};
