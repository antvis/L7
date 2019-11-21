# glsl-deparser

```javascript

var Path = require('path')

var tokenizer = require('glsl-tokenizer')()
  , parser = require('glsl-parser')
  , deparser = require('glsl-deparser')

process.stdin
  .pipe(tokenizer)
  .pipe(parser())
  .pipe(deparser())             // <-- deparser!
  .pipe(process.stdout)

process.stdin.resume()

```

transform a stream of [glsl-parser](https://github.com/chrisdickinson/glsl-parser) AST nodes
into strings.

only operates on top-level statements emitted by `glsl-parser`, so the code it emits is executable
by webgl.

# api

### deparser(whitespace_enabled=true, tab_text='  ')

Creates a `readable`/`writable` stream.

If no args are provided, `whitespace` is assumed to be enabled, and the tab text will be `'  '`.

If you pass `false` for the first arg, only syntactically significant whitespace will be emitted (it'll behave like a poor man's minifier).

If you pass `true` and tab text, that tab text will be used to indent code.

# note

the big caveat is that preprocessor if statements (`#if*`, `#endif`) won't work unless
each branch produces a parseable tree.

# license

MIT
