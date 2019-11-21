var hex = '0123456789ABCDEF'.split('')

// just make sure we equal Number#toString(16) for all numbers
// in a range.

var counter = require('./index')(hex)
  , assert = require('assert')

var i = 0
  , len = 0xFFFF

process.stdout.write('\n')
function iter() {
  process.stdout.write('\r' + ((i / len) * 100).toFixed(2) + '% done')
  if(i === len) return process.stdout.write('\n')

  assert.equal(counter(), i.toString(16).toUpperCase())

  ++i

  process.nextTick(iter)
}
iter()
