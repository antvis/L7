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
  ],
  exclude: [
    'node_modules/**/*.js'
  ]
}
