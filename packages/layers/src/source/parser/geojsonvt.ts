import type { IGeojsonvtOptions, ITileParserCFG } from '@antv/l7-core';
import type { SourceTile, TileLoadParams, TilesetManagerOptions } from '@antv/l7-utils';
import type { FeatureCollection, Geometries, Properties } from '@turf/helpers';
import type geojsonvt from 'geojson-vt';
import type { IParserData } from '../interface';
import { GeoJSONVTLoader } from '../loader/geojsonvt-loader';

/**
 * geojsonvt parser（阶段 3.1.3：getVectorTile 闭包 + 投影助手下沉
 * `GeoJSONVTLoader`，阶段 3.1 收尾）。
 *
 * parser 只负责「config 形状组装 + 委托 loader」—— `getOption` 把
 * `ITileParserCFG.geojsonvtOptions` 与默认选项合并（maxZoom/tolerance/
 * extent/buffer 等 geojson-vt 索引建表参数），`GeoJSONVTLoader` 构造期
 * `geojsonvt(data, options)` 内存建索引、`loadTile` 内存切瓦片 + 投影。
 * 行为与迁移前等价：
 * - `DEFAULT_CONFIG` 保留 **不含 `warp`**（与 mvt 不同，geojsonvt 原本就没有）；
 * - `getTileData(tileParams, tile)` 透传两者给 loader（loader 内 tile 用于
 *   索引查表、tileParams 用于坐标投影 —— 第三种形态，见 loader JSDoc）；
 * - loader 始终 resolve `ITileSource`，无 `tile.xhrCancel`。
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 3.1.3
 */
const DEFAULT_CONFIG: Partial<TilesetManagerOptions> = {
  tileSize: 256,
  minZoom: 0,
  maxZoom: Infinity,
  zoomOffset: 0,
};

function getOption(cfg?: ITileParserCFG) {
  const defaultOptions = {
    // geojson-vt default options
    maxZoom: 14, // max zoom to preserve detail on
    indexMaxZoom: 5, // max zoom in the tile index
    indexMaxPoints: 100000, // max number of points per tile in the tile index
    tolerance: 3, // simplification tolerance (higher means simpler)
    extent: 4096, // tile extent
    buffer: 64, // tile buffer on each side
    lineMetrics: false, // whether to calculate line metrics
    promoteId: null, // name of a feature property to be promoted to feature.id
    generateId: true, // whether to generate feature ids. Cannot be used with promoteId
    debug: 0, // logging level (0, 1 or 2)
  };

  if (cfg === undefined || typeof cfg.geojsonvtOptions === 'undefined') {
    return defaultOptions;
  } else {
    return { ...defaultOptions, ...cfg.geojsonvtOptions };
  }
}

export default function geojsonVTTile(
  data: FeatureCollection<Geometries, Properties>,
  cfg: ITileParserCFG,
): IParserData {
  const geojsonOptions = getOption(cfg) as geojsonvt.Options & IGeojsonvtOptions;

  const loader = new GeoJSONVTLoader(data, geojsonOptions);
  const getTileData = (tileParams: TileLoadParams, tile: SourceTile) =>
    loader.loadTile(tileParams, tile);

  const tilesetOptions = {
    ...DEFAULT_CONFIG,
    ...cfg,
    getTileData,
  };

  return {
    data,
    dataArray: [],
    tilesetOptions,
    isTile: true,
  };
}
