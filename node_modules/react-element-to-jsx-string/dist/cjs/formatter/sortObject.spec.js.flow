/* @flow */

import sortObject from './sortObject';

describe('sortObject', () => {
  it('should sort keys in objects', () => {
    const fixture = {
      c: 2,
      b: { x: 1, c: 'ccc' },
      a: [{ foo: 1, bar: 2 }],
    };

    expect(JSON.stringify(sortObject(fixture))).toEqual(
      JSON.stringify({
        a: [{ bar: 2, foo: 1 }],
        b: { c: 'ccc', x: 1 },
        c: 2,
      })
    );
  });

  it('should process an array', () => {
    const fixture = [{ foo: 1, bar: 2 }, null, { b: 1, c: 2, a: 3 }];

    expect(JSON.stringify(sortObject(fixture))).toEqual(
      JSON.stringify([{ bar: 2, foo: 1 }, null, { a: 3, b: 1, c: 2 }])
    );
  });

  it('should not break special values', () => {
    const date = new Date();
    const regexp = /test/g;
    const fixture = {
      a: [date, regexp],
      b: regexp,
      c: date,
    };

    expect(sortObject(fixture)).toEqual({
      a: [date, regexp],
      b: regexp,
      c: date,
    });
  });
});
