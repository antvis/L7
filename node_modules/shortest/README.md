# shortest

```javascript

var counter = require('shortest')('abcdefg'.split(''))

for(var i = 0, len = 100; i < len; ++i) {
  process.stdout.write(counter()+' ')
}

/* output:

a b c d e f g ba bb bc bd be bf bg ca cb cc cd ce cf cg da db dc dd de df dg ea eb ec ed ee ef eg fa fb fc fd fe ff fg ga gb gc gd ge gf gg baa bab bac bad bae baf bag bba bbb bbc bbd bbe bbf bbg bca bcb bcc bcd bce bcf bcg bda bdb bdc bdd bde bdf bdg bea beb bec bed bee bef beg bfa bfb bfc bfd bfe bff bfg bga bgb bgc bgd bge bgf bgg caa cab

*/

```

Create a counter function that iterates through a provided space of characters.

# api

### counter = require('shortest')([character set])

create a counter function.

### counter() -> string

return the next item in the sequence

### counter.pos() -> position

return the current position in the sequence

### counter.skip(N) -> position

skip N items and return the new position

### counter.reset() -> 0

return counter to 0

# license

MIT

