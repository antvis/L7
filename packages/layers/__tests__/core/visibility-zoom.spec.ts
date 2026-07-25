import type BaseLayer from '../../src/core/BaseLayer';
import LayerVisibilityZoom from '../../src/core/LayerVisibilityZoom';

/**
 * 阶段 6.1：可见性/缩放 delegate（`LayerVisibilityZoom`，阶段 1.8 抽出）独立
 * 特征化 spec。当前该 delegate 仅经 BaseLayer 子类渲染路径间接覆盖；本 spec
 * 以满足窄依赖面的 mock layer 直连 delegate，锁定其可观测契约：
 *
 *   - show/hide：updateLayerConfig({visible}) + rerender 回调 + emit('show'/'hide')
 *     + 返回 layer（链式）
 *   - setIndex：写 zIndex + layerService.updateLayerRenderList + renderLayers
 *   - setMinZoom/setMaxZoom/setAutoFit：updateLayerConfig 对应键 + 返回 layer
 *   - getMinZoom/getMaxZoom：从 getLayerConfig 读回
 *   - isVisible：`!!visible && zoom >= minZoom && zoom < maxZoom`
 *     （minZoom 含、maxZoom 不含；默认 ±Infinity）
 *   - fitBounds：未 init → 落 autoFit 标记、不调 mapService.fitBounds；
 *     init + extent 含 Infinity → 跳过；init + 有限 extent → 调
 *     mapService.fitBounds([[ext0,ext1],[ext2,ext3]], options)
 *
 * 任何后续 delegate 改动破坏 control flow / 副作用 / zoom 边界即应使本 spec 失败。
 */

interface MockLayerService {
  updateLayerRenderList: () => void;
  renderLayers: () => void;
}
interface MockMapService {
  getZoom: () => number;
  fitBounds: (bounds: number[][], options?: unknown) => void;
}

interface VisLayer extends Pick<
  BaseLayer,
  'updateLayerConfig' | 'emit' | 'getLayerConfig' | 'getSource'
> {
  zIndex: number;
  inited: boolean;
  container: { layerService: MockLayerService; mapService: MockMapService };
}

interface CallLog {
  update: Array<Record<string, unknown>>;
  emit: string[];
  rerender: number;
  updateLayerRenderList: number;
  renderLayers: number;
  fitBounds: number;
  fitBoundsArgs: Array<{ bounds: number[][]; options?: unknown }>;
}

interface MockHandle extends VisLayer {
  calls: CallLog;
  source: { extent: number[] };
  setZoom: (v: number) => void;
}

function makeLayer(opts: {
  visible?: boolean;
  minZoom?: number;
  maxZoom?: number;
  zoom?: number;
  inited?: boolean;
  extent?: number[];
}): MockHandle {
  const cfg: Record<string, unknown> = {
    visible: opts.visible ?? false,
    minZoom: opts.minZoom,
    maxZoom: opts.maxZoom,
  };
  const source = { extent: opts.extent ?? [0, 0, 1, 1] };
  let zoom = opts.zoom ?? 0;
  const calls: CallLog = {
    update: [],
    emit: [],
    rerender: 0,
    updateLayerRenderList: 0,
    renderLayers: 0,
    fitBounds: 0,
    fitBoundsArgs: [],
  };
  const layer: MockHandle = {
    calls,
    source,
    zIndex: 0,
    inited: opts.inited ?? false,
    setZoom: (v: number) => {
      zoom = v;
    },
    getLayerConfig: () => cfg,
    updateLayerConfig: (patch: Record<string, unknown>) => {
      Object.assign(cfg, patch);
      calls.update.push(patch);
    },
    emit: (type: string) => {
      calls.emit.push(type);
    },
    getSource: () => source,
    container: {
      layerService: {
        updateLayerRenderList: () => {
          calls.updateLayerRenderList++;
        },
        renderLayers: () => {
          calls.renderLayers++;
        },
      },
      mapService: {
        getZoom: () => zoom,
        fitBounds: (bounds: number[][], options?: unknown) => {
          calls.fitBounds++;
          calls.fitBoundsArgs.push({ bounds, options });
        },
      },
    },
  };
  return layer;
}

