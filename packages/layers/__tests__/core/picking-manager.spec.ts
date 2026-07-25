import { encodePickingColor } from '@antv/l7-utils';
import type BaseLayer from '../../src/core/BaseLayer';
import LayerPickingManager from '../../src/core/LayerPickingManager';

/**
 * 阶段 6.1：拾取编排 delegate（`LayerPickingManager`，阶段 1.3b 抽出）独立
 * 特征化 spec。当前该 delegate 仅经 BaseLayer 子类渲染/插件路径间接覆盖；
 * 本 spec 以满足窄依赖面的 mock layer 直连 delegate，锁定其可观测契约：
 *
 *   - pick/boxSelect：thin forward（interactionService.triggerHover /
 *     pickingService.boxPickLayer 透传）
 *   - pickId/selectedId 状态：set/get 读写
 *   - needPick：`isVisible() && isPick`，isPick 由 eventNames indexOf +
 *     enableHighlight/enableSelect + click/dblclick/mousemove 规则合成
 *   - active/select：配置派生（object → enable=true + color/mix；boolean → !!）
 *     + 返回 layer（链式）
 *   - setActive/setSelect 双分支：object id {x,y} → updateLayerConfig(color/mix)
 *     + pick({x,y})；number id → updateLayerConfig({pickedFeatureID, color, mix})
 *     + hooks.beforeHighlight/beforeSelect.call(encodePickingColor(id))
 *     .then(() => setTimeout(rerender, 1))（魔法 1ms 延迟 quirk）
 *
 * 任何后续 delegate 改动破坏 forward / 配置派生 / hook 调度 / 延迟即应使本 spec 失败。
 */

interface MockHook {
  call: (arg: unknown) => Promise<void>;
}
interface MockHandle {
  container: {
    interactionService: { triggerHover: (pos: { x: number; y: number }) => void };
    pickingService: {
      boxPickLayer: (layer: unknown, box: number[], cb: (...a: unknown[]) => void) => void;
    };
  };
  getLayerConfig: () => Record<string, unknown>;
  eventNames: () => string[];
  isVisible: () => boolean;
  updateLayerConfig: (patch: Record<string, unknown>) => void;
  hooks: { beforeHighlight: MockHook; beforeSelect: MockHook };
  calls: {
    update: Array<Record<string, unknown>>;
    triggerHover: Array<{ x: number; y: number }>;
    boxPick: number;
    highlightCallArgs: unknown[];
    selectCallArgs: unknown[];
  };
}

function makeLayer(cfg: Record<string, unknown> = {}): MockHandle {
  const config = {
    enableHighlight: true,
    enableSelect: true,
    highlightColor: '#fff',
    activeMix: 0,
    selectColor: '#000',
    selectMix: 0,
    ...cfg,
  };
  let eventNames: string[] = [];
  let visible = true;
  const calls: MockHandle['calls'] = {
    update: [],
    triggerHover: [],
    boxPick: 0,
    highlightCallArgs: [],
    selectCallArgs: [],
  };
  return {
    calls,
    container: {
      interactionService: {
        triggerHover: (pos) => {
          calls.triggerHover.push(pos);
        },
      },
      pickingService: {
        boxPickLayer: () => {
          calls.boxPick++;
        },
      },
    },
    getLayerConfig: () => config,
    eventNames: () => eventNames,
    isVisible: () => visible,
    updateLayerConfig: (patch) => {
      Object.assign(config, patch);
      calls.update.push(patch);
    },
    hooks: {
      beforeHighlight: {
        call: (arg) => {
          calls.highlightCallArgs.push(arg);
          return Promise.resolve();
        },
      },
      beforeSelect: {
        call: (arg) => {
          calls.selectCallArgs.push(arg);
          return Promise.resolve();
        },
      },
    },
    // 测试辅助（非 delegate 依赖面）
    setEventNames: (n: string[]) => {
      eventNames = n;
    },
    setVisible: (v: boolean) => {
      visible = v;
    },
  } as MockHandle;
}

function bind(layer: MockHandle, rerender: () => void): LayerPickingManager {
  return new LayerPickingManager(layer as unknown as BaseLayer, rerender);
}

