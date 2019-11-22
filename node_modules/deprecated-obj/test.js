const assert = require('assert').strict || require('assert');
const Deprecation = require('./index');

assert.throws(() => new Deprecation());
assert.throws(() => new Deprecation(null, null));
assert.throws(() => new Deprecation({}, []));
assert.throws(() => new Deprecation(new class Foo {}(), {}));
assert.throws(() => new Deprecation({}, new class Bar {}()));

{
  const myConfig = {
    keep: true,
    old: {
      deprecated: true
    }
  };

  const deprecations = {
    old: {
      deprecated: 'new.shiny'
    }
  };

  const deprecation = new Deprecation(deprecations, myConfig);

  assert.deepEqual(deprecation.getCompliant(), {
    keep: true,
    new: { shiny: true }
  });

  assert.deepEqual(deprecation.getViolations(), {
    'old.deprecated': 'new.shiny'
  });
}

{
  const c = new class c {}();
  const f = () => {};
  const d = new Date();
  const o = {};

  const myConfig = {
    class: c,
    string: 'foo',
    function: f,
    date: d,
    object: o,
    'remove.me': 1
  };

  const deprecations = {
    'remove.me': null,
    'function.constructor': null
  };

  const deprecation = new Deprecation(deprecations, myConfig);

  assert.deepEqual(deprecation.getCompliant(), {
    class: c,
    string: 'foo',
    function: f,
    date: d,
    object: o
  });
  assert.deepEqual(deprecation.getViolations(), {
    'remove.me': null
  });
}

console.log('✔ Tests passed.');
