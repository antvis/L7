import type { ITileParserCFG } from '@antv/l7-core';
import { RasterTileType } from '@antv/l7-core';
import type { ITileBand, SourceTile, TileLoadParams } from '@antv/l7-utils';
import { formatImage } from '@antv/l7-utils';
import type { IBandsOperation, IRasterFormat } from '../interface';
import { processRasterData } from '../utils/bandOperation/bands';
import { defaultFormat, getTileBuffer, getTileImage } from '../utils/tile/getRasterTile';
import { CustomDataProvider } from './custom-data-provider';

/**
 * 栅格瓦片加载器 —— 阶段 3.2.1（分发器抽取）/ 3.4（CUSTOM\* 走
 * `CustomDataProvider`）。
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
 * **阶段 3.4**：CUSTOM\* 4 分支原走 `utils/tile/getCustomData.ts` 的
 * `getCustomData`/`getCustomImageData` 两个 free function —— 现统一改用
 * `CustomDataProvider.fetch(tile)`（provider 只包装「调用户回调」原语
 * reject-on-err，empty 检查 + 解码后处理仍在本 loader `.then` 内**各自**保留
 * 以零行为变化）：
 * - CUSTOMARRAYBUFFER / CUSTOMRGB：`provider.fetch(tile).then(data =>
 *   data.length === 0 ? reject(undefined) : processRasterData([...], format,
 *   operation))`，reject 透传（catch(e) → reject(e)）；
 * - CUSTOMIMAGE / CUSTOMTERRAINRGB：`provider.fetch(tile).then(data => !data ?
 *   reject(undefined) : ArrayBuffer ? formatImage : HTMLImageElement ? resolve :
 *   reject(undefined))`，reject 透传。
 * `utils/tile/getCustomData.ts` 因此被完全取代并删除。空 TypedArray 的
 * `data.length===0` reject 行为（raster-buffer 独有，非 `!data`）被原样保留。
 *
 * 阶段 3.2.1 仅抽分发器；3.2.2 将把 6 分支拆成独立小 loader（CUSTOM\* 4 分支
 * 届时各自直接持 `CustomDataProvider`）。重构参考：
 * docs/refactoring/source/PLAN.md › 阶段 3.2 / 3.4
 */
export class RasterTileLoader {
  private readonly customDataProvider: CustomDataProvider;

  constructor(
    private readonly data: string | string[] | ITileBand[],
    private readonly tileDataType: RasterTileType,
    private readonly cfg: Partial<ITileParserCFG>,
  ) {
    // CUSTOM\* 4 分支均需 provider；IMAGE/ARRAYBUFFER 不用（但构造一次性无害）。
    // `cfg.getCustomData` 在 `Partial<ITileParserCFG>` 下可为 undefined —— CUSTOM\*
    // 若用户未提供则 provider.fetch 会调 undefined fn 抛 TypeError，与迁移前
    // `getCustomData(tile, undefined, ...)` 调 undefined fn 抛 TypeError 等价。
    this.customDataProvider = new CustomDataProvider(
      this.cfg.getCustomData as ITileParserCFG['getCustomData'],
    );
  }

  /**
   * 按 `tileDataType` 分发到对应取数路径。机械搬运自原 `getTileData` switch
   *（阶段 3.2.1），CUSTOM\* 4 分支阶段 .4 改走 provider（见类注释）。零行为
   * 改动（含 `// @ts-ignore`、`data` 向下转型、`cfg.format || defaultFormat`）。
   */
  public loadTile(tileParams: TileLoadParams, tile: SourceTile) {
    switch (this.tileDataType) {
      case RasterTileType.IMAGE:
        return getTileImage(this.data as string | string[], tileParams, tile, this.cfg);
      case RasterTileType.CUSTOMIMAGE:
      case RasterTileType.CUSTOMTERRAINRGB:
        return this.loadCustomImageData(tile);
      case RasterTileType.ARRAYBUFFER:
        return getTileBuffer(this.data, tileParams, tile, this.cfg);
      case RasterTileType.CUSTOMARRAYBUFFER:
      case RasterTileType.CUSTOMRGB:
        return this.loadCustomRasterData(
          tile,
          this.cfg?.format || defaultFormat,
          this.cfg?.operation,
        );
      default:
        return getTileImage(this.data as string | string[], tileParams, tile, this.cfg);
    }
  }

