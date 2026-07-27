import type { IGlobalConfigService } from '@antv/l7-core';
import BaseLayer from '../../src/core/BaseLayer';

/**
 * 阶段 1.1 spec-first：流式样式 API（`color/size/shape/texture/rotate/filter/
 * label/style/scale/animate` → `return this`）+ `pendingStyleAttributes` 注册 +
 * `encodeStyle` + `splitValuesAndCallbackInAttribute` 当前行为特征化 spec。
 *
 * `LayerStyleFluent` delegate 提取（~200 行从 BaseLayer 移出）前的安全网：
 * 先以纯测试锁现状行为，确保后续提取行为不变。本刀零产线改动。
 *
 * 锁定两条路径分流（由 `this.startInit` 决定）：
 *   - **pending 路径**（`startInit===false`，ctor 后/init 前默认态）：
 *     color/size/texture/rotate/filter/shape 经 `updateStyleAttribute` →
 *     `configService.setAttributeConfig` 镜像 + 入队 `pendingStyleAttributes`；
 *     label 直接 push pending（不走 updateStyleAttribute，故无镜像/无 diff）。
 *     filter/shape 额外据 `updateStyleAttribute` 返回 flag 与 `this.inited`
 *     切换 `dataState.dataSourceNeedUpdate`。
 *   - **service 路径**（`startInit===true`，init 后）：
 *     `updateStyleAttribute` 不入队，直接 `styleAttributeService.
 *     updateStyleAttribute` 传 split-{values,callback} scale。
 *
 * 锁定 `updateStyleAttribute` 的 **isEqual diff**：与 `configService.
 * getAttributeConfig(this.id)[type]` 比较 `{field, values}`，相等返回 false
 * 且不入队/不镜像；否则镜像 + (pending 或 service) + 返回 true。
 *
 * 锁定 `encodeStyle`（经 `style()`）：
 *   - 仅 `encodeStyles.has(key)` 且值为 isPlainObject 且含 field 或 value 且
 *     与现有 `encodeStyleAttribute[key]` 不 isEqual → 存入 + updateStyleAttribute
 *     + (`inited` → `dataMappingNeedUpdate=true`)
 *   - 否则若 `encodeStyleAttribute[key]` 已存 → 删除 + `dataSourceNeedUpdate=true`
 *
 * 锁定 `style()` 兼容：
 *   - `borderColor`→`stroke`、`borderWidth`→`strokeWidth` 别名
 *   - 旧版 `[field, value]` 数组（两元素均非数字）→ `{field, value}`
 *
 * 锁定 `splitValuesAndCallbackInAttribute`：
 *   - 函数 → `{values: undefined, callback: fn}`；非函数 → `{values: x, callback: undefined}`
 *
 * 锁定 return-this：所有 fluent 方法返回 `this` 以支持链式。
 */

// ---- mock 类型 ----
interface AttrConfig {
  field: unknown;
  values: unknown;
}
interface MockConfigService {
  getAttributeConfig: jest.Mock;
  setAttributeConfig: jest.Mock;
  setLayerConfig: jest.Mock;
}
interface MockStyleAttributeService {
  updateStyleAttribute: jest.Mock;
}
interface MockConfigModel {
  read: jest.Mock;
  apply: jest.Mock;
  rawConfig: Record<string, unknown>;
}
interface MockScaleLegend {
  scale: jest.Mock;
}

interface Setup {
  layer: BaseLayer;
  cfg: MockConfigService;
  sas: MockStyleAttributeService;
  cm: MockConfigModel;
  sl: MockScaleLegend;
}

function makeSetup(): Setup {
  const layer = new BaseLayer({ name: 'FluentLayer' });
  const cfg: MockConfigService = {
    getAttributeConfig: jest.fn(() => ({}) as Record<string, AttrConfig>),
    setAttributeConfig: jest.fn(),
    setLayerConfig: jest.fn(),
  };
  const sas: MockStyleAttributeService = { updateStyleAttribute: jest.fn() };
  const cm: MockConfigModel = { read: jest.fn(() => ({})), apply: jest.fn(), rawConfig: {} };
  const sl: MockScaleLegend = { scale: jest.fn() };

  const cast = layer as unknown as Record<string, unknown>;
  cast.configService = cfg as unknown as IGlobalConfigService;
  cast.styleAttributeService = sas;
  cast.configModel = cm;
  cast.scaleLegendManager = sl;

  // 默认 pending 路径：startInit=false（ctor 后即此态）, inited=false
  return { layer, cfg, sas, cm, sl };
}

