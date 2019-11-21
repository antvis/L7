import * as src from '../src/index';
import * as dist from '../dist/index';

const regex1 = /foo/;
const regex2 = /foo/g;
const regex3 = new RegExp('foo', 'i');

const fn1 = x => x + x;
const fn2 = function x(x) {
  return x - x;
};
function fn3() {
  return x / x;
}

class Foo {}

const date = new Date('2018');

const nested = {
  a: {
    b: {
      c: {
        d: {
          e: {
            f: {
              g: {
                h: {
                  i: {
                    j: {
                      k: {
                        l: 'l',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const data = {
  regex1,
  regex2,
  regex3,
  fn1,
  fn2,
  fn3,
  fn4(x) {
    return x * x;
  },
  date,
  foo: new Foo(),
  nested,
};

data.cyclic = data;

const tests = ({ stringify, parse }) => {
  test('sanity', () => {
    expect(true).toBe(true);
  });

  test('stringify', () => {
    let stringified;

    expect(() => (stringified = stringify(data))).not.toThrow();
    expect(stringified).toMatchSnapshot();
  });

  test('parse', () => {
    const stringified = stringify(data);
    let parsed;
    expect(() => (parsed = parse(stringified))).not.toThrow();
    expect(parsed).toMatchSnapshot();

    // test the regex
    expect(parsed.regex1.exec).toBeDefined();
    expect('aaa-foo-foo-bbb'.replace(parsed.regex1, 'BAR')).toBe('aaa-BAR-foo-bbb');
    expect('aaa-foo-foo-bbb'.replace(parsed.regex2, 'BAR')).toBe('aaa-BAR-BAR-bbb');
    expect('aaa-Foo-foo-bbb'.replace(parsed.regex3, 'BAR')).toBe('aaa-BAR-foo-bbb');

    // test the date
    expect(parsed.date).toBeInstanceOf(Date);
    expect(parsed.date.getFullYear()).toBe(2018);

    // test cyclic
    expect(parsed.cyclic.cyclic.cyclic.cyclic).toBeDefined();
    expect(parsed.cyclic.cyclic.cyclic.cyclic).toBe(parsed);

    // test Foo instance
    expect(parsed.foo).toBeDefined();
    expect(parsed.foo.constructor.name).toBe('Foo');
    expect(parsed.foo instanceof Foo).toBe(false);
  });

  test('maxDepth', () => {
    const stringifiedDefault = stringify(data);
    const stringifiedMax5 = stringify(data, { maxDepth: 5 });
    const parsedDefault = parse(stringifiedDefault);
    const parsedMax5 = parse(stringifiedMax5);

    expect(parsedDefault.nested.a.b.c.d.e.f.g.h.i).toBeDefined();
    expect(parsedDefault.nested.a.b.c.d.e.f.g.h.i.j).toBeDefined();
    expect(parsedDefault.nested.a.b.c.d.e.f.g.h.i.j.k).not.toBeDefined();

    expect(parsedMax5.nested.a.b.c.d).toBeDefined();
    expect(parsedMax5.nested.a.b.c.d.e).toBeDefined();
    expect(parsedMax5.nested.a.b.c.d.e.f).not.toBeDefined();
  });

  test('space', () => {
    const stringifiedSpaced = stringify(data, { space: 2 });

    expect(stringifiedSpaced).toMatchSnapshot();
  });

  test('stringify the global object', () => {
    expect(() => stringify(global, { maxDepth: 10000 })).not.toThrow();
  });

  test('check duplicate value', () => {
    const Fruit = {
      apple: true,
      parent: {},
    };
    Fruit.cyclic = Fruit;
    const stringified = stringify(Fruit);
    const parsed = parse(stringified);

    expect(stringified).toEqual('{"apple":true,"parent":{},"cyclic":"_duplicate_root"}');
    expect(parsed.cyclic.cyclic.cyclic.cyclic).toBeDefined();
    expect(parsed.cyclic).toBe(parsed);
    expect(parsed.cyclic.cyclic.cyclic.cyclic).toBe(parsed);
  });

  test('check constructor value', () => {
    const data = { ConstructorFruit: new Foo() };

    const stringified = stringify(data);
    const parsed = parse(stringified);

    expect(stringified).toEqual('{"ConstructorFruit":{"_constructor-name_":"Foo"}}');
    expect(parsed.ConstructorFruit).toBeDefined();
    expect(parsed.ConstructorFruit.constructor.name).toBe('Foo');
    expect(parsed.foo instanceof Foo).toBe(false);
  });

  test('check function value', () => {
    const Fruit = function(value) {
      return [value, 'apple'];
    };
    const data = { FunctionFruit: Fruit };

    const stringified = stringify(data);
    const parsed = parse(stringified);

    expect(stringified).toEqual(
      '{"FunctionFruit":"_function_Fruit|function Fruit(value) {return [value, \'apple\'];}"}'
    );
    expect(parsed.FunctionFruit('orange')).toEqual(['orange', 'apple']);
    expect(parsed.FunctionFruit.toString()).toEqual(
      "function Fruit(value) {return [value, 'apple'];}"
    );
  });

  test('check regExp value', () => {
    const data = { RegExpFruit: /test/g };

    const stringified = stringify(data);
    const parsed = parse(stringified);

    expect(stringified).toEqual('{"RegExpFruit":"_regexp_g|test"}');
    expect(parsed).toMatchObject(data);
  });

  test('check date value', () => {
    const data = { DateFruit: new Date('01.01.2019') };

    const stringified = stringify(data);
    const parsed = parse(stringified);

    expect(stringified).toEqual('{"DateFruit":"_date_2019-01-01T00:00:00.000Z"}');
    expect(parsed).toMatchObject(data);
    expect(parsed.DateFruit.getFullYear()).toBe(2019);
  });

  test('check symbol value', () => {
    const data = { SymbleFruit: Symbol('apple') };

    const stringified = stringify(data);
    const parsed = parse(stringified);

    expect(stringified).toEqual('{"SymbleFruit":"_symbol_apple"}');
    expect(parsed.SymbleFruit.toString()).toEqual('Symbol(apple)');
  });

  test('check minus Infinity value', () => {
    const data = { InfinityFruit: -Infinity };

    const stringified = stringify(data);
    const parsed = parse(stringified);

    expect(stringified).toEqual('{"InfinityFruit":"_-Infinity_"}');
    expect(parsed).toMatchObject(data);
  });

  test('check Infinity value', () => {
    const data = { InfinityFruit: Infinity };

    const stringified = stringify(data);
    const parsed = parse(stringified);

    expect(stringified).toEqual('{"InfinityFruit":"_Infinity_"}');
    expect(parsed).toMatchObject(data);
  });

  test('check NaN value', () => {
    const data = { NaNFruit: NaN };

    const stringified = stringify(data);
    const parsed = parse(stringified);

    expect(stringified).toEqual('{"NaNFruit":"_NaN_"}');
    expect(parsed).toMatchObject(data);
  });

  test('check undefined value', () => {
    const data = { undefinedFruit: undefined };

    const stringified = stringify(data);
    const parsed = parse(stringified);

    expect(stringified).toEqual('{"undefinedFruit":"_undefined_"}');
    expect(parsed.undefinedFruit).toEqual(undefined);
    expect(Object.keys(parsed)).toEqual(['undefinedFruit']);
  });

  test('primitives should not be deduplicated', () => {
    const data = {
      bool: true,
      a: 1,
      b: '1',
      c: {
        bool: true,
        c: 1,
        d: 3,
        e: '3',
        f: {
          bool: true,
          c: '1',
          d: 3,
          e: '3',
        },
      },
    };

    const stringified = stringify(data);
    const parsed = parse(stringified);

    expect(stringified).toEqual(
      '{"bool":true,"a":1,"b":"1","c":{"bool":true,"c":1,"d":3,"e":"3","f":{"bool":true,"c":"1","d":3,"e":"3"}}}'
    );
    expect(parsed).toMatchObject(data);
  });

  test('bug', () => {
    const data = {
      a: 1,
      b: '2',
      c: NaN,
      d: true,
      e: {
        1: data,
      },
      f: [1, 2, 3, 4, 5],
      g: undefined,
      h: null,
      i: () => {},
      j: function() {},
    };

    const stringified = stringify(data);
    expect(stringified).toMatch(
      '{"a":1,"b":"2","c":"_NaN_","d":true,"e":{"1":"_undefined_"},"f":[1,2,3,4,5],"g":"_undefined_","h":null,"i":"_function_i|function i() {}","j":"_function_j|function j() {}"}'
    );

    const parsed = parse(stringified);

    Object.entries(parsed).forEach((k, v) => {
      expect(data[k]).toEqual(parsed[k]);
    });
  });
};

describe('Source', () => {
  tests(src);
});

describe('Dist', () => {
  tests(dist);
});
