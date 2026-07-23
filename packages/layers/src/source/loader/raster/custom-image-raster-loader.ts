import type { SourceTile, TileLoadParams } from '@antv/l7-utils';
import { formatImage } from '@antv/l7-utils';
import type { CustomDataProvider } from '../custom-data-provider';
import type { IRasterTileLoader } from '../raster-tile-loader';

/**
 * CUSTOMIMAGE / CUSTOMTERRAINRGB 取数 loader（阶段 3.2.2 从
 * `RasterTileLoader.loadCustomImageData` 私有方法拆出，取数逻辑阶段 3.4 既有）。
 *
 * 经 `CustomDataProvider.fetch(tile)` 调用户 `getCustomData` 回调，再按返回类型
 * 解码：ArrayBuffer → `formatImage` 解码；HTMLImageElement → 直传；空/其他真值
 * → reject。机械保留迁移前 empty/decode 语义（见 `raster-tile-loader.ts` 3.4 注释）。
 *
 * ⚠️ **只用 `tile`**（`{x,y,z}` 传用户 `getCustomData` 回调），不用 `tileParams`。
 * 保留接口完整签名 `loadTile(tileParams, tile)` 但仅用 `tile`；`tileParams` 位于
 * 末位使用参数之前，`@typescript-eslint/no-unused-vars` 默认 `after-used` 不检查
 * 末位使用前的位置参数，零告警（无 `argsIgnorePattern`，`_` 前缀无效，故不省参）。
 * 见 `custom-raster-loader.ts` 同款处理及 `raster-tile-loader.ts` 类注释的
 * 「第四种混用形态」中 CUSTOM\* 的「只用 tile」契约。
 */
export class CustomImageRasterLoader implements IRasterTileLoader {
  constructor(private readonly provider: CustomDataProvider) {}

  public loadTile(
    tileParams: TileLoadParams,
    tile: SourceTile,
  ): Promise<HTMLImageElement | ImageBitmap> {
    return this.provider.fetch(tile).then(
      (data) =>
        new Promise<HTMLImageElement | ImageBitmap>((resolve, reject) => {
          // - err → provider reject(err) → .then 跳过、reject 透传出外层 Promise；
          // - !data → reject(undefined)（等价迁移前 `reject(err)` 的 err 此时 falsy）；
          // - ArrayBuffer → formatImage(data, cb)（cb error → reject(error)，else resolve）；
          // - HTMLImageElement → 直传 resolve(data)；
          // - 其他真值 → reject(undefined)（等价迁移前 `else { reject(err) }`）。
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
}
