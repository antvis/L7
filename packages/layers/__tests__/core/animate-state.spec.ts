import type BaseLayer from '../../src/core/BaseLayer';
import LayerAnimateState from '../../src/core/LayerAnimateState';

/**
 * 阶段 6.3：动画运行态 delegate（`LayerAnimateState`，阶段 1.5 抽出）独立
 * 特征化 spec。当前该 delegate 仅经 BaseLayer 生命周期/插件路径间接覆盖；
 * 本 spec 以满足窄依赖面的 mock layer 直连 delegate，锁定其可观测契约：
 *
 *   - 默认：animateStatus=false、animateStartTime=0
 *   - prepareAnimate：`getLayerConfig().animateOption?.enable` 真 →
 *     `layerService.startAnimate()` 调用 + status=true；否则 no-op
 *     （注意：delegate 解构 `getLayerConfig()`，假定其非 undefined——
 *     post-init 路径成立；本 spec 始终返回对象）
 *   - getTime → `layerService.clock.getDelta()` 透传
 *   - setAnimateStartTime ← `clock.getElapsedTime()`
 *   - getLayerAnimateTime = `clock.getElapsedTime()` - animateStartTime
 *   - stopAnimate：status 真 → `layerService.stopAnimate()` +
 *     `updateLayerConfig({animateOption:{enable:false}})` + status=false；
 *     status 假 → 全 no-op
 *
 * 任何后续 delegate 改动破坏 control flow / clock 透传 / 副作用即应使本 spec 失败。
 */

// mock layer 窄依赖面：delegate 仅读这些成员
interface AnimateLayer extends Pick<BaseLayer, 'getLayerConfig' | 'updateLayerConfig'> {
  container: { layerService: MockLayerService };
}

interface MockClock {
  getDelta: () => number;
  getElapsedTime: () => number;
}
interface MockLayerService {
  startAnimate: () => void;
  stopAnimate: () => void;
  clock: MockClock;
}

interface CallLog {
  startAnimate: number;
  stopAnimate: number;
  updateCalls: Array<Record<string, unknown>>;
}

interface MockLayerHandle extends AnimateLayer {
  // 测试可变时钟 + 调用计数（非 delegate 依赖面，仅供断言）
  // `calls` 为单一对象引用，闭包递增可见于 `layer.calls.*`
  clock: { elapsed: number; delta: number };
  calls: CallLog;
}

function makeAnimateLayer(opts: {
  animateOption?: { enable?: boolean };
  elapsed?: number;
  delta?: number;
}): MockLayerHandle {
  const clock = { elapsed: opts.elapsed ?? 0, delta: opts.delta ?? 0 };
  const calls: CallLog = {
    startAnimate: 0,
    stopAnimate: 0,
    updateCalls: [],
  };
  const layer: MockLayerHandle = {
    calls,
    clock,
    getLayerConfig: () => ({ animateOption: opts.animateOption }),
    container: {
      layerService: {
        startAnimate: () => {
          calls.startAnimate++;
        },
        stopAnimate: () => {
          calls.stopAnimate++;
        },
        clock: {
          getDelta: () => clock.delta,
          getElapsedTime: () => clock.elapsed,
        },
      },
    },
    updateLayerConfig: (patch: Record<string, unknown>) => {
      calls.updateCalls.push(patch);
    },
  };
  return layer;
}

describe('animate-state delegate (stage-6 6.3)', () => {
  it('默认：animateStatus=false、animateStartTime=0（getLayerAnimateTime=elapsed）', () => {
    const layer = makeAnimateLayer({ elapsed: 10 });
    const s = new LayerAnimateState(layer);
    expect(s.getAnimateStatus()).toBe(false);
    // animateStartTime 默认 0 → elapsed(10) - 0 = 10
    expect(s.getLayerAnimateTime()).toBe(10);
  });

  it('prepareAnimate：animateOption.enable=true → startAnimate 调用 + status=true', () => {
    const layer = makeAnimateLayer({ animateOption: { enable: true } });
    const s = new LayerAnimateState(layer);
    s.prepareAnimate();
    expect(layer.calls.startAnimate).toBe(1);
    expect(s.getAnimateStatus()).toBe(true);
  });

  it('prepareAnimate：animateOption.enable=false → no-op', () => {
    const layer = makeAnimateLayer({ animateOption: { enable: false } });
    const s = new LayerAnimateState(layer);
    s.prepareAnimate();
    expect(layer.calls.startAnimate).toBe(0);
    expect(s.getAnimateStatus()).toBe(false);
  });

  it('prepareAnimate：无 animateOption → no-op', () => {
    const layer = makeAnimateLayer({});
    const s = new LayerAnimateState(layer);
    s.prepareAnimate();
    expect(layer.calls.startAnimate).toBe(0);
    expect(s.getAnimateStatus()).toBe(false);
  });

  it('getTime → clock.getDelta() 透传', () => {
    const layer = makeAnimateLayer({ delta: 0.016 });
    const s = new LayerAnimateState(layer);
    expect(s.getTime()).toBe(0.016);
  });

  it('setAnimateStartTime ← clock.getElapsedTime()，影响 getLayerAnimateTime', () => {
    const layer = makeAnimateLayer({ elapsed: 10 });
    const s = new LayerAnimateState(layer);
    s.setAnimateStartTime(); // animateStartTime = 10
    layer.clock.elapsed = 30; // 推进时钟
    expect(s.getLayerAnimateTime()).toBe(20); // 30 - 10
  });

  it('stopAnimate：status=false → 全 no-op', () => {
    const layer = makeAnimateLayer({});
    const s = new LayerAnimateState(layer);
    s.stopAnimate();
    expect(layer.calls.stopAnimate).toBe(0);
    expect(layer.calls.updateCalls).toHaveLength(0);
    expect(s.getAnimateStatus()).toBe(false);
  });

  it('stopAnimate：status=true → stopAnimate + updateLayerConfig 关闭 + status=false', () => {
    const layer = makeAnimateLayer({ animateOption: { enable: true } });
    const s = new LayerAnimateState(layer);
    s.prepareAnimate(); // status=true
    s.stopAnimate();
    expect(layer.calls.stopAnimate).toBe(1);
    expect(layer.calls.updateCalls).toEqual([{ animateOption: { enable: false } }]);
    expect(s.getAnimateStatus()).toBe(false);
  });

  it('stopAnimate 幂等：status 已 false 时再次调用为 no-op', () => {
    const layer = makeAnimateLayer({ animateOption: { enable: true } });
    const s = new LayerAnimateState(layer);
    s.prepareAnimate();
    s.stopAnimate();
    s.stopAnimate(); // 已 false
    expect(layer.calls.stopAnimate).toBe(1);
    expect(layer.calls.updateCalls).toHaveLength(1);
  });
});
