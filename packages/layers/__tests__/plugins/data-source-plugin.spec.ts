import { Source } from '@antv/l7-layers';
import DataSourcePlugin from '../../src/plugins/DataSourcePlugin';

/**
 * 阶段 4.2 — DataSourcePlugin init 分支迁移到 `await source.ready`。
 *
 * 锁死三项契约：
 *   ① fresh `new Source`（构造期未 inited）→ `await source.ready` 后
 *      updateClusterData + log(SourceInitEnd) 调用（成功路径，时序与旧
 *      `'update' {type:'inited'}` 监听等价）；
 *   ② 外部预存已 inited source → fast-path（不 await ready），即便 ready 永不
 *      resolve 也不 hang（证明 fast-path 跳过 await）；
 *   ③ source init 失败 → tapPromise reject（错误 surface，对比旧路径静默 hang）。
 *
 * 不直接断言 `IDebugLog`/`ILayerStage` 枚举值（`IDebugLog` 为 const enum，
 * isolatedModules 下运行时表示不稳定），改用 `layer.log` 调用次数判分支：
 * 成功 = 2 次（SourceInitStart + SourceInitEnd），失败 = 1 次（仅 Start）。
 */

const geojsonData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [120, 30] },
      properties: { v: 1 },
    },
  ],
};

interface MockLayer {
  layer: any;
  initTap: () => Promise<void>;
}

function makeLayer(
  opts: {
    initialSource?: any;
    sourceOption?: any;
  } = {},
): MockLayer {
  let currentSource: any = opts.initialSource;
  const initTaps: Array<[string, () => Promise<void>]> = [];
  const layer: any = {
    getSource: jest.fn(() => currentSource),
    setSource: jest.fn((s: any) => {
      currentSource = s;
    }),
    sourceOption: opts.sourceOption,
    defaultSourceConfig: {},
    isTileLayer: false,
    tileLayer: undefined,
    dataState: { dataSourceNeedUpdate: false },
    clusterZoom: 0,
    log: jest.fn(),
    getContainer: jest.fn(() => ({
      mapService: { getZoom: jest.fn(() => 3) },
    })),
    hooks: {
      init: {
        tapPromise: jest.fn((name: string, cb: () => Promise<void>) => initTaps.push([name, cb])),
      },
      beforeRenderData: { tapPromise: jest.fn() },
    },
  };
  const plugin = new DataSourcePlugin();
  plugin.apply(layer);
  const initTap = initTaps.find(([n]) => n === 'DataSourcePlugin')![1];
  return { layer, initTap };
}

describe('DataSourcePlugin init (阶段 4.2: await source.ready)', () => {
  it('fresh new Source: await source.ready 后 inited===true 且 log 调用 2 次', async () => {
    const { layer, initTap } = makeLayer({
      sourceOption: { data: geojsonData, options: { parser: { type: 'geojson' } } },
    });
    await initTap();

    const source = layer.setSource.mock.calls[0][0];
    expect(source).toBeInstanceOf(Source);
    expect(source.inited).toBe(true);
    // SourceInitStart（tapPromise 入口）+ SourceInitEnd（ready 后）
    expect(layer.log).toHaveBeenCalledTimes(2);
  });

  it('预存已 inited source: fast-path 不 await ready（ready 永不 resolve 也不 hang）', async () => {
    // ready 永不 resolve；若 4.2 误走 await 分支会触发 jest 超时失败。
    const neverReady = new Promise<void>(() => {});
    const fakeInitedSource = {
      inited: true,
      ready: neverReady,
      cluster: false,
      clusterOptions: {},
      updateClusterData: jest.fn(),
    };
    const { layer, initTap } = makeLayer({ initialSource: fakeInitedSource });

    // initTap 能在超时内 resolve 即证明走了 fast-path（未 await neverReady）。
    await initTap();

    expect(fakeInitedSource.updateClusterData).not.toHaveBeenCalled();
    expect(layer.log).toHaveBeenCalledTimes(2);
  });

  it('source init 失败: tapPromise reject（错误 surface，非静默 hang）', async () => {
    const { layer, initTap } = makeLayer({
      sourceOption: { data: {}, options: { parser: { type: 'nonexistent' } } },
    });
    await expect(initTap()).rejects.toThrow();
    // 仅 SourceInitStart，SourceInitEnd 未调用（reject 前未到达）。
    expect(layer.log).toHaveBeenCalledTimes(1);
  });
});
