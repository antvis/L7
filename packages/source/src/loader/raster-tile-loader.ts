import type { ITileParserCFG } from '@antv/l7-core';
import { RasterTileType } from '@antv/l7-core';
import type { ITileBand, SourceTile, TileLoadParams } from '@antv/l7-utils';
import { getCustomData, getCustomImageData } from '../utils/tile/getCustomData';
import { defaultFormat, getTileBuffer, getTileImage } from '../utils/tile/getRasterTile';

/**
 * 栅格瓦片加载器 —— 阶段 3.2.1（分发器抽取）。
 *
 * 核心思想（与 mvt / jsonTile / geojsonvt 的 `TileLoader` 同构）：**parser =
 * 数据形状转换（config 组装）；loader = 数据获取（fetch / decode）**。把原
 * `parser/raster-tile.ts` 里 `getTileData` 的大 switch（`RasterTileType` × 6
 * 分支）搬进本类的 `loadTile`，parser 只剩「isUrlError guard / DEFAULT_CONFIG
 * 合并 / RGB→ARRAYBUFFER 归并 / extent·coordinates 转 rasterTileCoord / 组装
 * IParserData」+ 委托 loader。
 *
 * ⚠️ 与矢量瓦片 `TileLoader` 的本质差异（故不共用接口）：
 * - **返回类型**：解析出的影像 / 缓冲（`HTMLImageElement | ImageBitmap` /
 *   栅格数据对象），**非** `ITileSource`。
 * - **失败语义**：4 条取数路径在 err 时 **reject**（与 mvt 失败 resolve
 *   `undefined` 不同）。注：`SourceTile.loadData`（`@antv/l7-utils`）把
 *   `getData` 包在 try/catch，**reject 与 resolve 空值都走 `onError`**，故
 *   raster 的 reject 在消费层与「resolve 空」等价 —— 但本类机械保留 reject
 *   以零行为变化。
 *
 * ⚠️ `tileParams` vs `tile` 使用契约（raster 是第四种混用形态，勿与矢量统一）：
 * - **IMAGE / ARRAYBUFFER**：同时用 `tileParams`（URL 模板插值 / `getTileUrl`）
 *   和 `tile`（`tile.xhrCancel` 取消句柄，经 `getImage` / `getRasterFile`→
 *   `bindCancel` 在 utils 内部设置）。
 * - **CUSTOMIMAGE / CUSTOMTERRAINRGB / CUSTOMARRAYBUFFER / CUSTOMRGB**：**只**
 *   用 `tile`（`{x,y,z}` 传给用户 `getCustomData` 回调），不用 `tileParams`。
 *
 * 阶段 3.2.1 仅抽分发器（switch 原样搬入）；3.2.2 将把 6 分支拆成独立小
 * loader（`RasterImageLoader` / `RasterBufferLoader` / `RasterCustomImageLoader`
 * / `RasterCustomDataLoader` 等，届时引入 `RasterTileLoader` 接口由分发器按
 * `dataType` 选 loader）。重构参考：docs/refactoring/source/PLAN.md › 阶段 3.2
 */
export class RasterTileLoader {
  constructor(
    private readonly data: string | string[] | ITileBand[],
    private readonly tileDataType: RasterTileType,
    private readonly cfg: Partial<ITileParserCFG>,
  ) {}

  /**
   * 按 `tileDataType` 分发到对应取数路径。机械搬运自原 `getTileData` switch，
   * 零行为改动（含 `// @ts-ignore`、`data` 向下转型、`cfg.format || defaultFormat`）。
   */
  public loadTile(tileParams: TileLoadParams, tile: SourceTile) {
    switch (this.tileDataType) {
      case RasterTileType.IMAGE:
        return getTileImage(this.data as string | string[], tileParams, tile, this.cfg);
      case RasterTileType.CUSTOMIMAGE:
      case RasterTileType.CUSTOMTERRAINRGB:
        return getCustomImageData(
          // 自定义地形请求方式数据
          tile,
          // @ts-ignore
          this.cfg?.getCustomData,
        );
      case RasterTileType.ARRAYBUFFER:
        return getTileBuffer(this.data, tileParams, tile, this.cfg);
      case RasterTileType.CUSTOMARRAYBUFFER:
      case RasterTileType.CUSTOMRGB:
        return getCustomData(
          tile,
          // @ts-ignore
          this.cfg?.getCustomData,
          this.cfg?.format || defaultFormat,
          this.cfg?.operation,
        );
      default:
        return getTileImage(this.data as string | string[], tileParams, tile, this.cfg);
    }
  }
}
