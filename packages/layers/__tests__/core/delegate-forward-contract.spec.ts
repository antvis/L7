import BaseLayer from '../../src/core/BaseLayer';

/**
 * 阶段 6.4：`BaseLayer` 公共方法→各 delegate 的透传契约锁定 spec
 * （仿 maps `base-map-event.spec.ts` 接口契约风格）。
 *
 * 1.1–1.8 delegate 抽出后（阶段 1），`BaseLayer` 上仍保留同名公共方法作为
 * 对外 `ILayer` 契约表面，内部薄转发各 delegate。本 spec 锁定每个公共方法
 * 与对应 delegate 方法的 **1:1 透传契约**：
 *
 *   - 参数原样透传（无变换/重排序/默认值注入）
 *   - 返回值原样透传
 *   - 无-arg void 方法仅触发对应 delegate 方法一次
 *   - 不旁路 delegate 调用其他 delegate（无跨 delegate 副作用）
 *
 * 实现：实例化 `BaseLayer`（可直接 new）后，将各 delegate 公共字段
 * （`maskManager`/`pickingManager`/`visibilityZoomManager`/
 * `scaleLegendManager`/`animateState`/`relativeCoordsManager`/`configModel`
 * 均为 `public`）替换为 spy stub。然后调每个公共转发
 * 方法，断言对应 spy 被以传入参数 verbatim 调用一次，返回值透传。
 *
 * 任何后续重构破坏透传契约（变换参数/丢弃返回值/旁路 delegate/新增跨
 * delegate 副作用）即应使本 spec 失败，从而把「对外 API 表面透明」从
 * 隐式约定提升为可执行护栏。
 */

// ---- spy stub 类型 ----
interface Spy {
  call: jest.Mock;
}

function spies(names: readonly string[]): Record<string, Spy> {
  const out: Record<string, Spy> = {};
  for (const n of names) {
    out[n] = { call: jest.fn() };
  }
  return out;
}

/** 把 methods 映射成 delegate-like stub：每个方法返回 call mock 的返回值。 */
function stubDelegate(methods: Record<string, Spy>): Record<string, jest.Mock> {
  const out: Record<string, jest.Mock> = {};
  for (const [name, s] of Object.entries(methods)) {
    out[name] = s.call;
  }
  return out;
}

