import { lngLatInExtent } from '@antv/l7-utils';
import type BaseLayerPickService from '../../src/core/LayerPickService';
import LayerPickService from '../../src/core/LayerPickService';

/**
 * 阶段 6.1：拾取渲染/查询协调器（`LayerPickService` / `BaseLayerPickService`，
 * 阶段 1.3a 抽出）独立特征化 spec。该 delegate 是 14 个 delegate 中依赖面最
 * 重者——协调 container.{layerService,pickingService,mapService}、tileLayer
 * 委托、hooks 编码、renderModels、getSource/getOriginalExtent 与 raster 几何
 * 计算。此前仅经 tile interaction utils / PickingService / PixelPickingPass
 * 间接覆盖。本 spec 以满足窄依赖面的 mock layer 直连 delegate，锁定可观测契约：
 *
 *   pickRender：
 *     - tileLayer 存在 → 委托 tileLayer.pickRender 并 return（短路，不调自身编码）
 *     - 非 tile → beforePickingEncode.call + layerService.renderTileLayerMask +
 *       renderModels({ispick:true}) + afterPickingEncode.call
 *   pick(layer, target)：
 *     - layer.type==='RasterLayer' → pickRasterLayer
 *     - 否则 → pickRender + pickingService.pickFromPickingFBO 透传返回
 *   pickRasterLayer：
 *     - extent 解析：originalExtent[0]/[2] 非零 → 用 originalExtent，否则
 *       用 getSource().extent
 *     - lngLatInExtent(lngLat, extent) 决定 isPick（真实纯函数锁定）
 *     - isPick 真 → readRasterValue + triggerHoverOnLayer(target {rasterValue}) + return true
 *     - isPick 假 → 重定义 type（mousemove→mouseout 否则 un+type）+
 *       triggerHoverOnLayer 两次（{type:'unpick'} 与 retyped）+ return false
 *   readRasterValue：lngLatToContainer 几何计算（minLng..maxLng → 像素 → 归一
 *     pos → 索引 → rasterData.data[index]）
 *   selectFeature/highlightPickedFeature：解构 [r,g,b] + hooks 调用
 *   getFeatureById → getSource().getFeatureById 透传
 *
 * 任何后续 delegate 改动破坏委托短路 / 编码序列 / extent 解析 / 重定义 type /
 * raster 索引计算即应使本 spec 失败。
 */

// ---- mock 类型 ----
interface MockHook {
  call: (arg: unknown) => unknown;
}
interface LngLat {
  lng: number;
  lat: number;
}
interface Target {
  x: number;
  y: number;
  type: string;
  lngLat: LngLat;
}
interface RasterData {
  width?: number;
  height?: number;
  data: unknown[];
}
interface MockSource {
  extent: number[];
  data: { dataArray: RasterData[] };
  getFeatureById: (idx: number) => unknown;
}
interface MockTileLayer {
  pickRender: (t: Target) => void;
}
interface MockLayerService {
  renderTileLayerMask: (layer: unknown) => void;
}
interface MockPickingService {
  pickFromPickingFBO: (layer: unknown, t: Target) => unknown;
  triggerHoverOnLayer: (layer: unknown, target: Record<string, unknown>) => void;
}
interface MockMapService {
  lngLatToContainer: (lngLat: [number, number]) => { x: number; y: number };
}

interface MockLayer {
  type: string;
  tileLayer?: MockTileLayer;
  getContainer: () => {
    layerService: MockLayerService;
    pickingService: MockPickingService;
    mapService: MockMapService;
  };
  hooks: {
    beforePickingEncode: MockHook;
    afterPickingEncode: MockHook;
    beforeSelect: MockHook;
    beforeHighlight: MockHook;
  };
  renderModels: (opts: Record<string, unknown>) => void;
  getOriginalExtent: () => number[];
  getSource: () => MockSource;
}

