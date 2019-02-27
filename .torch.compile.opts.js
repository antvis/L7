const path = require('path');
module.exports = {
  babelrc: {
    presets: [
      "@babel/preset-env"
    ],
  },
  extensions: ['.js'],
  include: [
    'src/**/*.js',
    'test/**/*.js',
    'node_modules/_three@0.101.1@three/**/*.js',
    'node_modules/three/**/*.js',
    'node_modules/simple-statistics/src/*.js'
  ],
  exclude: [
    'node_modules/@babel/**/*.js'
  ]
}