describe('delegate-forward-contract (stage-6 6.4 — BaseLayer→delegate 透传)', () => {
  let layer: BaseLayer;
  let maskManager: ReturnType<typeof spies>;
  let pickingManager: ReturnType<typeof spies>;
  let visibilityZoomManager: ReturnType<typeof spies>;
  let scaleLegendManager: ReturnType<typeof spies>;
  let animateState: ReturnType<typeof spies>;
  let relativeCoordsManager: ReturnType<typeof spies>;
  let configModel: ReturnType<typeof spies>;

  beforeEach(() => {
    layer = new BaseLayer({ name: 'ContractLayer' });
    maskManager = spies([
      'addMask',
      'removeMask',
      'disableMask',
      'enableMask',
      'addMaskLayer',
      'removeMaskLayer',
    ]);
    pickingManager = spies([
      'active',
      'setActive',
      'select',
      'setSelect',
      'setCurrentPickId',
      'getCurrentPickId',
      'setCurrentSelectedId',
      'getCurrentSelectedId',
      'pick',
      'boxSelect',
      'needPick',
    ]);
    visibilityZoomManager = spies([
      'show',
      'hide',
      'setIndex',
      'isVisible',
      'setMinZoom',
      'getMinZoom',
      'getMaxZoom',
      'setMaxZoom',
      'setAutoFit',
      'fitBounds',
    ]);
    scaleLegendManager = spies([
      'scale',
      'getScaleOptions',
      'getScale',
      'getLegend',
      'getLegendItems',
    ]);
    animateState = spies([
      'getAnimateStatus',
      'getTime',
      'setAnimateStartTime',
      'stopAnimate',
      'getLayerAnimateTime',
    ]);
    relativeCoordsManager = spies([
      'processRelativeCoordinates',
      'getAbsoluteData',
      'getRelativeOrigin',
      'getOriginalExtent',
    ]);
    configModel = spies(['read', 'apply', 'hasPending']);

    // swap public delegate fields with stubs
    const attach = (target: string, sp: ReturnType<typeof spies>) => {
      Object.assign(
        (layer as unknown as Record<string, Record<string, jest.Mock>>)[target],
        stubDelegate(sp),
      );
    };
    attach('maskManager', maskManager);
    attach('pickingManager', pickingManager);
    attach('visibilityZoomManager', visibilityZoomManager);
    attach('scaleLegendManager', scaleLegendManager);
    attach('animateState', animateState);
    attach('relativeCoordsManager', relativeCoordsManager);
    attach('configModel', configModel);
    // 默认让各 returning-mock 返回独特标记，便于透传断言
    Object.values({ ...maskManager, ...pickingManager, ...visibilityZoomManager }).forEach((s) =>
      s.call.mockReturnValue(undefined),
    );
    // pick 一个唯一返回值便于 ILayer return 断言
    const RET = { marker: 'pass-through' };
    pickingManager.active.call.mockReturnValue(RET);
    pickingManager.select.call.mockReturnValue(RET);
    pickingManager.getCurrentPickId.call.mockReturnValue(7);
    pickingManager.getCurrentSelectedId.call.mockReturnValue(11);
    pickingManager.needPick.call.mockReturnValue(true);
    visibilityZoomManager.show.call.mockReturnValue(layer);
    visibilityZoomManager.hide.call.mockReturnValue(layer);
    visibilityZoomManager.setIndex.call.mockReturnValue(layer);
    visibilityZoomManager.isVisible.call.mockReturnValue(false);
    visibilityZoomManager.setMinZoom.call.mockReturnValue(layer);
    visibilityZoomManager.getMinZoom.call.mockReturnValue(3);
    visibilityZoomManager.getMaxZoom.call.mockReturnValue(18);
    visibilityZoomManager.setMaxZoom.call.mockReturnValue(layer);
    visibilityZoomManager.setAutoFit.call.mockReturnValue(layer);
    visibilityZoomManager.fitBounds.call.mockReturnValue(layer);
    scaleLegendManager.getScaleOptions.call.mockReturnValue({ marker: 'so' });
    scaleLegendManager.getScale.call.mockReturnValue({ marker: 'scale' });
    scaleLegendManager.getLegend.call.mockReturnValue({ marker: 'legend' });
    scaleLegendManager.getLegendItems.call.mockReturnValue([{ marker: 'li' }]);
    animateState.getAnimateStatus.call.mockReturnValue(true);
    animateState.getTime.call.mockReturnValue(42);
    animateState.getLayerAnimateTime.call.mockReturnValue(99);
    relativeCoordsManager.getAbsoluteData.call.mockReturnValue({ marker: 'abs' });
    relativeCoordsManager.getRelativeOrigin.call.mockReturnValue({ marker: 'rel' });
    relativeCoordsManager.getOriginalExtent.call.mockReturnValue([0, 0, 1, 1]);
    configModel.read.call.mockReturnValue({ marker: 'read' });
  });

  describe('LayerMaskManager (1.7) — 透传', () => {
    it('addMask(layer) → maskManager.addMask(layer) verbatim', () => {
      const m = { id: 'mask' } as never;
      layer.addMask(m);
      expect(maskManager.addMask.call).toHaveBeenCalledTimes(1);
      expect(maskManager.addMask.call).toHaveBeenCalledWith(m);
    });

    it('removeMask(layer) → maskManager.removeMask(layer) verbatim', () => {
      const m = { id: 'mask' } as never;
      layer.removeMask(m);
      expect(maskManager.removeMask.call).toHaveBeenCalledWith(m);
    });

    it('disableMask()/enableMask() → 同名 delegate 无参 void', () => {
      layer.disableMask();
      layer.enableMask();
      expect(maskManager.disableMask.call).toHaveBeenCalledTimes(1);
      expect(maskManager.enableMask.call).toHaveBeenCalledTimes(1);
      expect(maskManager.disableMask.call).toHaveBeenCalledWith();
      expect(maskManager.enableMask.call).toHaveBeenCalledWith();
    });

    it('deprecated addMaskLayer/removeMaskLayer 仍透传（兼容期保留）', () => {
      const m = { id: 'ml' } as never;
      layer.addMaskLayer(m);
      layer.removeMaskLayer(m);
      expect(maskManager.addMaskLayer.call).toHaveBeenCalledWith(m);
      expect(maskManager.removeMaskLayer.call).toHaveBeenCalledWith(m);
    });
  });

  describe('LayerPickingManager (1.3b) — 透传 + 返回值', () => {
    it('active(options) → pickingManager.active(options)，返回值透传', () => {
      const opt = { x: 1 } as never;
      expect(layer.active(opt)).toEqual({ marker: 'pass-through' });
      expect(pickingManager.active.call).toHaveBeenCalledWith(opt);
    });
    it('active(boolean) → pickingManager.active(boolean)', () => {
      layer.active(true as never);
      layer.active(false as never);
      expect(pickingManager.active.call).toHaveBeenNthCalledWith(1, true);
      expect(pickingManager.active.call).toHaveBeenNthCalledWith(2, false);
    });
    it('setActive(id, options?) → pickingManager.setActive', () => {
      layer.setActive(5);
      expect(pickingManager.setActive.call).toHaveBeenCalledWith(5, undefined);
      layer.setActive({ x: 1, y: 2 }, { id: 'opt' } as never);
      expect(pickingManager.setActive.call).toHaveBeenLastCalledWith(
        { x: 1, y: 2 },
        {
          id: 'opt',
        },
      );
    });
    it('select(option) → pickingManager.select(option)，返回值透传', () => {
      expect(layer.select(true as never)).toEqual({ marker: 'pass-through' });
      expect(pickingManager.select.call).toHaveBeenCalledWith(true);
    });
    it('setSelect(id, options?) → pickingManager.setSelect', () => {
      layer.setSelect(9);
      expect(pickingManager.setSelect.call).toHaveBeenCalledWith(9, undefined);
    });
    it('setCurrentPickId/getCurrentPickId/setCurrentSelectedId/getCurrentSelectedId 透传', () => {
      layer.setCurrentPickId(7);
      expect(layer.getCurrentPickId()).toBe(7);
      layer.setCurrentSelectedId(11);
      expect(layer.getCurrentSelectedId()).toBe(11);
      expect(pickingManager.setCurrentPickId.call).toHaveBeenCalledWith(7);
      expect(pickingManager.getCurrentPickId.call).toHaveBeenCalledWith();
      expect(pickingManager.setCurrentSelectedId.call).toHaveBeenCalledWith(11);
      expect(pickingManager.getCurrentSelectedId.call).toHaveBeenCalledWith();
    });
    it('pick({x,y}) → pickingManager.pick({x,y}) verbatim', () => {
      layer.pick({ x: 3, y: 4 });
      expect(pickingManager.pick.call).toHaveBeenCalledWith({ x: 3, y: 4 });
    });
    it('boxSelect(box, cb) → pickingManager.boxSelect(box, cb) verbatim', () => {
      const box: [number, number, number, number] = [0, 0, 1, 1];
      const cb = () => undefined;
      layer.boxSelect(box, cb);
      expect(pickingManager.boxSelect.call).toHaveBeenCalledWith(box, cb);
    });
    it('needPick(type) → pickingManager.needPick(type)，返回值透传', () => {
      expect(layer.needPick('mousemove')).toBe(true);
      expect(pickingManager.needPick.call).toHaveBeenCalledWith('mousemove');
    });
  });

  describe('LayerVisibilityZoom (1.8) — 透传 + 返回值', () => {
    it('show/hide/setIndex 返回 ILayer（this 透传）', () => {
      expect(layer.show()).toBe(layer);
      expect(layer.hide()).toBe(layer);
      expect(layer.setIndex(2)).toBe(layer);
      expect(visibilityZoomManager.show.call).toHaveBeenCalledWith();
      expect(visibilityZoomManager.hide.call).toHaveBeenCalledWith();
      expect(visibilityZoomManager.setIndex.call).toHaveBeenCalledWith(2);
    });
    it('isVisible() → visibilityZoomManager.isVisible()，返回值透传', () => {
      expect(layer.isVisible()).toBe(false);
    });
    it('setMinZoom/getMinZoom/setMaxZoom/getMaxZoom 透传', () => {
      expect(layer.setMinZoom(3)).toBe(layer);
      expect(layer.getMinZoom()).toBe(3);
      expect(layer.setMaxZoom(18)).toBe(layer);
      expect(layer.getMaxZoom()).toBe(18);
    });
    it('setAutoFit/fitBounds 返回 ILayer 透传', () => {
      expect(layer.setAutoFit(true)).toBe(layer);
      expect(layer.fitBounds({ max: 1 } as never)).toBe(layer);
      expect(visibilityZoomManager.setAutoFit.call).toHaveBeenCalledWith(true);
      expect(visibilityZoomManager.fitBounds.call).toHaveBeenCalledWith({ max: 1 });
    });
  });

  describe('LayerScaleLegend (1.6) — 透传 + 返回值', () => {
    it('scale(field, cfg?) → scaleLegendManager.scale(field, cfg?)', () => {
      layer.scale('magnitude', { type: 'quantile' } as never);
      expect(scaleLegendManager.scale.call).toHaveBeenCalledWith('magnitude', {
        type: 'quantile',
      });
      layer.scale('fld');
      expect(scaleLegendManager.scale.call).toHaveBeenLastCalledWith('fld', undefined);
    });
    it('getScaleOptions/getScale/getLegend/getLegendItems 返回值透传', () => {
      expect(layer.getScaleOptions()).toEqual({ marker: 'so' });
      expect(layer.getScale('color')).toEqual({ marker: 'scale' });
      expect(layer.getLegend('color')).toEqual({ marker: 'legend' });
      expect(layer.getLegendItems('color')).toEqual([{ marker: 'li' }]);
    });
  });

  describe('LayerAnimateState (1.5) — getter/方法透传', () => {
    it('animateStatus getter → animateState.getAnimateStatus()', () => {
      expect(layer.animateStatus).toBe(true);
      expect(animateState.getAnimateStatus.call).toHaveBeenCalledWith();
    });
    it('getTime/setAnimateStartTime/stopAnimate/getLayerAnimateTime 透传', () => {
      expect(layer.getTime()).toBe(42);
      layer.setAnimateStartTime();
      expect(animateState.setAnimateStartTime.call).toHaveBeenCalledWith();
      layer.stopAnimate();
      expect(animateState.stopAnimate.call).toHaveBeenCalledWith();
      expect(layer.getLayerAnimateTime()).toBe(99);
    });
  });

  describe('LayerRelativeCoords (1.4) — 透传 + 返回值', () => {
    it('getAbsoluteData/getRelativeOrigin/getOriginalExtent 返回值透传', () => {
      expect(layer.getAbsoluteData()).toEqual({ marker: 'abs' });
      expect(layer.getRelativeOrigin()).toEqual({ marker: 'rel' });
      expect(layer.getOriginalExtent()).toEqual([0, 0, 1, 1]);
    });
  });

  describe('LayerConfigModel (1.x) — getLayerConfig/updateLayerConfig 透传', () => {
    it('getLayerConfig() → configModel.read() 返回值透传', () => {
      expect(layer.getLayerConfig()).toEqual({ marker: 'read' });
      expect(configModel.read.call).toHaveBeenCalledWith();
    });
    it('updateLayerConfig(cfg) → configModel.apply(cfg) verbatim', () => {
      const cfg = { color: '#fff' } as never;
      layer.updateLayerConfig(cfg);
      expect(configModel.apply.call).toHaveBeenCalledWith(cfg);
    });
  });

  describe('跨 delegate 无副作用护栏', () => {
    it('调 active 仅触 pickingManager，不触其他 delegate', () => {
      layer.active(true as never);
      expect(pickingManager.active.call).toHaveBeenCalledTimes(1);
      const allOthers = [
        ...Object.values(maskManager),
        ...Object.values(visibilityZoomManager),
        ...Object.values(scaleLegendManager),
        ...Object.values(animateState),
        ...Object.values(relativeCoordsManager),
        ...Object.values(configModel),
      ];
      allOthers.forEach((s) => expect(s.call).not.toHaveBeenCalled());
    });
    it('调 show 仅触 visibilityZoomManager.show', () => {
      layer.show();
      expect(visibilityZoomManager.show.call).toHaveBeenCalledTimes(1);
      [
        ...Object.values(maskManager),
        ...Object.values(pickingManager),
        ...Object.values(scaleLegendManager),
        ...Object.values(animateState),
      ].forEach((s) => expect(s.call).not.toHaveBeenCalled());
    });
  });
});
