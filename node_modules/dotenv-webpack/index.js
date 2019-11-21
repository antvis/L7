'use strict'

let plugin
try {
  plugin = require('./dist').default
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    require('babel-register')
    plugin = require('./src').default
  } else {
    console.log(err)
    process.exit(1)
  }
}

module.exports = plugin