describe('visibility-zoom delegate (stage-6 6.1)', () => {
  it('show：visible=true + rerender + emit("show") + 返回 layer', () => {
    const layer = makeLayer({ visible: false });
    const s = new LayerVisibilityZoom(layer, () => {
      layer.calls.rerender++;
    });
    const ret = s.show();
    expect(ret).toBe(layer);
    expect(layer.calls.update).toContainEqual({ visible: true });
    expect(layer.calls.rerender).toBe(1);
    expect(layer.calls.emit).toEqual(['show']);
  });

  it('hide：visible=false + rerender + emit("hide") + 返回 layer', () => {
    const layer = makeLayer({ visible: true });
    const s = new LayerVisibilityZoom(layer, () => {
      layer.calls.rerender++;
    });
    const ret = s.hide();
    expect(ret).toBe(layer);
    expect(layer.calls.update).toContainEqual({ visible: false });
    expect(layer.calls.rerender).toBe(1);
    expect(layer.calls.emit).toEqual(['hide']);
  });

  it('setIndex：写 zIndex + updateLayerRenderList + renderLayers + 返回 layer', () => {
    const layer = makeLayer({});
    const s = new LayerVisibilityZoom(layer, () => {});
    const ret = s.setIndex(7);
    expect(ret).toBe(layer);
    expect(layer.zIndex).toBe(7);
    expect(layer.calls.updateLayerRenderList).toBe(1);
    expect(layer.calls.renderLayers).toBe(1);
  });

  it('setMinZoom/setMaxZoom/setAutoFit：updateLayerConfig 对应键 + 返回 layer', () => {
    const layer = makeLayer({});
    const s = new LayerVisibilityZoom(layer, () => {});
    expect(s.setMinZoom(3)).toBe(layer);
    expect(s.setMaxZoom(15)).toBe(layer);
    expect(s.setAutoFit(true)).toBe(layer);
    expect(layer.calls.update).toContainEqual({ minZoom: 3 });
    expect(layer.calls.update).toContainEqual({ maxZoom: 15 });
    expect(layer.calls.update).toContainEqual({ autoFit: true });
  });

  it('getMinZoom/getMaxZoom：从 getLayerConfig 读回', () => {
    const layer = makeLayer({ minZoom: 2, maxZoom: 12 });
    const s = new LayerVisibilityZoom(layer, () => {});
    expect(s.getMinZoom()).toBe(2);
    expect(s.getMaxZoom()).toBe(12);
  });

  it('isVisible：visible=false → false（短路）', () => {
    const layer = makeLayer({ visible: false, zoom: 5 });
    const s = new LayerVisibilityZoom(layer, () => {});
    expect(s.isVisible()).toBe(false);
  });

  it('isVisible：visible=true + zoom 在 [min,max) → true（min 含 max 不含）', () => {
    const layer = makeLayer({ visible: true, minZoom: 2, maxZoom: 10, zoom: 5 });
    const s = new LayerVisibilityZoom(layer, () => {});
    expect(s.isVisible()).toBe(true);
  });

  it('isVisible：边界 zoom==minZoom 含入（true），zoom==maxZoom 排除（false）', () => {
    const s2 = new LayerVisibilityZoom(
      makeLayer({ visible: true, minZoom: 2, maxZoom: 10, zoom: 2 }),
      () => {},
    );
    expect(s2.isVisible()).toBe(true); // 含下界
    const s10 = new LayerVisibilityZoom(
      makeLayer({ visible: true, minZoom: 2, maxZoom: 10, zoom: 10 }),
      () => {},
    );
    expect(s10.isVisible()).toBe(false); // 不含上界
  });

  it('isVisible：未设 min/max 默认 ±Infinity（visible 即可见）', () => {
    const layer = makeLayer({ visible: true, zoom: 999 });
    const s = new LayerVisibilityZoom(layer, () => {});
    expect(s.isVisible()).toBe(true);
  });

  it('fitBounds：未 init → 落 autoFit 标记、不调 mapService.fitBounds', () => {
    const layer = makeLayer({ inited: false, extent: [0, 0, 10, 10] });
    const s = new LayerVisibilityZoom(layer, () => {});
    const ret = s.fitBounds({ padding: 5 });
    expect(ret).toBe(layer);
    expect(layer.calls.update).toContainEqual({ autoFit: true });
    expect(layer.calls.fitBounds).toBe(0);
  });

  it('fitBounds：init + extent 含 Infinity → 跳过 fitBounds（不调 autoFit）', () => {
    const layer = makeLayer({ inited: true, extent: [Infinity, 0, 10, 10] });
    const s = new LayerVisibilityZoom(layer, () => {});
    const ret = s.fitBounds();
    expect(ret).toBe(layer);
    expect(layer.calls.fitBounds).toBe(0);
    expect(layer.calls.update).not.toContainEqual({ autoFit: true });
  });

  it('fitBounds：init + 有限 extent → 调 mapService.fitBounds 透传 bounds/options', () => {
    const layer = makeLayer({ inited: true, extent: [100, 40, 110, 50] });
    const s = new LayerVisibilityZoom(layer, () => {});
    const ret = s.fitBounds({ padding: 2 });
    expect(ret).toBe(layer);
    expect(layer.calls.fitBounds).toBe(1);
    expect(layer.calls.fitBoundsArgs[0]).toEqual({
      bounds: [
        [100, 40],
        [110, 50],
      ],
      options: { padding: 2 },
    });
  });
});