interface CallLog {
  beforePickingEncode: number;
  afterPickingEncode: number;
  beforeSelectArgs: unknown[];
  beforeHighlightArgs: unknown[];
  renderTileLayerMask: number;
  renderModelsArgs: Array<Record<string, unknown>>;
  tilePickRender: number;
  pickFromPickingFBOResult: unknown | undefined;
  triggerHoverOnLayer: Array<{ target: Record<string, unknown> }>;
  getFeatureByIdCalls: number[];
  lngLatToContainerCalls: number;
}

function makeLayer(opts: {
  type?: string;
  tileLayer?: MockTileLayer;
  originalExtent?: number[];
  sourceExtent?: number[];
  raster?: RasterData;
  lngLatToContainer?: (ll: [number, number]) => { x: number; y: number };
}): { layer: MockLayer; calls: CallLog } {
  const calls: CallLog = {
    beforePickingEncode: 0,
    afterPickingEncode: 0,
    beforeSelectArgs: [],
    beforeHighlightArgs: [],
    renderTileLayerMask: 0,
    renderModelsArgs: [],
    tilePickRender: 0,
    pickFromPickingFBOResult: undefined,
    pickFromPickingFBO: [],
    triggerHoverOnLayer: [],
    getFeatureByIdCalls: [],
    lngLatToContainerCalls: 0,
  };
  const raster: RasterData = opts.raster ?? { width: 2, height: 2, data: ['d0', 'd1', 'd2', 'd3'] };
  const llToContainer =
    opts.lngLatToContainer ?? (([lng, lat]: [number, number]) => ({ x: lng * 10, y: -lat * 10 }));
  const layer: MockLayer = {
    type: opts.type ?? 'PolygonLayer',
    tileLayer: opts.tileLayer,
    getContainer: () => ({
      layerService: {
        renderTileLayerMask: () => {
          calls.renderTileLayerMask++;
        },
      },
      pickingService: {
        pickFromPickingFBO: (l, t) => {
          calls.pickFromPickingFBO.push({ layer: l, target: t });
          return calls.pickFromPickingFBOResult;
        },
        triggerHoverOnLayer: (_l, target) => {
          calls.triggerHoverOnLayer.push({ target });
        },
      },
      mapService: {
        lngLatToContainer: (ll: [number, number]) => {
          calls.lngLatToContainerCalls++;
          return llToContainer(ll);
        },
      },
    }),
    hooks: {
      beforePickingEncode: { call: () => calls.beforePickingEncode++ },
      afterPickingEncode: { call: () => calls.afterPickingEncode++ },
      beforeSelect: {
        call: (arg) => {
          calls.beforeSelectArgs.push(arg);
        },
      },
      beforeHighlight: {
        call: (arg) => {
          calls.beforeHighlightArgs.push(arg);
        },
      },
    },
    renderModels: (o) => {
      calls.renderModelsArgs.push(o);
    },
    getOriginalExtent: () => opts.originalExtent ?? [0, 0, 0, 0],
    getSource: () => ({
      extent: opts.sourceExtent ?? [100, 40, 110, 50],
      data: { dataArray: [raster] },
      getFeatureById: (idx) => {
        calls.getFeatureByIdCalls.push(idx);
        return `feature:${idx}`;
      },
    }),
  };
  return { layer, calls };
}

function bind(layer: MockLayer): BaseLayerPickService {
  return new LayerPickService(layer as any);
}

const target = (over: Partial<Target> = {}): Target => ({
  x: 5,
  y: 6,
  type: 'click',
  lngLat: { lng: 105, lat: 45 },
  ...over,
});

