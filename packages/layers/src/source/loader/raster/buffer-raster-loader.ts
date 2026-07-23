import type { ITileParserCFG } from '@antv/l7-core';
import type { ITileBand, SourceTile, TileLoadParams } from '@antv/l7-utils';
import { getTileBuffer } from '../../utils/tile/getRasterTile';
import type { IRasterTileLoader } from '../raster-tile-loader';

/**
 * ARRAYBUFFER 取数 loader（阶段 3.2.2 从 `RasterTileLoader` 6 分支 switch 拆出）。
 *
 * 包装 `getTileBuffer` free function：tiff / lerc / dem 等栅格瓦片取数（多文件模式
 * 支持）。`tileParams` 做 URL 模板插值（`getTileUrl`），`tile.xhrCancel` 经
 * `getRasterFile`→`bindCancel` 在 utils 内部设置。
 *
 * ⚠️ 双用 `tileParams` + `tile`（与 IMAGE 同、与 CUSTOM\* 异）。RGB 在 parser
 * 侧已归并为 ARRAYBUFFER（`rasterTile` 的 `RasterTileType.RGB → ARRAYBUFFER`），
 * 故本 loader 同时承接 RGB 数据纹理请求。
 */
export class BufferRasterLoader implements IRasterTileLoader {
  constructor(
    private readonly data: string | string[] | ITileBand[],
    private readonly cfg: Partial<ITileParserCFG>,
  ) {}

  public loadTile(tileParams: TileLoadParams, tile: SourceTile) {
    return getTileBuffer(this.data, tileParams, tile, this.cfg);
  }
}
