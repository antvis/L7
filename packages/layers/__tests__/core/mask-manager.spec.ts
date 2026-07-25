import type { ILayer } from '@antv/l7-core';
import type BaseLayer from '../../src/core/BaseLayer';
import LayerMaskManager from '../../src/core/LayerMaskManager';

/**
 * 阶段 6.1：图层遮罩管理 delegate（`LayerMaskManager`，阶段 1.7 抽出）独立
 * 特征化 spec。当前该 delegate 仅经 BaseLayer 子类渲染路径间接覆盖；本 spec
 * 以满足窄依赖面的 mock layer（仅 `updateLayerConfig`）+ 注入的真实 `masks[]`
 * 数组直连 delegate，锁定其可观测契约：
 *
 *   - ctor 持注入 `masks[]` 引用，后续 push/splice 就地 mutate（同一引用，
 *     BaseLayer 公开字段语义保留）
 *   - addMask：push + updateLayerConfig({maskLayers: masks}) + enableMask
 *   - removeMask：indexOf + 找到则 splice + updateLayerConfig({maskLayers})；
 *     未找到仍调 updateLayerConfig（不 splice）
 *   - enableMask/disableMask → updateLayerConfig({enableMask: true/false})
 *   - addMaskLayer (@deprecated)：仅 push，不调 updateLayerConfig、不 enableMask
 *   - removeMaskLayer (@deprecated)：找到则 splice；**destroy() 总被调用**
 *     （在 if 块外，未找到也调）——锁定历史 quirk
 *
 * 任何后续 delegate 改动破坏 mutate 引用语义 / 副作用 / destroy 调度即应使
 * 本 spec 失败。
 */

interface MockHandle {
  updateLayerConfig: (patch: Record<string, unknown>) => void;
  calls: { update: Array<Record<string, unknown>> };
}

function makeLayer(): MockHandle {
  const calls = { update: [] as Array<Record<string, unknown>> };
  return {
    calls,
    updateLayerConfig: (patch: Record<string, unknown>) => {
      calls.update.push(patch);
    },
  };
}

function makeMask(id: string): { mask: ILayer; destroyCalls: number } {
  const rec: { mask: ILayer; destroyCalls: number } = {
    destroyCalls: 0,
    mask: { id, destroy: () => rec.destroyCalls++ } as unknown as ILayer,
  };
  return rec;
}

function bind(layer: MockHandle, masks: ILayer[]): LayerMaskManager {
  return new LayerMaskManager(layer as unknown as BaseLayer, masks);
}

describe('mask-manager delegate (stage-6 6.1)', () => {
  it('ctor 持注入 masks[] 引用，就地 mutate（同一引用）', () => {
    const layer = makeLayer();
    const masks: ILayer[] = [];
    const s = bind(layer, masks);
    const m = makeMask('a').mask;
    s.addMask(m);
    expect(masks).toHaveLength(1);
    expect(masks[0]).toBe(m); // 注入数组被就地 push
  });

  it('addMask：push + updateLayerConfig({maskLayers: masks}) + enableMask', () => {
    const layer = makeLayer();
    const masks: ILayer[] = [];
    const s = bind(layer, masks);
    const ma = makeMask('a').mask;
    const mb = makeMask('b').mask;
    s.addMask(ma);
    s.addMask(mb);
    expect(masks).toEqual([ma, mb]);
    // 第一次：{maskLayers} + {enableMask:true}；第二次同
    expect(layer.calls.update).toEqual([
      { maskLayers: masks },
      { enableMask: true },
      { maskLayers: masks },
      { enableMask: true },
    ]);
  });

  it('addMask 传的 maskLayers 是同一 masks 引用（非拷贝）', () => {
    const layer = makeLayer();
    const masks: ILayer[] = [];
    const s = bind(layer, masks);
    s.addMask(makeMask('a').mask);
    expect(layer.calls.update[0]).toEqual({ maskLayers: masks });
    expect((layer.calls.update[0] as { maskLayers: ILayer[] }).maskLayers).toBe(masks);
  });

  it('removeMask：找到则 splice + updateLayerConfig({maskLayers})', () => {
    const layer = makeLayer();
    const { mask: ma } = makeMask('a');
    const { mask: mb } = makeMask('b');
    const masks: ILayer[] = [ma, mb];
    const s = bind(layer, masks);
    s.removeMask(ma);
    expect(masks).toEqual([mb]);
    expect(layer.calls.update).toEqual([{ maskLayers: masks }]);
  });

  it('removeMask：未找到仍调 updateLayerConfig（不 splice）', () => {
    const layer = makeLayer();
    const { mask: ma } = makeMask('a');
    const { mask: other } = makeMask('x');
    const masks: ILayer[] = [ma];
    const s = bind(layer, masks);
    s.removeMask(other); // 不在数组
    expect(masks).toEqual([ma]); // 未变
    expect(layer.calls.update).toEqual([{ maskLayers: masks }]); // 仍调
  });

  it('enableMask/disableMask → updateLayerConfig 对应键', () => {
    const layer = makeLayer();
    const s = bind(layer, []);
    s.enableMask();
    s.disableMask();
    expect(layer.calls.update).toEqual([{ enableMask: true }, { enableMask: false }]);
  });

  it('addMaskLayer (@deprecated)：仅 push，不调 updateLayerConfig、不 enableMask', () => {
    const layer = makeLayer();
    const masks: ILayer[] = [];
    const s = bind(layer, masks);
    const { mask: ma } = makeMask('a');
    s.addMaskLayer(ma);
    expect(masks).toEqual([ma]);
    expect(layer.calls.update).toHaveLength(0); // 无副作用
  });

  it('removeMaskLayer (@deprecated)：找到则 splice + destroy', () => {
    const layer = makeLayer();
    const rec = makeMask('a');
    const { mask: mb } = makeMask('b');
    const masks: ILayer[] = [rec.mask, mb];
    const s = bind(layer, masks);
    s.removeMaskLayer(rec.mask);
    expect(masks).toEqual([mb]);
    expect(rec.destroyCalls).toBe(1);
    expect(layer.calls.update).toHaveLength(0); // deprecated 路径无 updateLayerConfig
  });

  it('removeMaskLayer (@deprecated)：未找到仍调 destroy（quirk：destroy 在 if 外）', () => {
    const layer = makeLayer();
    const rec = makeMask('x');
    const { mask: ma } = makeMask('a');
    const masks: ILayer[] = [ma];
    const s = bind(layer, masks);
    s.removeMaskLayer(rec.mask); // 不在数组
    expect(masks).toEqual([ma]); // 未 splice
    expect(rec.destroyCalls).toBe(1); // destroy 仍被调用（历史 quirk）
  });
});
