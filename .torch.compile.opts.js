const path = require('path');
module.exports = {
  babelrc: {
    presets: [
      "@babel/preset-env"
    ]
  },
  extensions: ['.js'],
  include: [
    'src/**/*.js',
    'test/**/*.js',
    'node_modules/_three@0.96.0@three/**/*.js',
    'node_modules/simple-statistics/src/*.js'
  ],
  exclude: [
    'node_modules/@babel/**/*.js'
  ]
}
