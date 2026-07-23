import type { SourceTile, TileLoadParams } from '@antv/l7-utils';
import type { IBandsOperation, IRasterFormat } from '../../interface';
import { processRasterData } from '../../utils/bandOperation/bands';
import type { CustomDataProvider } from '../custom-data-provider';
import type { IRasterTileLoader } from '../raster-tile-loader';

/**
 * CUSTOMARRAYBUFFER / CUSTOMRGB 取数 loader（阶段 3.2.2 从
 * `RasterTileLoader.loadCustomRasterData` 私有方法拆出，取数逻辑阶段 3.4 既有）。
 *
 * 经 `CustomDataProvider.fetch(tile)` 调用户 `getCustomData` 回调，再以
 * `processRasterData([{data, bands:[0]}], format, operation, cb)` 解码。`format`
 * 默认 `defaultFormat`、`operation` 可选 —— 二者在分发器构造期 resolve 后注入
 *（保 `cfg.format || defaultFormat` 归并语义）。
 *
 * 机械保留迁移前 empty/decode 语义（见 `raster-tile-loader.ts` 3.4 注释）：
 * - err → provider reject(err) → .then 跳过、reject 透传；
 * - `data.length === 0` → reject(undefined)（⚠️ 非 `!data`：空 TypedArray 真值但
 *   length===0，raster-buffer 独有语义，勿与 mvt/raster-image 的 `!data` 混淆）；
 * - 否则 processRasterData（cb error → reject(error)、else img → resolve(img)）。
 *
 * ⚠️ **只用 `tile`**（同 `CustomImageRasterLoader`）：保留接口完整签名
 * `loadTile(tileParams, tile)` 但仅用 `tile`；`tileParams` 末位使用参数前不检查
 *（`after-used`），零告警。见该类注释。
 */
export class CustomRasterLoader implements IRasterTileLoader {
  constructor(
    private readonly provider: CustomDataProvider,
    private readonly rasterFormat: IRasterFormat,
    private readonly operation?: IBandsOperation,
  ) {}

  public loadTile(tileParams: TileLoadParams, tile: SourceTile): Promise<unknown> {
    return this.provider.fetch(tile).then(
      (data) =>
        new Promise<unknown>((resolve, reject) => {
          // ⚠️ 机械保留迁移前 `getCustomData` util 的 `data.length === 0` 判定
          //（**非** `!data`）：对 ArrayBuffer `.length` 恒 undefined 故不触发；对
          // 空 TypedArray/空数组 length===0 → reject。`err` 由 provider catch 已透传，
          // 此处 err 已 falsy → reject(undefined) 与迁移前 `reject(err)` 等价。
          // 迁移前 util 的 `data` 类型是 `any`，此处沿用 `any` cast 避免 TS 摩擦并
          // 机械等价（undefined data 会抛 TypeError —— 与迁移前 sync-cb 抛错一致；
          // async-cb 的「挂起」既存隐患本阶段不修正，见 PROGRESS/BACKLOG）。
          if ((data as any).length === 0) {
            reject(undefined);
            return;
          }
          if (data) {
            processRasterData(
              [{ data: data as ArrayBuffer, bands: [0] }],
              this.rasterFormat,
              this.operation,
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
