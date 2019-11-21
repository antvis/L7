module.exports = Manager

var Nothing = ''

function Manager(whitespace_enabled, indent_text) {
  this.enabled = whitespace_enabled
  this.indent_text = indent_text
  this.level = 0
  this.tabcache = [
      ''
    , indent_text
    , indent_text + indent_text
    , indent_text + indent_text + indent_text
  ]

  this.optional = whitespace_enabled ? this.required : this.disabled
}

var cons = Manager
  , proto = cons.prototype

proto.indent = function() {
  ++this.level
}

proto.dedent = function() {
  --this.level
}

proto.disabled = function() {
  return Nothing
}

proto.required = function(c) {
  if(c === '\n' && this.enabled) {
    c += this.tab()
  }
  return c
}

proto.tab = function() {
  // yes, we're caching tabs.
  // why? well, every line is going to be calling this,
  // which would suck if we were indented a bunch in a block.
  if(this.tabcache[this.level]) {
    return this.tabcache[this.level]
  }

  var _ = ''
  for(var i = 0, len = this.level, o = this.indent_text; i < len; ++i) {
    _ += o
  }

  return this.tabcache[len] = _
}
