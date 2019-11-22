module.exports = shortest

function shortest(available_chars) {
  available_chars = available_chars || create_alpha()

  var counter = 0
    , length = available_chars.length

  iter.pos = pos
  iter.skip = skip
  iter.reset = reset

  return iter 

  function iter() {
    var idx = counter
      , remainder = idx % length
      , out = ''

    if(idx === 0) {
      return ++counter, available_chars[idx]
    }

    while(idx) {
      out = available_chars[remainder] + out
      idx = ~~(idx / length)
      remainder = idx % length
    }

    ++counter
    return out 
  }

  function pos() {
    return counter
  }

  function skip(n) {
    return counter += n
  }

  function reset() {
    return counter = 0
  }
}

function create_alpha() {
  var start_0 = 'a'.charCodeAt(0)
    , end_0 = 'z'.charCodeAt(0) + 1
    , start_1 = 'A'.charCodeAt(0)
    , end_1 = 'Z'.charCodeAt(0) + 1
    , output = []
    , x = 0

  for(var i = start_0; i < end_0; ++i)
    output[x++] = String.fromCharCode(i)

  for(var i = start_1; i < end_1; ++i)
    output[x++] = String.fromCharCode(i)

  return output
}

