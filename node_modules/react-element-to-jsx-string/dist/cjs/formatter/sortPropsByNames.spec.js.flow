/* @flow */

import sortPropsByNames from './sortPropsByNames';

test('sortPropsByNames should always move the `key` and `ref` keys first', () => {
  const fixtures = ['c', 'key', 'a', 'ref', 'b'];

  expect(sortPropsByNames(false)(fixtures)).toEqual([
    'key',
    'ref',
    'c',
    'a',
    'b',
  ]);
});

test('sortPropsByNames should always sort the props and keep `key` and `ref` keys first', () => {
  const fixtures = ['c', 'key', 'a', 'ref', 'b'];

  expect(sortPropsByNames(true)(fixtures)).toEqual([
    'key',
    'ref',
    'a',
    'b',
    'c',
  ]);
});
