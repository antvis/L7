import type BaseLayer from '../../src/core/BaseLayer';
import LayerScaleLegend from '../../src/core/LayerScaleLegend';

/**
 * 阶段 6.1：scale 配置与 legend 读取 delegate（`LayerScaleLegend`，阶段 1.6
 * 抽出）独立特征化 spec。当前该 delegate 仅经 BaseLayer 子类渲染路径间接
 * 覆盖；本 spec 以满足窄依赖面的 mock layer（仅 `styleAttributeService`）
 * 直连 delegate，锁定其可观测契约：
 *
 *   - scale(field, cfg)：string 字段写 scaleOptions[field]=cfg；object 字段
 *     合并；变化时（!isEqual）调 styleAttributeService.updateScaleAttribute
 *     （传 `{[field]:cfg}` 或 object field）；无变化不调
 *   - getScaleOptions：返回内部 scaleOptions 引用（同一引用语义）
 *   - getScale(name) → styleAttributeService.getLayerAttributeScale 透传
 *   - getLegend(name)：从 getLayerStyleAttribute(name).scale.scalers[0] 读
 *     type/field + items 委托 getLegendItems
 *   - getLegendItems 三分支：invertExtent 分段 / ticks 连续 / domain 枚举
 *     （过滤 undefined），无 scale 或均不匹配 → []
 *
 * 任何后续 delegate 改动破坏分支调度 / diff 守卫 / 引用语义即应使本 spec 失败。
 */

interface MockStyleAttributeService {
  getLayerAttributeScale: (name: string) => unknown;
  getLayerStyleAttribute: (name: string) => unknown;
  updateScaleAttribute: (opts: Record<string, unknown>) => void;
}

// 可调用 + 可选 scale 属性的 mock（ticks/domain 分支需 scale(item) 可调用）
type MockScale = ((item: unknown) => unknown) & {
  invertExtent?: (item: unknown) => unknown;
  range?: () => unknown[];
  ticks?: () => unknown[];
  domain?: () => unknown[];
};

function callable(fn: (item: unknown) => unknown, props: Partial<MockScale>): MockScale {
  return Object.assign(fn, props) as MockScale;
}

interface MockHandle {
  styleAttributeService: MockStyleAttributeService;
  calls: { updateScaleAttribute: Array<Record<string, unknown>> };
  setScale: (name: string, scale: unknown) => void;
  setAttribute: (name: string, attr: unknown) => void;
}

function makeLayer(): MockHandle {
  const scales: Record<string, unknown> = {};
  const attrs: Record<string, unknown> = {};
  const calls = { updateScaleAttribute: [] as Array<Record<string, unknown>> };
  return {
    calls,
    setScale: (name: string, scale: unknown) => {
      scales[name] = scale;
    },
    setAttribute: (name: string, attr: unknown) => {
      attrs[name] = attr;
    },
    styleAttributeService: {
      getLayerAttributeScale: (name: string) => scales[name],
      getLayerStyleAttribute: (name: string) => attrs[name],
      updateScaleAttribute: (opts: Record<string, unknown>) => {
        calls.updateScaleAttribute.push(opts);
      },
    },
  };
}

function bind(layer: MockHandle): LayerScaleLegend {
  return new LayerScaleLegend(layer as unknown as BaseLayer);
}