describe('picking-manager delegate (stage-6 6.1)', () => {
  describe('pick / boxSelect forward', () => {
    it('pick({x,y}) → interactionService.triggerHover 透传', () => {
      const layer = makeLayer();
      const s = bind(layer, () => {});
      s.pick({ x: 10, y: 20 });
      expect(layer.calls.triggerHover).toEqual([{ x: 10, y: 20 }]);
    });

    it('boxSelect(box, cb) → pickingService.boxPickLayer 透传', () => {
      const layer = makeLayer();
      const s = bind(layer, () => {});
      const cb = () => {};
      s.boxSelect([0, 0, 10, 10] as [number, number, number, number], cb);
      expect(layer.calls.boxPick).toBe(1);
    });
  });

  describe('pickId / selectedId 状态', () => {
    it('setCurrentPickId/getCurrentPickId 读写（默认 null）', () => {
      const s = bind(makeLayer(), () => {});
      expect(s.getCurrentPickId()).toBeNull();
      s.setCurrentPickId(7);
      expect(s.getCurrentPickId()).toBe(7);
    });

    it('setCurrentSelectedId/getCurrentSelectedId 读写（默认 null）', () => {
      const s = bind(makeLayer(), () => {});
      expect(s.getCurrentSelectedId()).toBeNull();
      s.setCurrentSelectedId(3);
      expect(s.getCurrentSelectedId()).toBe(3);
    });
  });

  describe('needPick 合成规则', () => {
    it('isVisible=false → 短路 false', () => {
      const layer = makeLayer();
      layer.setVisible(false);
      layer.setEventNames(['click']);
      const s = bind(layer, () => {});
      expect(s.needPick('click')).toBe(false);
    });

    it('eventNames 含 type → true（visible）', () => {
      const layer = makeLayer();
      layer.setEventNames(['click']);
      const s = bind(layer, () => {});
      expect(s.needPick('click')).toBe(true);
    });

    it('eventNames 含 un+type → true', () => {
      const layer = makeLayer();
      layer.setEventNames(['unclick']);
      const s = bind(layer, () => {});
      expect(s.needPick('click')).toBe(true);
    });

    it('click 不在 eventNames + enableSelect=true → true', () => {
      const layer = makeLayer({ enableSelect: true });
      layer.setEventNames([]);
      const s = bind(layer, () => {});
      expect(s.needPick('click')).toBe(true);
    });

    it('click + enableSelect=false + 不在 eventNames → false', () => {
      const layer = makeLayer({ enableSelect: false });
      layer.setEventNames([]);
      const s = bind(layer, () => {});
      expect(s.needPick('click')).toBe(false);
    });

    it('mousemove + enableHighlight=true → true（即使不在 eventNames）', () => {
      const layer = makeLayer({ enableHighlight: true });
      layer.setEventNames([]);
      const s = bind(layer, () => {});
      expect(s.needPick('mousemove')).toBe(true);
    });

    it('mousemove + enableHighlight=false + 无 mouseenter/unmousemove/mouseout → false', () => {
      const layer = makeLayer({ enableHighlight: false });
      layer.setEventNames([]);
      const s = bind(layer, () => {});
      expect(s.needPick('mousemove')).toBe(false);
    });

    it('mousemove + enableHighlight=false + eventNames 含 mouseenter → true', () => {
      const layer = makeLayer({ enableHighlight: false });
      layer.setEventNames(['mouseenter']);
      const s = bind(layer, () => {});
      expect(s.needPick('mousemove')).toBe(true);
    });
  });

  describe('active / select 配置派生', () => {
    it('active(true) → enableHighlight=true，返回 layer（链式）', () => {
      const layer = makeLayer();
      const s = bind(layer, () => {});
      const ret = s.active(true);
      expect(ret).toBe(layer);
      expect(layer.calls.update).toContainEqual({ enableHighlight: true });
    });

    it('active(false) → enableHighlight=false', () => {
      const layer = makeLayer();
      const s = bind(layer, () => {});
      s.active(false);
      expect(layer.calls.update).toContainEqual({ enableHighlight: false });
    });

    it('active({color,mix}) → enableHighlight=true + highlightColor + activeMix', () => {
      const layer = makeLayer();
      const s = bind(layer, () => {});
      s.active({ color: '#abc', mix: 0.5 });
      expect(layer.calls.update).toContainEqual({
        enableHighlight: true,
        highlightColor: '#abc',
        activeMix: 0.5,
      });
    });

    it('active({}) → 仅 enableHighlight=true', () => {
      const layer = makeLayer();
      const s = bind(layer, () => {});
      s.active({});
      expect(layer.calls.update).toContainEqual({ enableHighlight: true });
    });

    it('select(boolean) → enableSelect 派生同 active 模式', () => {
      const layer = makeLayer();
      const s = bind(layer, () => {});
      s.select(false);
      expect(layer.calls.update).toContainEqual({ enableSelect: false });
    });

    it('select({color,mix}) → enableSelect=true + selectColor + selectMix', () => {
      const layer = makeLayer();
      const s = bind(layer, () => {});
      s.select({ color: '#xyz', mix: 0.3 });
      expect(layer.calls.update).toContainEqual({
        enableSelect: true,
        selectColor: '#xyz',
        selectMix: 0.3,
      });
    });
  });

  describe('setActive / setSelect 双分支 + 1ms 延迟 quirk', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.useRealTimers();
    });

    it('setActive({x,y}) → updateLayerConfig(color/mix 来自 options) + pick({x,y})，不调 hook', () => {
      const layer = makeLayer({ highlightColor: 'default', activeMix: 9 });
      const rerender = jest.fn();
      const s = bind(layer, rerender);
      s.setActive({ x: 5, y: 6 }, { color: '#opt', mix: 0.7 });
      expect(layer.calls.update).toContainEqual({ highlightColor: '#opt', activeMix: 0.7 });
      expect(layer.calls.triggerHover).toEqual([{ x: 5, y: 6 }]);
      expect(layer.calls.highlightCallArgs).toHaveLength(0); // object 分支不调 hook
      expect(rerender).not.toHaveBeenCalled();
    });

    it('setActive(number) → updateLayerConfig({pickedFeatureID, color/mix 来自 getLayerConfig}) + hook.call(encodePickingColor(id)) + 1ms 后 rerender', async () => {
      const layer = makeLayer({ highlightColor: 'cfgHC', activeMix: 8 });
      const rerender = jest.fn();
      const s = bind(layer, rerender);
      s.setActive(5);
      expect(layer.calls.update).toContainEqual({
        pickedFeatureID: 5,
        highlightColor: 'cfgHC',
        activeMix: 8,
      });
      expect(layer.calls.highlightCallArgs).toEqual([encodePickingColor(5)]);
      expect(rerender).not.toHaveBeenCalled(); // setTimeout 未到
      await Promise.resolve(); // flush .then 微任务 → 注册 setTimeout
      expect(rerender).not.toHaveBeenCalled(); // 仍未到
      jest.advanceTimersByTime(1);
      expect(rerender).toHaveBeenCalledTimes(1); // 1ms quirk
    });

    it('setSelect({x,y}) → updateLayerConfig(selectColor/selectMix 来自 options) + pick', () => {
      const layer = makeLayer({ selectColor: 'def', selectMix: 1 });
      const rerender = jest.fn();
      const s = bind(layer, rerender);
      s.setSelect({ x: 1, y: 2 }, { color: '#s', mix: 0.4 });
      expect(layer.calls.update).toContainEqual({ selectColor: '#s', selectMix: 0.4 });
      expect(layer.calls.triggerHover).toEqual([{ x: 1, y: 2 }]);
      expect(layer.calls.selectCallArgs).toHaveLength(0);
    });

    it('setSelect(number) → hook.beforeSelect.call(encodePickingColor(id)) + 1ms 后 rerender', async () => {
      const layer = makeLayer({ selectColor: 'cfgSC', selectMix: 2 });
      const rerender = jest.fn();
      const s = bind(layer, rerender);
      s.setSelect(9);
      expect(layer.calls.update).toContainEqual({
        pickedFeatureID: 9,
        selectColor: 'cfgSC',
        selectMix: 2,
      });
      expect(layer.calls.selectCallArgs).toEqual([encodePickingColor(9)]);
      await Promise.resolve();
      jest.advanceTimersByTime(1);
      expect(rerender).toHaveBeenCalledTimes(1);
    });
  });
});