/** 直访 protected pendingStyleAttributes（运行时数组）。 */
const pendingOf = (l: BaseLayer) =>
  (l as unknown as { pendingStyleAttributes: Array<Record<string, unknown>> })
    .pendingStyleAttributes;

/** 直访 protected setEncodeStyles 填 encodeStyles Map（阶段 3.3 方法）。 */
const setEncodeStyles = (l: BaseLayer, kind: 'shader' | 'data', keys: string[]) =>
  (
    l as unknown as { setEncodeStyles: (k: 'shader' | 'data', ks: string[]) => void }
  ).setEncodeStyles(kind, keys);

/** 直访 encodeStyleAttribute 公开字段 + dataState 公开字段。 */
const encAttr = (l: BaseLayer) =>
  l as unknown as {
    encodeStyleAttribute: Record<string, unknown>;
    dataState: {
      dataSourceNeedUpdate: boolean;
      dataMappingNeedUpdate: boolean;
    };
    shapeOption: { field: unknown; values: unknown } | undefined;
    startInit: boolean;
    inited: boolean;
  };

describe('layer-style-fluent (stage-1 1.1 spec-first — fluent API 行为锁定)', () => {
  let setup: Setup;
  beforeEach(() => {
    setup = makeSetup();
  });

  describe('pending 路径（startInit=false）— color/size/texture/rotate 入队 + 镜像 + return this', () => {
    it.each([['color'], ['size'], ['texture'], ['rotate']] as const)(
      '%s(field, values, updateOptions) → 镜像 + 入队 pending + 返回 this',
      (name) => {
        const { layer, cfg } = setup;
        const upd = { featureRange: [0, 10] } as never;
        const ret = (layer[name] as unknown as (...a: unknown[]) => BaseLayer)('mag', [0, 1], upd);
        expect(ret).toBe(layer); // 链式 return this
        // 镜像经 configService.setAttributeConfig（type 在白名单内）
        expect(cfg.setAttributeConfig).toHaveBeenCalledTimes(1);
        const [layerId, attr] = cfg.setAttributeConfig.mock.calls[0] as [
          string,
          Record<string, AttrConfig>,
        ];
        expect(layerId).toBe(layer.id);
        expect(attr[name]).toEqual({ field: 'mag', values: [0, 1] });
        // 入队 pending
        const p = pendingOf(layer);
        expect(p).toHaveLength(1);
        expect(p[0]).toEqual({
          attributeName: name,
          attributeField: 'mag',
          attributeValues: [0, 1],
          updateOptions: upd,
        });
        // 未触 service（startInit=false）
        expect(setup.sas.updateStyleAttribute).not.toHaveBeenCalled();
      },
    );

    it('color 相同 {field,values}（getAttributeConfig 返回相同）→ isEqual 命中，不镜像不入队', () => {
      const { layer, cfg } = setup;
      cfg.getAttributeConfig.mockReturnValue({ color: { field: 'mag', values: [0, 1] } });
      layer.color('mag', [0, 1]);
      expect(cfg.setAttributeConfig).not.toHaveBeenCalled();
      expect(pendingOf(layer)).toHaveLength(0);
      expect(setup.sas.updateStyleAttribute).not.toHaveBeenCalled();
    });

    it('label 走直接 push（不走 updateStyleAttribute，故无镜像/无 diff）', () => {
      const { layer, cfg } = setup;
      layer.label('city', ['bj', 'sh']);
      expect(pendingOf(layer)).toHaveLength(1);
      expect(pendingOf(layer)[0]).toEqual({
        attributeName: 'label',
        attributeField: 'city',
        attributeValues: ['bj', 'sh'],
        updateOptions: undefined,
      });
      // label 直接 push 故不经 updateStyleAttribute → 无 setAttributeConfig / 无 diff
      expect(cfg.setAttributeConfig).not.toHaveBeenCalled();
    });
  });

  describe('filter/shape — dataSourceNeedUpdate 开关', () => {
    it('filter（inited=false）→ flag true 但 dataSourceNeedUpdate = flag && inited = false', () => {
      const { layer } = setup;
      layer.filter('mag', [0, 1]);
      expect(encAttr(layer).dataState.dataSourceNeedUpdate).toBe(false);
      expect(pendingOf(layer)).toHaveLength(1);
    });
    it('filter（inited=true）→ flag true → dataSourceNeedUpdate = true', () => {
      const { layer } = setup;
      encAttr(layer).inited = true;
      layer.filter('mag', [0, 1]);
      expect(encAttr(layer).dataState.dataSourceNeedUpdate).toBe(true);
    });
    it('filter（inited=true，isEqual 命中 flag=false）→ dataSourceNeedUpdate = false', () => {
      const { layer, cfg } = setup;
      cfg.getAttributeConfig.mockReturnValue({ filter: { field: 'mag', values: [0, 1] } });
      encAttr(layer).inited = true;
      layer.filter('mag', [0, 1]);
      expect(encAttr(layer).dataState.dataSourceNeedUpdate).toBe(false);
    });
    it('shape 存 shapeOption + 入队 + dataSourceNeedUpdate（inited=true）', () => {
      const { layer } = setup;
      encAttr(layer).inited = true;
      layer.shape('circle');
      expect(encAttr(layer).shapeOption).toEqual({ field: 'circle', values: undefined });
      expect(pendingOf(layer)).toHaveLength(1);
      expect(encAttr(layer).dataState.dataSourceNeedUpdate).toBe(true);
    });
  });

  describe('animate — 经 updateLayerConfig 注入 animateOption', () => {
    it('animate(isObject 不带 enable) → enable:true + spread options', () => {
      const { layer, cm } = setup;
      const ret = layer.animate({ duration: 5 } as never);
      expect(ret).toBe(layer);
      expect(cm.apply).toHaveBeenCalledTimes(1);
      expect(cm.apply.mock.calls[0][0]).toEqual({
        animateOption: { enable: true, duration: 5 },
      });
    });
    it('animate(isObject 带 enable) → options.enable 覆盖默认 true（历史 quirk 锁定）', () => {
      // 源码：先 rawAnimate.enable=true 再 {...rawAnimate, ...options}，
      // 故 options.enable 后写覆盖默认 true。据实锁定。
      const { layer, cm } = setup;
      layer.animate({ enable: false, duration: 5 } as never);
      expect(cm.apply.mock.calls[0][0]).toEqual({
        animateOption: { enable: false, duration: 5 },
      });
    });
    it('animate(boolean=false) → {enable:false}', () => {
      const { layer, cm } = setup;
      layer.animate(false);
      expect(cm.apply.mock.calls[0][0]).toEqual({ animateOption: { enable: false } });
    });
    it('animate(boolean=true) → {enable:true}', () => {
      const { layer, cm } = setup;
      layer.animate(true);
      expect(cm.apply.mock.calls[0][0]).toEqual({ animateOption: { enable: true } });
    });
  });

  describe('scale — 转发 scaleLegendManager + return this', () => {
    it('scale(field, cfg?) → scaleLegendManager.scale(field, cfg?)', () => {
      const { layer, sl } = setup;
      expect(layer.scale('mag', { type: 'quantile' } as never)).toBe(layer);
      expect(sl.scale).toHaveBeenCalledWith('mag', { type: 'quantile' });
    });
  });

  describe('style() 兼容别名 + 旧版数组 + encodeStyle 路由 + updateLayerConfig', () => {
    it('borderColor→stroke、borderWidth→strokeWidth 别名归一', () => {
      const { layer, cm } = setup;
      layer.style({ borderColor: '#fff', borderWidth: 2 } as never);
      const applied = cm.apply.mock.calls[0][0] as Record<string, unknown>;
      expect(applied.stroke).toBe('#fff');
      expect(applied.strokeWidth).toBe(2);
    });
    it('旧版 [field, value] 数组（两元非数字）→ {field, value}', () => {
      const { layer, cm } = setup;
      layer.style({ color: ['mag', '#fff'] } as never);
      const applied = cm.apply.mock.calls[0][0] as Record<
        string,
        { field: unknown; value: unknown }
      >;
      expect(applied.color).toEqual({ field: 'mag', value: '#fff' });
    });
    it('encodeStyles.has(color)=shader 且值 plain + field → 存 encodeStyleAttribute + updateStyleAttribute', () => {
      const { layer, cm } = setup;
      setEncodeStyles(layer, 'shader', ['color']);
      layer.style({ color: { field: 'mag', value: ['#fff'] } } as never);
      // encodeStyle 存
      expect(encAttr(layer).encodeStyleAttribute.color).toEqual({ field: 'mag', value: ['#fff'] });
      // updateStyleAttribute 触发（pending 路径：mirror + push）
      expect(pendingOf(layer)).toContainEqual({
        attributeName: 'color',
        attributeField: 'mag',
        attributeValues: ['#fff'],
        updateOptions: undefined,
      });
      // inited=false → 不切 dataMappingNeedUpdate
      expect(encAttr(layer).dataState.dataMappingNeedUpdate).toBe(false);
      expect(cm.apply).toHaveBeenCalled();
    });
    it('encodeStyles.has 但值与现 isEqual → 不重存/不 updateStyleAttribute', () => {
      const { layer } = setup;
      setEncodeStyles(layer, 'shader', ['color']);
      encAttr(layer).encodeStyleAttribute.color = { field: 'mag', value: ['#fff'] };
      layer.style({ color: { field: 'mag', value: ['#fff'] } } as never);
      expect(pendingOf(layer)).toHaveLength(0);
    });
    it('encodeStyles 未含 key 且现存 → 删除 + dataSourceNeedUpdate', () => {
      const { layer } = setup;
      // color 未在 encodeStyles → else 分支
      encAttr(layer).encodeStyleAttribute.color = { field: 'mag' };
      layer.style({ color: '#fff' } as never);
      expect(encAttr(layer).encodeStyleAttribute.color).toBeUndefined();
      expect(encAttr(layer).dataState.dataSourceNeedUpdate).toBe(true);
    });
    it('encodeStyles.has + 值非 plain（字符串）→ else 分支', () => {
      const { layer } = setup;
      setEncodeStyles(layer, 'shader', ['color']);
      encAttr(layer).encodeStyleAttribute.color = { field: 'old' };
      layer.style({ color: '#fff' } as never); // plain-object gate 失败
      expect(encAttr(layer).encodeStyleAttribute.color).toBeUndefined();
      expect(encAttr(layer).dataState.dataSourceNeedUpdate).toBe(true);
    });
  });

  describe('service 路径（startInit=true）— updateStyleAttribute 直驱 service + split', () => {
    it('color startInit=true → styleAttributeService.updateStyleAttribute 传 split scale', () => {
      const { layer, sas, cm } = setup;
      encAttr(layer).startInit = true;
      cm.read.mockReturnValue({ color: 1 } as never); // getLayerConfig()[field] fallback
      layer.color('color', [0, 1]);
      expect(sas.updateStyleAttribute).toHaveBeenCalledTimes(1);
      const [type, opts] = sas.updateStyleAttribute.mock.calls[0] as [
        string,
        { scale: { field: unknown; values: unknown; callback: unknown } },
      ];
      expect(type).toBe('color');
      expect(opts.scale.field).toBe('color');
      expect(opts.scale.values).toEqual([0, 1]);
      expect(opts.scale.callback).toBeUndefined();
      // service 路径不入 pending
      expect(pendingOf(layer)).toHaveLength(0);
      // mirror 仍发生
      expect(setup.cfg.setAttributeConfig).toHaveBeenCalledTimes(1);
    });

    it('splitValuesAndCallbackInAttribute：函数 → callback，values=undefined', () => {
      const { layer, sas } = setup;
      encAttr(layer).startInit = true;
      const cb = () => 1;
      layer.size('s', cb as never);
      const opts = sas.updateStyleAttribute.mock.calls[0][1] as {
        scale: { values: unknown; callback: unknown };
      };
      expect(opts.scale.values).toBeUndefined();
      expect(opts.scale.callback).toBe(cb);
    });

    it('startInit=true 仍受 isEqual diff 守门（相同 → 不调 service）', () => {
      const { layer, sas, cfg } = setup;
      encAttr(layer).startInit = true;
      cfg.getAttributeConfig.mockReturnValue({ size: { field: 's', values: [0, 1] } });
      layer.size('s', [0, 1]);
      expect(sas.updateStyleAttribute).not.toHaveBeenCalled();
      expect(cfg.setAttributeConfig).not.toHaveBeenCalled();
      expect(pendingOf(layer)).toHaveLength(0);
    });
  });

  describe('链式 return-this 组合', () => {
    it('color().size().shape().label().scale() 链式不 break', () => {
      const { layer } = setup;
      const ret = layer.color('a', [0]).size('b', [1]).shape('circle').label('c').scale('d');
      expect(ret).toBe(layer);
    });
  });
});
