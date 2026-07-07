import { lodashUtil } from '../src/lodash-adapter';

const { extent, uniq, clamp, isEqual, cloneDeep, merge, mergeWith } = lodashUtil;

describe('lodash-adapter', () => {
  describe('extent', () => {
    it('should return [min, max] for number array', () => {
      expect(extent([1, 2, 3, 4, 5])).toEqual([1, 5]);
      expect(extent([5, 4, 3, 2, 1])).toEqual([1, 5]);
      expect(extent([10])).toEqual([10, 10]);
    });

    it('should handle negative numbers', () => {
      expect(extent([-5, -1, -10, -3])).toEqual([-10, -1]);
      expect(extent([-10, 0, 10])).toEqual([-10, 10]);
    });

    it('should handle empty array', () => {
      expect(extent([])).toEqual([undefined, undefined]);
    });

    it('should handle null/undefined input', () => {
      expect(extent(null)).toEqual([undefined, undefined]);
      expect(extent(undefined)).toEqual([undefined, undefined]);
    });

    it('should skip null and NaN values', () => {
      const values1 = [1, null, 3, null, 5];
      expect(extent(values1)).toEqual([1, 5]);
      const values2 = [1, NaN, 3, 5];
      expect(extent(values2)).toEqual([1, 5]);
    });

    it('should work with Date objects', () => {
      const d1 = new Date('2020-01-01');
      const d2 = new Date('2020-06-01');
      const d3 = new Date('2020-03-01');
      expect(extent([d1, d2, d3])).toEqual([d1, d2]);
    });

    it('should work with strings', () => {
      expect(extent(['a', 'c', 'b'])).toEqual(['a', 'c']);
      expect(extent(['zebra', 'apple', 'mango'])).toEqual(['apple', 'zebra']);
    });
  });

  describe('uniq', () => {
    it('should remove duplicates', () => {
      expect(uniq([1, 2, 1, 3, 2])).toEqual([1, 2, 3]);
      expect(uniq(['a', 'b', 'a'])).toEqual(['a', 'b']);
    });
  });

  describe('clamp', () => {
    it('should clamp values within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('isEqual', () => {
    it('should deeply compare objects', () => {
      expect(isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
      expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
    });
  });

  describe('cloneDeep', () => {
    it('should deeply clone objects', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = cloneDeep(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });
  });

  describe('merge - prototype pollution protection', () => {
    afterEach(() => {
      // Clean up any prototype pollution that may have occurred
      // @ts-ignore
      delete Object.prototype['polluted'];
    });

    it('should not pollute Object.prototype via __proto__', () => {
      const malicious = JSON.parse('{"__proto__":{"polluted":"PWNED"}}');
      merge({}, malicious);
      expect(({} as any).polluted).toBeUndefined();
      expect(Object.prototype.hasOwnProperty.call(Object.prototype, 'polluted')).toBe(false);
    });

    it('should not pollute Object.prototype via constructor', () => {
      const malicious = JSON.parse('{"constructor":{"prototype":{"polluted":"PWNED"}}}');
      merge({}, malicious);
      expect(({} as any).polluted).toBeUndefined();
    });

    it('should still merge normal properties correctly', () => {
      const target = { a: 1 };
      const source = { b: 2, c: { d: 3 } };
      const result = merge(target, source);
      expect(result).toEqual({ a: 1, b: 2, c: { d: 3 } });
    });
  });

  describe('mergeWith - prototype pollution protection', () => {
    afterEach(() => {
      // @ts-ignore
      delete Object.prototype['polluted'];
    });

    it('should not pollute Object.prototype via __proto__', () => {
      const malicious = JSON.parse('{"__proto__":{"polluted":"PWNED"}}');
      mergeWith({}, malicious, (targetVal: unknown, srcVal: unknown) => srcVal);
      expect(({} as any).polluted).toBeUndefined();
      expect(Object.prototype.hasOwnProperty.call(Object.prototype, 'polluted')).toBe(false);
    });

    it('should still merge normal properties with customizer', () => {
      const target = { a: 1, b: [1, 2] };
      const source = { b: [3, 4], c: 5 };
      const result = mergeWith(target, source, (targetVal: unknown, srcVal: unknown) => {
        if (Array.isArray(targetVal) && Array.isArray(srcVal)) {
          return targetVal.concat(srcVal);
        }
        return undefined;
      });
      expect(result.b).toEqual([1, 2, 3, 4]);
      expect(result.c).toBe(5);
    });
  });
});
