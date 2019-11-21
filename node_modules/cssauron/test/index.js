var cssauron = require('../index')
  , test = require('tape')
  , language

language = cssauron({
    id: 'id'
  , class: 'class'
  , tag: 'tag'
  , attr: 'attr[attr]'
  , parent: 'parent'
  , children: 'children'
  , contents: 'contents || ""'
})

test('select single', test_select_single)
test('select multiple', test_select_multiple)
test('select subject', test_select_subject)

function test_select_single(assert) {
  var data = {id: 'one-id', class: 'one-class', tag: 'one-tag', attr:{first: 'test', second:'gary busey', third:'richard-m-nixon'}, parent:null, children:[]}

  assert.ok(language('#one-id')(data))
  assert.ok(!language('#one-id-false')(data))
  assert.ok(language('.one-class')(data))
  assert.ok(!language('.one-other-class')(data))
  assert.ok(language('one-tag')(data))
  assert.ok(!language('two-tag')(data))
  assert.end()
}

function test_select_multiple(assert) {
  var data = {id: 'one-id', class: 'one-class', tag: 'one-tag', attr:{first: 'test', second:'gary busey', third:'richard-m-nixon'}, parent:null, children:[]}
    , data2 = {id: 'two-id', class: 'two-class', tag: 'two-tag', attr:{first: 'test', second:'gary busey', third:'richard-m-nixon'}, parent:null, children:[]}
    , data3 = {id: 'three-id', class: 'three-class', tag: 'three-tag', attr:{first: 'test', second:'gary busey', third:'richard-m-nixon'}, parent:null, children:[]}
    , parent = {id: 'parent-id', class: 'parent-class', tag: 'parent-tag', attr:{first: 'test', second:'gary busey', third:'richard-m-nixon'}, parent:null, children:[data, data2, data3]} 
    , root = {id: 'root-id', class: 'root-class', tag: 'root-tag', attr:{first: 'test', second:'gary busey', third:'richard-m-nixon'}, parent:null, children:[parent]} 

  data.parent = parent
  data2.parent = parent
  data3.parent = parent
  data2.contents = 'hello world'
  parent.parent = root

  assert.ok(language('#root-id #one-id')(data))
  assert.ok(language('#nope,#root-id #one-id')(data))
  assert.ok(!language('#nope, #nada')(data))
  assert.ok(!language('#root-id > #one-id')(data))
  assert.ok(language('#root-id > #parent-id > #one-id')(data))
  assert.ok(
      language('#parent-id > #one-id,\n#root-id > #parent-id > #one-id')(data)
  )
  assert.ok(
      language(
          '#ok,\n    #parent-id > #one-id,\n#root-id > #parent-id > #one-id'
      )(data)
  )
  assert.ok(language('.one-class + .two-class')(data2))
  assert.ok(!language('.one-class + #one-id')(data))
  assert.ok(language('one-tag ~ #three-id')(data3))
  assert.ok(language('one-tag:first-child')(data))
  assert.ok(language('one-tag:empty')(data))
  assert.ok(!language('#parent-id:empty')(parent))
  assert.ok(!language('one-tag:last-child')(data))
  assert.ok(language('three-tag:last-child')(data3))
  assert.ok(language('[first]')(data))
  assert.ok(!language('[dne]')(data))
  assert.ok(language('[third|=m]')(data))
  assert.ok(language('[third|=richard]')(data))
  assert.ok(language('[third|=nixon]')(data))
  assert.ok(!language('[third|=tricky-dick]')(data))
  assert.ok(language('[third$=nixon]')(data))
  assert.ok(!language('[third$=dixon]')(data))
  assert.ok(!language('[third^=dick]')(data))
  assert.ok(language('[third^=richard]')(data))
  assert.ok(language('[third*=-m-]')(data))
  assert.ok(!language('[third*=radical]')(data))
  assert.ok(!language('[second~=dne]')(data))
  assert.ok(language('[second~=gary]')(data))
  assert.ok(language('[second~=busey]')(data))
  assert.ok(!language(':contains(hello)')(data))
  assert.ok(!language(':contains(world)')(data))
  assert.ok(language(':contains(hello)')(data2))
  assert.ok(language(':contains(world)')(data2))
  assert.ok(
      language(':root > :any(thing-tag, parent-tag, #asdf) > #one-id')(data)
  )
  assert.end()
}

function test_select_subject(assert) {
  var data = {id: 'one-id', class: 'one-class', tag: 'one-tag', attr:{first: 'test', second:'gary busey', third:'richard-m-nixon'}, parent:null, children:[]}
    , data2 = {id: 'two-id', class: 'two-class', tag: 'two-tag', attr:{first: 'test', second:'gary busey', third:'richard-m-nixon'}, parent:null, children:[]}
    , data3 = {id: 'three-id', class: 'three-class', tag: 'three-tag', attr:{first: 'test', second:'gary busey', third:'richard-m-nixon'}, parent:null, children:[]}
    , parent = {id: 'parent-id', class: 'parent-class', tag: 'parent-tag', attr:{first: 'test', second:'gary busey', third:'richard-m-nixon'}, parent:null, children:[data, data2, data3]} 
    , root = {id: 'root-id', class: 'root-class', tag: 'root-tag', attr:{first: 'test', second:'gary busey', third:'richard-m-nixon'}, parent:null, children:[parent]} 
    , res

  data.parent = parent
  data2.parent = parent
  data3.parent = parent
  data2.contents = 'hello world'
  parent.parent = root

  assert.equal(
      language(':root > :any(thing-tag, parent-tag, #asdf) > #one-id')(data)
    , data
  )


  assert.equal(
      language(':root > !parent-tag > #one-id')(data)
    , parent
  )

  res = language(
      ':root > !:any(thing-tag, parent-tag, #asdf) > !#one-id'
  )(data)

  assert.equal(
      res[0]
    , data
  )

  assert.equal(
      res[1]
    , parent
  )

  // one of these has a subject, one doesn't
  res = language(
    ':root > parent-tag > #one-id, !#root-id *'
  )(data)

  assert.equal(
      res[0]
    , root
  )

  assert.equal(
      res[1]
    , data
  )

  // no duplicates, no matter how many valid selections.
  // both sides select `data`.
  res = language(
    ':root > parent-tag > #one-id, #root-id !*'
  )(data)

  assert.equal(res, data)

  assert.end()
}
