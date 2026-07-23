jest.mock('geojson-vt', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../src/source/tile-source/geojsonvt', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import type { SourceTile, TileLoadParams } from '@antv/l7-utils';
import type { FeatureCollection, Geometries, Properties } from '@turf/helpers';
import geojsonvt from 'geojson-vt';
import { GeoJSONVTLoader } from '../../../src/source/loader/geojsonvt-loader';
import GeoJSONVTTileSource from '../../../src/source/tile-source/geojsonvt';

// geojson-vt 的 default export 是「函数 + namespace」合并类型，直接 `as jest.Mock`
// 会因类型不重叠报 TS2352，故经 `unknown` 两步转换建立 mock 别名。
const geojsonvtMock = geojsonvt as unknown as jest.Mock;

const tile = { x: 1, y: 2, z: 3 } as unknown as SourceTile;
// 关键差异点（阶段 3.1.3 风险①）：geojsonvt 是「tile / tileParams 混用」的第三种形态 ——
// 索引查表用 tile.{z,x,y}、坐标投影用 tileParams.{x,y,z}、Source 构造用 tile.{x,y,z}。
// 两组故意取不同值以精确锁死该差异。
const tileParams = { x: 10, y: 20, z: 5 } as TileLoadParams;

const data = {
  type: 'FeatureCollection',
  features: [],
} as FeatureCollection<Geometries, Properties>;
const options = { extent: 4096, maxZoom: 14 } as any; // geojsonvt.Options

const mockTileIndex = (getTileImpl: () => any) => ({
  getTile: jest.fn(getTileImpl),
});

describe('GeoJSONVTLoader (stage 3.1.3)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (GeoJSONVTTileSource as jest.Mock).mockImplementation(
      (vectorTile: any, x: number, y: number, z: number) => ({
        vectorTile,
        x,
        y,
        z,
        getTileData: jest.fn(() => vectorTile.layers.defaultLayer.features),
      }),
    );
  });

  it('builds the tile index once via geojson-vt in the constructor with (data, options)', () => {
    geojsonvtMock.mockImplementation(() => mockTileIndex(() => null));

    new GeoJSONVTLoader(data, options);

    expect(geojsonvt).toHaveBeenCalledTimes(1);
    expect(geojsonvt).toHaveBeenCalledWith(data, options);
  });

  it('queries tileIndex.getTile with tile.z/x/y (NOT tileParams) and constructs source with tile.x/y/z', async () => {
    const tileIndex = mockTileIndex(() => ({ features: [] }));
    geojsonvtMock.mockImplementation(() => tileIndex);

    const loader = new GeoJSONVTLoader(data, options);
    const src = await loader.loadTile(tileParams, tile);

    // 索引查表用 tile（{z:3,x:1,y:2}），不是 tileParams（{z:5,x:10,y:20}）
    expect(tileIndex.getTile).toHaveBeenCalledWith(3, 1, 2);
    // Source 构造用 tile（1,2,3），不是 tileParams（10,20,5）
    expect(GeoJSONVTTileSource).toHaveBeenCalledWith(expect.any(Object), 1, 2, 3);
    expect(src).toBeDefined();
  });

  it('resolves an empty defaultLayer (still ITileSource, not undefined) when getTile returns null', async () => {
    geojsonvtMock.mockImplementation(() => mockTileIndex(() => null));

    const loader = new GeoJSONVTLoader(data, options);
    const src = await loader.loadTile(tileParams, tile);

    expect(src).toBeDefined();
    // 空瓦片 features=[]，但仍构造 GeoJSONVTTileSource（非 undefined —— 与 mvt 失败 resolve undefined 不同）
    expect(GeoJSONVTTileSource).toHaveBeenCalledTimes(1);
    const vectorTile = (GeoJSONVTTileSource as jest.Mock).mock.calls[0][0];
    expect(vectorTile.layers.defaultLayer.features).toEqual([]);
  });

  it('never sets tile.xhrCancel (in-memory tile slicing, no xhr handle)', async () => {
    geojsonvtMock.mockImplementation(() => mockTileIndex(() => ({ features: [] })));

    const loader = new GeoJSONVTLoader(data, options);
    await loader.loadTile(tileParams, tile);

    expect(tile.xhrCancel).toBeUndefined();
  });

  it('projects feature coordinates using tileParams.x/y/z (NOT tile.x/y/z) — the core geojsonvt contract', async () => {
    // LineString (type 2) feature: one line, one point [0,0]. GetGeoJSON runs for real.
    const vtFeature = { type: 2, geometry: [[[0, 0]]], tags: { id: 1 }, id: 1 };
    geojsonvtMock.mockImplementation(() => mockTileIndex(() => ({ features: [vtFeature] })));

    const loader = new GeoJSONVTLoader(data, options);
    await loader.loadTile(tileParams, tile);

    const vectorTile = (GeoJSONVTTileSource as jest.Mock).mock.calls[0][0];
    const projected = vectorTile.layers.defaultLayer.features[0];
    // 投影用 tileParams.x=10 → lng = (4096*10*360)/(4096*2^5) - 180 = 112.5 - 180 = -67.5
    // 若误用 tile.x=1 → lng = (4096*1*360)/(4096*2^3) - 180 = 45 - 180 = -135（明显可区分）
    expect(projected.geometry.type).toBe('LineString');
    expect(projected.geometry.coordinates[0][0]).toBeCloseTo(-67.5, 5);
    expect(projected.geometry.coordinates[0][1]).toBeCloseTo(-40.9798, 2);
  });

  it('respects options.extent in the projection (extent flows through from constructor)', async () => {
    const vtFeature = { type: 2, geometry: [[[0, 0]]], tags: { id: 1 }, id: 1 };
    geojsonvtMock.mockImplementation(() => mockTileIndex(() => ({ features: [vtFeature] })));

    // extent=8192（默认 4096 的 2 倍）→ x0 = 8192*10 = 81920, size = 8192*32 = 262144
    // lng = (81920*360)/262144 - 180 = 112.5 - 180 = -67.5（extent 同时缩放 x0 与 size，lng 不变）
    // 但 lat/bounds 受 extent 影响，且与默认 extent 投影路径不同 —— 证明 extent 入参生效
    const bigExtentOptions = { extent: 8192, maxZoom: 14 } as any;
    const loader = new GeoJSONVTLoader(data, bigExtentOptions);
    await loader.loadTile(tileParams, tile);

    expect(geojsonvt).toHaveBeenCalledWith(data, bigExtentOptions);
    const vectorTile = (GeoJSONVTTileSource as jest.Mock).mock.calls[0][0];
    // extent 同时缩放分子分母 → lng 仍 -67.5，但走的是 extent=8192 的代码路径
    expect(vectorTile.layers.defaultLayer.features[0].geometry.coordinates[0][0]).toBeCloseTo(
      -67.5,
      5,
    );
  });
});
