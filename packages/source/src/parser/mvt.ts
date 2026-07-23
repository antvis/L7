import type { ITileParserCFG } from '@antv/l7-core';
import type { SourceTile, TileLoadParams, TilesetManagerOptions } from '@antv/l7-utils';
import type { IParserData } from '../interface';
import { MVTLoader } from '../loader/mvt-loader';

/**
 * mvt parser（阶段 3.1.2：getVectorTile 闭包抽取为 `MVTLoader`）。
 *
 * parser 只负责「组装 `tilesetOptions.getTileData` 指向 loader」—— 数据
 * 获取（`getArrayBuffer` 异步取数 / `getCustomData` 回调）+ `tile.xhrCancel`
 * 取消语义下沉到 `MVTLoader.loadTile`。行为与迁移前等价：
 * - `getTileData(tileParams, tile)` 用 `tileParams` 做 URL 模板插值、
 *   `tile.x/y/z` 做 `getCustomData` / `MVTSource` 构造入参（mvt 历史行为，
 *   与 jsonTile 用 `tile.x/y/z` 做 URL 插值不同）；
 * - mvt 失败时 `MVTLoader` resolve `undefined`（非空 tile），与迁移前等价；
 * - 仅 `getArrayBuffer` 分支设 `tile.xhrCancel`。
 *
 * 顺带删除原模块级死导出 `export type MapboxVectorTile`（包内/跨包均无 import，
 * 详见 BACKLOG › MapboxVectorTile 4 处重复定义）。
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 3.1.2
 */
const DEFAULT_CONFIG: Partial<TilesetManagerOptions> = {
  tileSize: 256,
  minZoom: 0,
  maxZoom: Infinity,
  zoomOffset: 0,
  warp: true,
};

export default function mapboxVectorTile(
  data: string | string[],
  cfg?: ITileParserCFG,
): IParserData {
  // TODO: 后续考虑支持多服务
  const url = Array.isArray(data) ? data[0] : data;
  const loader = new MVTLoader(url, cfg?.requestParameters, cfg?.getCustomData);
  const getTileData = (tileParams: TileLoadParams, tile: SourceTile) =>
    loader.loadTile(tileParams, tile);

  const tilesetOptions = {
    ...DEFAULT_CONFIG,
    ...cfg,
    getTileData,
  };

  return {
    data: url,
    dataArray: [],
    tilesetOptions,
    isTile: true,
  };
}
