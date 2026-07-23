import type { ITileParserCFG } from '@antv/l7-core';
import { RasterTileType } from '@antv/l7-core';
import type { ITileBand, SourceTile, TileLoadParams } from '@antv/l7-utils';
import { defaultFormat } from '../utils/tile/getRasterTile';
import { CustomDataProvider } from './custom-data-provider';
import { BufferRasterLoader } from './raster/buffer-raster-loader';
import { CustomImageRasterLoader } from './raster/custom-image-raster-loader';
import { CustomRasterLoader } from './raster/custom-raster-loader';
import { ImageRasterLoader } from './raster/image-raster-loader';

/**
 * 栅格瓦片 loader —— 阶段 3.2.1（分发器抽取）/ 3.4（CUSTOM\* 走
 * `CustomDataProvider`）/ **3.2.2（6 分支 switch 拆 4 独立小 loader + 接口化）**。
 *
 * 核心思想（与 mvt / jsonTile / geojsonvt 的 `TileLoader` 同构）：**parser =
 * 数据形状转换（config 组装）；loader = 数据获取（fetch / decode）**。parser 只留
 * 「isUrlError guard / DEFAULT_CONFIG 合并 / RGB→ARRAYBUFFER 归并 / extent·
 * coordinates 转 rasterTileCoord / 组装 IParserData」+ 委托 loader。
 *
 * ⚠️ 与矢量瓦片 `TileLoader` 的本质差异（故不共用接口）：
 * - **返回类型**：解析出的影像 / 缓冲（`HTMLImageElement | ImageBitmap` / 栅格
 *   数据对象），**非** `ITileSource`。
 * - **失败语义**：4 条取数路径在 err 时 **reject**（与 mvt 失败 resolve `undefined`
 *   不同）。注：`SourceTile.loadData` 把 `getData` 包 try/catch，reject 与 resolve
 *   空值都走 `onError`，故 raster 的 reject 在消费层等价 —— 但本类机械保留 reject
 *   以零行为变化。
 *
 * ⚠️ `tileParams` vs `tile` 使用契约（raster 是第四种混用形态，勿与矢量统一）：
 * - **IMAGE / ARRAYBUFFER**：同时用 `tileParams`（URL 模板插值 / `getTileUrl`）和
 *   `tile`（`tile.xhrCancel` 取消句柄，经 `getImage` / `getRasterFile`→`bindCancel`
 *   在 utils 内部设置）。
 * - **CUSTOMIMAGE / CUSTOMTERRAINRGB / CUSTOMARRAYBUFFER / CUSTOMRGB**：**只**用
 *   `tile`（`{x,y,z}` 传用户 `getCustomData` 回调），不用 `tileParams`。
 *
 * **阶段 3.2.2 结构**：原 `loadTile` 的 6-case switch 拆成 4 个独立小 loader（按
 * 取数行为分，非按 enum 值——CUSTOMIMAGE/CUSTOMTERRAINRGB 共享
 * `CustomImageRasterLoader`、CUSTOMARRAYBUFFER/CUSTOMRGB 共享 `CustomRasterLoader`；
 * 6 个 enum 值仅 4 种取数行为，拆 6 会成对重复，故拆 4，记 PLAN 偏差）。分发器持
 * `Map<RasterTileType, IRasterTileLoader>` 按 `tileDataType` 选 loader，**未命中走
 * `ImageRasterLoader` 兜底**（保 3.2.1 `default` 分支：TERRAINRGB / 未知类型 →
 * `getTileImage`）。`tileDataType` 构造期固定，故 loader 在构造期 resolve 一次（等
 * 价原 switch 每次 call 重判，略省）。CUSTOM\* 4 分支仍共用一个 `CustomDataProvider`
 * 实例（与 3.4 同）。重构参考：docs/refactoring/source/PLAN.md › 阶段 3.2 / 3.4。
 */
export interface IRasterTileLoader {
  loadTile(tileParams: TileLoadParams, tile: SourceTile): Promise<unknown>;
}

export class RasterTileLoader {
  private readonly loader: IRasterTileLoader;

  constructor(
    private readonly data: string | string[] | ITileBand[],
    private readonly tileDataType: RasterTileType,
    private readonly cfg: Partial<ITileParserCFG>,
  ) {
    // CUSTOM\* 4 分支共用一个 provider；IMAGE/ARRAYBUFFER 不用（构造一次性无害）。
    // `cfg.getCustomData` 在 `Partial<ITileParserCFG>` 下可为 undefined —— CUSTOM\*
    // 若用户未提供则 provider.fetch 调 undefined fn 抛 TypeError，与迁移前
    // `getCustomData(tile, undefined, ...)` 调 undefined fn 抛 TypeError 等价。
    const customDataProvider: CustomDataProvider = new CustomDataProvider(
      this.cfg.getCustomData as ITileParserCFG['getCustomData'],
    );
    const image = new ImageRasterLoader(this.data as string | string[], this.cfg);
    const buffer = new BufferRasterLoader(this.data, this.cfg);
    const customImage = new CustomImageRasterLoader(customDataProvider);
    const customRaster = new CustomRasterLoader(
      customDataProvider,
      this.cfg?.format || defaultFormat,
      this.cfg?.operation,
    );

    // 6 enum 值 → 4 loader 行为映射；未命中（TERRAINRGB / 未知）落 image 兜底
    //（保 3.2.1 switch `default` → getTileImage 语义）。
    const loaders = new Map<RasterTileType, IRasterTileLoader>([
      [RasterTileType.IMAGE, image],
      [RasterTileType.ARRAYBUFFER, buffer],
      [RasterTileType.CUSTOMIMAGE, customImage],
      [RasterTileType.CUSTOMTERRAINRGB, customImage],
      [RasterTileType.CUSTOMARRAYBUFFER, customRaster],
      [RasterTileType.CUSTOMRGB, customRaster],
    ]);
    this.loader = loaders.get(this.tileDataType) ?? image;
  }

  /**
   * 按 `tileDataType`（构造期 resolve）分发到对应 loader。零行为改动（含
   * `// @ts-ignore`、`data` 向下转型、`cfg.format || defaultFormat`——后者移入
   * `CustomRasterLoader` 构造期注入，语义等价）。
   */
  public loadTile(tileParams: TileLoadParams, tile: SourceTile) {
    return this.loader.loadTile(tileParams, tile);
  }
}
