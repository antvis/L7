module.exports = StringStream

var inherits = require('inherits')
var stream = require('readable-stream')

inherits(StringStream, stream.Readable)

function StringStream (str) {
  if (!(this instanceof StringStream)) return new StringStream(str)
  stream.Readable.call(this)
  this._str = str
}

StringStream.prototype._read = function () {
  if (!this.ended) {
    var self = this
    process.nextTick(function () {
      self.push(new Buffer(self._str))
      self.push(null)
    })
    this.ended = true
  }
}