  /**
   * CUSTOMIMAGE / CUSTOMTERRAINRGB 取数路径（阶段 3.4 取代
   * `getCustomImageData` util）。机械保留迁移前 empty/decode 语义：
   * - err → provider reject(err) → `.then` 跳过、reject 透传出外层 Promise；
   * - !data → `.then` 内 reject(undefined)（等价迁移前 `reject(err)` 的 err
   *   此时 undefined）；
   * - ArrayBuffer → `formatImage(data, cb)` 解码（cb error → reject(error)，
   *   else resolve(image)）；
   * - HTMLImageElement → 直传 resolve(data)；
   * - 其他真值 → reject(undefined)（等价迁移前 `else { reject(err) }`）。
   */
  private loadCustomImageData(tile: SourceTile): Promise<HTMLImageElement | ImageBitmap> {
    return this.customDataProvider.fetch(tile).then(
      (data) =>
        new Promise<HTMLImageElement | ImageBitmap>((resolve, reject) => {
          if (!data) {
            reject(undefined);
          } else if (data instanceof ArrayBuffer) {
            formatImage(data, (error, image) => {
              if (error) {
                reject(error);
              }
              resolve(image as HTMLImageElement | ImageBitmap);
            });
          } else if (data instanceof HTMLImageElement) {
            resolve(data);
          } else {
            reject(undefined);
          }
        }),
    );
  }

  /**
   * CUSTOMARRAYBUFFER / CUSTOMRGB 取数路径（阶段 3.4 取代 `getCustomData`
   * util）。机械保留迁移前 empty/decode 语义：
   * - err → provider reject(err) → `.then` 跳过、reject 透传；
   * - `data.length === 0` → reject(undefined)（⚠️ 非 `!data`：空 TypedArray
   *   真值但 length===0，raster-buffer 独有语义，勿与 mvt/raster-image 的
   *   `!data` 混淆）；
   * - 否则 `processRasterData([{data, bands:[0]}], format, operation, cb)`：
   *   cb error → reject(error)、else img → resolve(img)。
   */
  private loadCustomRasterData(
    tile: SourceTile,
    rasterFormat: IRasterFormat,
    operation?: IBandsOperation,
  ): Promise<unknown> {
    return this.customDataProvider.fetch(tile).then(
      (data) =>
        new Promise<unknown>((resolve, reject) => {
          // ⚠️ 机械保留迁移前 `getCustomData` util 的 `data.length === 0` 判定
          //（**非** `!data`）：对 ArrayBuffer `.length` 恒 undefined 故不触发；对
          // 空 TypedArray/空数组 length===0 → reject。`err` 由 provider catch 已
          // 透传，此处 err 已 falsy → reject(undefined) 与迁移前 `reject(err)` 等价。
          // 迁移前 util 的 `data` 类型是 `any`，此处沿用 `any` cast 避免 TS 摩擦并
          // 机械等价（undefined data 会抛 TypeError —— 与迁移前 sync-cb 抛错一致；
          // async-cb 的「挂起」既存隐患本阶段不修正，见 PROGRESS）。
          if ((data as any).length === 0) {
            reject(undefined);
            return;
          }
          if (data) {
            processRasterData(
              [{ data: data as ArrayBuffer, bands: [0] }],
              rasterFormat,
              operation,
              (error, img) => {
                if (error) {
                  reject(error);
                } else if (img) {
                  resolve(img);
                }
              },
            );
          }
        }),
    );
  }
}