describe('scale-legend delegate (stage-6 6.1)', () => {
  it('scale(string, cfg)：写 scaleOptions[field] + 变化时调 updateScaleAttribute({[field]:cfg})', () => {
    const layer = makeLayer();
    const s = bind(layer);
    s.scale('color', { type: 'quantize' });
    expect(layer.calls.updateScaleAttribute).toEqual([{ color: { type: 'quantize' } }]);
    expect(s.getScaleOptions()).toEqual({ color: { type: 'quantize' } });
  });

  it('scale(object)：合并 scaleOptions + 调 updateScaleAttribute(object field)', () => {
    const layer = makeLayer();
    const s = bind(layer);
    s.scale({ color: { type: 'quantize' }, size: { type: 'linear' } });
    expect(layer.calls.updateScaleAttribute).toEqual([
      { color: { type: 'quantize' }, size: { type: 'linear' } },
    ]);
    expect(s.getScaleOptions()).toEqual({
      color: { type: 'quantize' },
      size: { type: 'linear' },
    });
  });

  it('scale 无变化（isEqual 守卫）→ 不调 updateScaleAttribute', () => {
    const layer = makeLayer();
    const s = bind(layer);
    const cfg = { type: 'quantize' };
    s.scale('color', cfg);
    s.scale('color', cfg); // 同 cfg，isEqual → 不调
    expect(layer.calls.updateScaleAttribute).toHaveLength(1);
  });

  it('scale 变化（同字段不同值）→ 再次调 updateScaleAttribute', () => {
    const layer = makeLayer();
    const s = bind(layer);
    s.scale('color', { type: 'quantize' });
    s.scale('color', { type: 'linear' });
    expect(layer.calls.updateScaleAttribute).toEqual([
      { color: { type: 'quantize' } },
      { color: { type: 'linear' } },
    ]);
  });

  it('getScaleOptions 返回内部同一引用', () => {
    const layer = makeLayer();
    const s = bind(layer);
    expect(s.getScaleOptions()).toBe(s.getScaleOptions());
  });

  it('getScale(name) → styleAttributeService.getLayerAttributeScale 透传', () => {
    const layer = makeLayer();
    const s = bind(layer);
    const fakeScale = { type: 'linear' };
    layer.setScale('color', fakeScale);
    expect(s.getScale('color')).toBe(fakeScale);
  });

  it('getLegend(name)：从 scalers[0] 读 type/field + items 委托', () => {
    const layer = makeLayer();
    const s = bind(layer);
    layer.setAttribute('color', {
      scale: { scalers: [{ option: { type: 'quantize' }, field: 'color' }] },
    });
    layer.setScale(
      'color',
      callable(() => undefined, {
        invertExtent: (item) => [item, (item as number) + 1],
        range: () => [0, 1],
      }),
    );
    const legend = s.getLegend('color');
    expect(legend.type).toBe('quantize');
    expect(legend.field).toBe('color');
    expect(legend.items).toEqual([
      { value: [0, 1], color: 0 },
      { value: [1, 2], color: 1 },
    ]);
  });

  it('getLegendItems：无 scale → []', () => {
    const layer = makeLayer();
    const s = bind(layer);
    expect(s.getLegendItems('color')).toEqual([]);
  });

  it('getLegendItems：invertExtent 分段分支（range × invertExtent）', () => {
    const layer = makeLayer();
    const s = bind(layer);
    layer.setScale(
      'color',
      callable(() => undefined, {
        invertExtent: (item) => [item, (item as number) + 1],
        range: () => [0, 1, 2],
      }),
    );
    expect(s.getLegendItems('color')).toEqual([
      { value: [0, 1], color: 0 },
      { value: [1, 2], color: 1 },
      { value: [2, 3], color: 2 },
    ]);
  });

  it('getLegendItems：ticks 连续分支（ticks × scale(item)）', () => {
    const layer = makeLayer();
    const s = bind(layer);
    layer.setScale(
      'color',
      callable((item) => `c${item}`, { ticks: () => [0, 5, 10] }),
    );
    expect(s.getLegendItems('color')).toEqual([
      { value: 0, color: 'c0' },
      { value: 5, color: 'c5' },
      { value: 10, color: 'c10' },
    ]);
  });

  it('getLegendItems：domain 枚举分支（过滤 undefined）', () => {
    const layer = makeLayer();
    const s = bind(layer);
    layer.setScale(
      'color',
      callable((item) => `v${item}`, { domain: () => ['a', 'b', undefined, 'c'] }),
    );
    expect(s.getLegendItems('color')).toEqual([
      { value: 'a', color: 'va' },
      { value: 'b', color: 'vb' },
      { value: 'c', color: 'vc' },
    ]);
  });

  it('getLegendItems：scale 无 invertExtent/ticks/domain → []', () => {
    const layer = makeLayer();
    const s = bind(layer);
    layer.setScale('color', { foo: 'bar' });
    expect(s.getLegendItems('color')).toEqual([]);
  });
});