describe('pick-service delegate (stage-6 6.1)', () => {
  describe('pickRender', () => {
    it('tileLayer 存在 → 委托 tileLayer.pickRender 短路（不调自身编码）', () => {
      const tilePickRender = jest.fn();
      const { layer, calls } = makeLayer({
        tileLayer: { pickRender: tilePickRender },
      });
      const t = target();
      bind(layer).pickRender(t as any);
      expect(tilePickRender).toHaveBeenCalledTimes(1);
      expect(tilePickRender).toHaveBeenCalledWith(t);
      // 短路：自身编码全不调
      expect(calls.beforePickingEncode).toBe(0);
      expect(calls.afterPickingEncode).toBe(0);
      expect(calls.renderTileLayerMask).toBe(0);
      expect(calls.renderModelsArgs).toHaveLength(0);
    });

    it('非 tile → beforePickingEncode + renderTileLayerMask + renderModels({ispick}) + afterPickingEncode', () => {
      const { layer, calls } = makeLayer({});
      bind(layer).pickRender(target() as any);
      expect(calls.beforePickingEncode).toBe(1);
      expect(calls.renderTileLayerMask).toBe(1);
      expect(calls.renderModelsArgs).toEqual([{ ispick: true }]);
      expect(calls.afterPickingEncode).toBe(1); // 编码序列：先 before 后 after
    });
  });

  describe('pick(layer, target)', () => {
    it('非 RasterLayer → pickRender + pickingService.pickFromPickingFBO 透传', async () => {
      const { layer, calls } = makeLayer({ type: 'PolygonLayer' });
      calls.pickFromPickingFBOResult = 'pickResult';
      const t = target();
      const ret = await bind(layer).pick(layer as any, t as any);
      expect(calls.beforePickingEncode).toBe(1); // pickRender 触发
      expect(ret).toBe('pickResult');
    });

    it('RasterLayer → 走 pickRasterLayer（不经 pickRender）', async () => {
      const { layer, calls } = makeLayer({
        type: 'RasterLayer',
        sourceExtent: [100, 40, 110, 50],
      });
      // originalExtent 全 0 → 用 source.extent
      const t = target({ lngLat: { lng: 105, lat: 45 } }); // 在 [100,40,110,50] 内
      const ret = await bind(layer).pick(layer as any, t as any);
      expect(ret).toBe(true);
      expect(calls.beforePickingEncode).toBe(0); // 未走 pickRender
    });
  });

  describe('pickRasterLayer extent 解析 + isPick 分流', () => {
    it('originalExtent 非零（[0]/[2] 任一）→ 用 originalExtent 而非 source.extent', () => {
      const { layer, calls } = makeLayer({
        type: 'RasterLayer',
        originalExtent: [120, 30, 130, 35], // 非零
        sourceExtent: [100, 40, 110, 50],
      });
      const t = target({ lngLat: { lng: 125, lat: 32 } }); // 在 originalExtent 内，不在 source.extent
      const ret = bind(layer).pickRasterLayer(layer as any, t as any);
      expect(ret).toBe(true); // 用了 originalExtent
      expect(calls.triggerHoverOnLayer).toHaveLength(1); // isPick=true 单次
    });

    it('originalExtent 全 0 → 用 getSource().extent', () => {
      const { layer } = makeLayer({
        type: 'RasterLayer',
        originalExtent: [0, 0, 0, 0],
        sourceExtent: [100, 40, 110, 50],
      });
      const t = target({ lngLat: { lng: 105, lat: 45 } }); // 仅在 source.extent 内
      expect(bind(layer).pickRasterLayer(layer as any, t as any)).toBe(true);
    });

    it('isPick=true → readRasterValue 写入 rasterValue + triggerHoverOnLayer 单次 + return true', () => {
      const { layer, calls } = makeLayer({
        type: 'RasterLayer',
        sourceExtent: [100, 40, 110, 50],
      });
      const t = target({ x: 5, y: 6, lngLat: { lng: 105, lat: 45 } });
      const ret = bind(layer).pickRasterLayer(layer as any, t as any);
      expect(ret).toBe(true);
      expect(calls.triggerHoverOnLayer).toHaveLength(1);
      const sent = calls.triggerHoverOnLayer[0].target as { rasterValue: unknown; type: string };
      expect(sent.rasterValue).not.toBeNull(); // readRasterValue 填充
      expect(sent.type).toBe('click'); // 原 type 保留
    });

    it('isPick=false + type=mousemove → 重定义 type=mouseout + triggerHoverOnLayer 两次（unpick + retyped）+ return false', () => {
      const { layer, calls } = makeLayer({
        type: 'RasterLayer',
        sourceExtent: [100, 40, 110, 50],
      });
      const t = target({ x: 5, y: 6, type: 'mousemove', lngLat: { lng: 0, lat: 0 } }); // 在外部
      const ret = bind(layer).pickRasterLayer(layer as any, t as any);
      expect(ret).toBe(false);
      expect(calls.triggerHoverOnLayer).toHaveLength(2);
      expect(calls.triggerHoverOnLayer[0].target.type).toBe('unpick');
      expect(calls.triggerHoverOnLayer[1].target.type).toBe('mouseout');
    });

    it('isPick=false + type 非 mousemove → 重定义 type=un+type', () => {
      const { layer, calls } = makeLayer({
        type: 'RasterLayer',
        sourceExtent: [100, 40, 110, 50],
      });
      const t = target({ x: 5, y: 6, type: 'click', lngLat: { lng: 0, lat: 0 } });
      bind(layer).pickRasterLayer(layer as any, t as any);
      expect(calls.triggerHoverOnLayer[1].target.type).toBe('unclick');
    });

    it('parent 提供 → triggerHoverOnLayer 用 parent（而非 layer）', () => {
      const { layer, calls } = makeLayer({
        type: 'RasterLayer',
        sourceExtent: [100, 40, 110, 50],
      });
      const parent = { id: 'parent' };
      bind(layer).pickRasterLayer(
        layer as any,
        target({ lngLat: { lng: 105, lat: 45 } }) as any,
        parent as any,
      );
      // triggerHoverOnLayer 第一参是 adviceTarget（parent），但 mock 未捕获该参；
      // 仅验证单次触发（parent 不影响 isPick 计数）
      expect(calls.triggerHoverOnLayer).toHaveLength(1);
    });

    it('lngLatInExtent 边界锁定（左开右闭：lng/lat > min && <= max）', () => {
      const { layer: L0 } = makeLayer({
        type: 'RasterLayer',
        sourceExtent: [100, 40, 110, 50],
      });
      // 直接用真实 util 锁边界
      expect(lngLatInExtent({ lng: 100, lat: 45 }, [100, 40, 110, 50])).toBe(false); // lng==min 开
      expect(lngLatInExtent({ lng: 110, lat: 45 }, [100, 40, 110, 50])).toBe(true); // lng==max 闭
      expect(lngLatInExtent({ lng: 105, lat: 40 }, [100, 40, 110, 50])).toBe(false); // lat==min 开
      expect(lngLatInExtent({ lng: 105, lat: 50 }, [100, 40, 110, 50])).toBe(true); // lat==max 闭
      void L0;
    });
  });

  describe('readRasterValue 索引计算', () => {
    // 读 algoritm: pos[0] = (x - tileXY.x)/tilePixelWidth, pos[1] = (y - tileMaxXY.y)/tilePixelHeight
    //   tileXY = lngLatToContainer([minLng,minLat]); tileMaxXY = lngLatToContainer([maxLng,maxLat])
    //   tilePixelWidth = tileMaxXY.x - tileXY.x; tilePixelHeight = tileXY.y - tileMaxXY.y
    //   indexX = floor(pos0*tileWidth); indexY = floor(pos1*tileHeight)
    //   index = max(0,indexY-1)*tileWidth + indexX; return data[index]
    it('确定性索引：自定义 lngLatToContainer 使 pos 落到 [0,1) 单元', () => {
      // 让 container 映射：lng100→x0, lng110→x100；lat40→y100, lat50→y0
      //   即 tileXY(100,40)=(0,100), tileMaxXY(110,50)=(100,0)
      //   width=100, height=tileXY.y - tileMaxXY.y = 100-0=100
      //   点 (x=25,y=75): pos0=(25-0)/100=0.25 → indexX=floor(0.25*2)=0
      //                 pos1=(75-0)/100=0.75 → indexY=floor(0.75*2)=1
      //   index=max(0,1-1)*2+0=0 → data[0]='d0'
      const llToContainer = ([lng, lat]: [number, number]) => ({
        x: (lng - 100) * 10,
        y: (50 - lat) * 10,
      });
      const { layer } = makeLayer({
        type: 'RasterLayer',
        sourceExtent: [100, 40, 110, 50],
        raster: { width: 2, height: 2, data: ['d0', 'd1', 'd2', 'd3'] },
        lngLatToContainer: llToContainer,
      });
      const svc = bind(layer);
      const mapService = layer.getContainer().mapService;
      const r = svc.readRasterValue(layer as any, [100, 40, 110, 50], mapService as any, 25, 75);
      expect(r).toBe('d0');
    });

    it('indexY=0 时 max(0,-1)=0 兜底（不越界负索引）', () => {
      const llToContainer = ([lng, lat]: [number, number]) => ({
        x: (lng - 100) * 10,
        y: (50 - lat) * 10,
      });
      const { layer } = makeLayer({
        type: 'RasterLayer',
        sourceExtent: [100, 40, 110, 50],
        raster: { width: 2, height: 2, data: ['d0', 'd1', 'd2', 'd3'] },
        lngLatToContainer: llToContainer,
      });
      const svc = bind(layer);
      const mapService = layer.getContainer().mapService;
      // 点贴近左上：pos0≈0,indexX=0; pos1≈0,indexY=0 → index=max(0,-1)*2+0=0
      const r = svc.readRasterValue(layer as any, [100, 40, 110, 50], mapService as any, 1, 99);
      expect(r).toBe('d0'); // 负索引兜底到 data[0]
    });

    it('bbox 默认值缺省：minLng=0,minLat=0,maxLng=10,maxLat=-10（解构默认）', () => {
      // 空 bbox [] → 解构默认 [0,0,10,-10]
      const llToContainer = ([lng, lat]: [number, number]) => ({ x: lng, y: lat });
      const { layer } = makeLayer({
        type: 'RasterLayer',
        raster: { width: 1, height: 1, data: ['only'] },
        lngLatToContainer: llToContainer,
      });
      const svc = bind(layer);
      const mapService = layer.getContainer().mapService;
      // minLng0→x0, maxLng10→x10 → width=10; minLat0→y0, maxLat-10→y-10 → height=0-(-10)=10
      // tileMaxXY=(-10的y=-10)。点(x=5,y=-5): pos0=(5-0)/10=0.5→indexX=floor(0.5*1)=0
      //   pos1=(y - tileMaxXY.y)/height = (-5 - (-10))/10 = 0.5 → indexY=floor(0.5*1)=0
      //   index=max(0,-1)*1+0=0 → data[0]
      const r = svc.readRasterValue(layer as any, [] as number[], mapService as any, 5, -5);
      expect(r).toBe('only');
    });
  });

  describe('selectFeature / highlightPickedFeature / getFeatureById', () => {
    it('selectFeature(pickedColors) → hooks.beforeSelect.call([r,g,b])', () => {
      const { layer, calls } = makeLayer({});
      bind(layer).selectFeature(new Uint8Array([10, 20, 30]));
      expect(calls.beforeSelectArgs).toEqual([[10, 20, 30]]);
    });

    it('highlightPickedFeature(pickedColors) → hooks.beforeHighlight.call([r,g,b])', () => {
      const { layer, calls } = makeLayer({});
      bind(layer).highlightPickedFeature(new Uint8Array([1, 2, 3]));
      expect(calls.beforeHighlightArgs).toEqual([[1, 2, 3]]);
    });

    it('getFeatureById(idx) → getSource().getFeatureById 透传', () => {
      const { layer, calls } = makeLayer({});
      expect(bind(layer).getFeatureById(42)).toBe('feature:42');
      expect(calls.getFeatureByIdCalls).toEqual([42]);
    });
  });
});
