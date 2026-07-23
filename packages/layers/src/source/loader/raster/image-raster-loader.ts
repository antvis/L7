import type { ITileParserCFG } from '@antv/l7-core';
import type { SourceTile, TileLoadParams } from '@antv/l7-utils';
import { getTileImage } from '../../utils/tile/getRasterTile';
import type { IRasterTileLoader } from '../raster-tile-loader';

/**
 * IMAGE 取数 loader（阶段 3.2.2 从 `RasterTileLoader` 6 分支 switch 拆出）。
 *
 * 包装 `getTileImage` free function：URL 模板插值（`tileParams`，含 WMTS 分支）
 * + `tile.xhrCancel` 取消句柄（经 `getImage` 在 utils 内部设置）。返回影像。
 *
 * 同时用作分发器**未命中 dataType 的兜底 loader**（保 3.2.1 `default` 分支语义：
 * TERRAINRGB / 未知类型均落此）—— 故 `RasterTileLoader.fallback` 持本类实例。
 *
 * ⚠️ 双用 `tileParams` + `tile`（与 ARRAYBUFFER 同、与 CUSTOM\* 异，见
 * `raster-tile-loader.ts` 类注释的「第四种混用形态」）。
 */
export class ImageRasterLoader implements IRasterTileLoader {
  constructor(
    private readonly data: string | string[],
    private readonly cfg: Partial<ITileParserCFG>,
  ) {}

  public loadTile(tileParams: TileLoadParams, tile: SourceTile) {
    return getTileImage(this.data, tileParams, tile, this.cfg);
  }
}
