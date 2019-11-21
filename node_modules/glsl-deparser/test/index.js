var cssauron_config = {
  tag: 'type'
, parent: 'parent'
, children: 'children'
}

var fs = require('fs')
  , Path = require('path')

var tokenizer = require('glsl-tokenizer')()
  , parser = require('glsl-parser')
  , lang = require('cssauron')(cssauron_config)
  , deparser = require('../index')
  , path = Path.join(__dirname, 'working.glsl')
  , parse_stream = parser(select)
  , is_global_variable = lang(':root > stmt > decl decllist ident')
  , is_global_function = lang(':root > stmt > decl function > ident')
  , is_struct = lang(':root > stmt > struct > ident')
  , lang

function select(x) {
  return is_global_variable(x) || is_global_function(x) || is_struct(x)
}

fs.createReadStream(path)
  .pipe(tokenizer)
  .pipe(parser())
  .pipe(deparser(true))
  .pipe(process.stdout)
