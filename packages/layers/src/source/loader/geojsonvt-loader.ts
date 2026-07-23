import type { SourceTile, TileLoadParams } from '@antv/l7-utils';
import type { FeatureCollection, Geometries, Properties } from '@turf/helpers';
import geojsonvt from 'geojson-vt';
import type { ITileSource, MapboxVectorTile } from '../interface';
import GeoJSONVTTileSource from '../tile-source/geojsonvt';
import type { TileLoader } from './tile-loader';

/**
 * geojsonvt 瓦片加载器（阶段 3.1.3，阶段 3.1 收尾）。
 *
 * 与 mvt / jsonTile 的关键区别：geojsonvt 是**内存切瓦片**而非网络 fetch ——
 * 构造期用 `geojson-vt` 从原始 FeatureCollection 一次性建好空间索引
 * `tileIndex`，`loadTile` 走 `tileIndex.getTile(z, x, y)` 同步切瓦片 + 在内存
 * 里把矢量瓦片特征投影回 GeoJSON 坐标。故：
 * - **无 `getCustomData` 分支**（mvt/jsonTile 有，geojsonvt 没有）；
 * - **无 `tile.xhrCancel` 取消语义**（全同步，无 xhr 句柄，与 jsonTile 等价、
 *   与 mvt 不同 —— 不设 xhrCancel）；
 * - **始终 resolve `ITileSource`**（`getTile` 返回 null 时 features=[] 的空
 *   defaultLayer，与 jsonTile 同形态；`undefined` 是合法但不使用的值）。
 *
 * ⚠️ **tile 与 tileParams 混用是 geojsonvt 的核心契约**（第三种形态，与 mvt/
 *   jsonTile 都不同）：
 * - `tileIndex.getTile(tile.z, tile.x, tile.y)` —— **用 `tile`**（SourceTile）做索引查表；
 * - `GetGeoJSON(extent, tileParams.x, tileParams.y, tileParams.z, ...)` —— **用
 *   `tileParams`**（TileLoadParams）做坐标投影（x0 = extent * tileParams.x 等）；
 * - `new GeoJSONVTTileSource(vectorTile, tile.x, tile.y, tile.z)` —— **用 `tile`** 做数据源构造。
 * 此差异必须原样保留，不可「统一」成单一参数源 —— `tileParams` 与 `tile` 在
 * TilesetManager 运行时可能含 zoom-offset 等调整，投影用 tileParams、索引用 tile
 * 是迁移前既有行为。
 *
 * 投影助手（`signedArea` / `classifyRings` / `GetGeoJSON` / `VectorTileFeatureTypes`）
 * 仅服务 `loadTile`，随 `getVectorTile` 闭包一并下沉到本 loader。`getOption`
 * （默认选项合并）留在 parser 作「config 形状组装」。
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 3.1.3
 */
const VectorTileFeatureTypes = ['Unknown', 'Point', 'LineString', 'Polygon'];

function signedArea(ring: any[]) {
  let sum = 0;
  for (let i = 0, len = ring.length, j = len - 1, p1, p2; i < len; j = i++) {
    p1 = ring[i];
    p2 = ring[j];
    sum += (p2.x - p1.x) * (p1.y + p2.y);
  }
  return sum;
}

function classifyRings(rings: any[]) {
  const len = rings.length;

  if (len <= 1) {
    return [rings];
  }

  const polygons: any = [];
  let polygon: any;
  let ccw;

  for (let i = 0; i < len; i++) {
    const area = signedArea(rings[i]);
    if (area === 0) {
      continue;
    }

    if (ccw === undefined) {
      ccw = area < 0;
    }

    if (ccw === area < 0) {
      if (polygon) {
        polygons.push(polygon);
      }
      polygon = [rings[i]];
    } else {
      polygon.push(rings[i]);
    }
  }
  if (polygon) {
    polygons.push(polygon);
  }

  return polygons;
}

function GetGeoJSON(extent: number, x: number, y: number, z: number, vectorTileFeature: any) {
  let coords = vectorTileFeature.geometry as any;
  const currenType = vectorTileFeature.type;

  const currentProperties = vectorTileFeature.tags;
  const currentId = vectorTileFeature.id;

  const size = extent * Math.pow(2, z);
  const x0 = extent * x;
  const y0 = extent * y;

  let type = VectorTileFeatureTypes[currenType];
  let i;
  let j;

  function project(line: any[]) {
    for (let index = 0; index < line.length; index++) {
      const p = line[index];
      if (p[3]) {
        // 避免重复计算
        break;
      }
      const y2 = 180 - ((p[1] + y0) * 360) / size;
      const lng = ((p[0] + x0) * 360) / size - 180;
      const lat = (360 / Math.PI) * Math.atan(Math.exp((y2 * Math.PI) / 180)) - 90;
      line[index] = [lng, lat, 0, 1];
    }
  }

  switch (currenType) {
    case 1:
      const points = [];
      for (i = 0; i < coords.length; i++) {
        points[i] = coords[i][0];
      }
      coords = points;
      project(coords);
      break;

    case 2:
      for (i = 0; i < coords.length; i++) {
        project(coords[i]);
      }
      break;

    case 3:
      coords = classifyRings(coords);
      for (i = 0; i < coords.length; i++) {
        for (j = 0; j < coords[i].length; j++) {
          project(coords[i][j]);
        }
      }
      break;
  }

  if (coords.length === 1) {
    coords = coords[0];
  } else {
    type = 'Multi' + type;
  }

  const result = {
    type: 'Feature',
    geometry: {
      type,
      coordinates: coords,
    },
    properties: currentProperties,
    id: currentId,
    relativeOrigin: [0, 0],
    coord: '',
  };

  return result;
}

export class GeoJSONVTLoader implements TileLoader {
  private readonly tileIndex: ReturnType<typeof geojsonvt>;
  private readonly extent: number;

  constructor(data: FeatureCollection<Geometries, Properties>, options: geojsonvt.Options) {
    this.tileIndex = geojsonvt(data, options);
    this.extent = options.extent || 4096;
  }

  public loadTile(tileParams: TileLoadParams, tile: SourceTile): Promise<ITileSource> {
    return new Promise((resolve) => {
      const tileData = this.tileIndex.getTile(tile.z, tile.x, tile.y);
      const features = tileData
        ? tileData.features.map((vectorTileFeature: any) => {
            return GetGeoJSON(
              this.extent,
              tileParams.x,
              tileParams.y,
              tileParams.z,
              vectorTileFeature,
            );
          })
        : [];

      const vectorTile: MapboxVectorTile = {
        layers: {
          defaultLayer: {
            // @ts-ignore GetGeoJSON 产出的 feature 含 relativeOrigin/coord 额外字段，
            // 与 interface MapboxVectorTile.layers[k].features: GeoJSON.Feature[] 不完全匹配
            features,
          },
        },
      };
      const vectorSource = new GeoJSONVTTileSource(vectorTile, tile.x, tile.y, tile.z);
      resolve(vectorSource);
    });
  }
}
