import { lodashUtil } from '../src/lodash-adapter';

const { merge, mergeWith } = lodashUtil;

/**
 * 原型污染回归测试。
 *
 * 复现社区安全报告中的攻击链：用户可控的图层配置最终流入
 * `globalConfigService.setLayerConfig()` -> `lodashUtil.merge()`。
 * 若 merge 递归遍历 source 时不过滤 `__proto__` / `constructor` / `prototype`，
 * 由 JSON 解析得到的恶意 config 会污染 `Object.prototype`。
 */
describe('lodash-adapter prototype pollution', () => {
  const pollutionKey = 'l7_pp_regression';

  afterEach(() => {
    delete (Object.prototype as any)[pollutionKey];
  });

  it('merge should not pollute Object.prototype via __proto__', () => {
    const malicious = JSON.parse(`{"__proto__":{"${pollutionKey}":"PWNED"}}`);
    merge({}, {}, malicious);
    expect((Object.prototype as any)[pollutionKey]).toBeUndefined();
  });

  it('merge should not pollute Object.prototype via constructor.prototype', () => {
    const malicious = JSON.parse(`{"constructor":{"prototype":{"${pollutionKey}":"PWNED"}}}`);
    merge({}, malicious);
    expect((Object.prototype as any)[pollutionKey]).toBeUndefined();
  });

  it('mergeWith should not pollute Object.prototype via __proto__', () => {
    const malicious = JSON.parse(`{"__proto__":{"${pollutionKey}":"PWNED"}}`);
    mergeWith({}, malicious, () => undefined);
    expect((Object.prototype as any)[pollutionKey]).toBeUndefined();
  });

  it('mergeWith should not pollute Object.prototype via constructor.prototype', () => {
    const malicious = JSON.parse(`{"constructor":{"prototype":{"${pollutionKey}":"PWNED"}}}`);
    mergeWith({}, malicious, () => undefined);
    expect((Object.prototype as any)[pollutionKey]).toBeUndefined();
  });

  it('merge should still deep-merge legitimate keys', () => {
    const target = { a: 1, nested: { x: 1 } };
    const result = merge(target, { b: 2, nested: { y: 2 } });
    expect(result).toEqual({ a: 1, b: 2, nested: { x: 1, y: 2 } });
  });
});
