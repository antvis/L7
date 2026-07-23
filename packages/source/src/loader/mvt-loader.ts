import type { ITileParserCFG } from '@antv/l7-core';
import type { RequestParameters, SourceTile, TileLoadParams } from '@antv/l7-utils';
import { getArrayBuffer, getURLFromTemplate } from '@antv/l7-utils';
import type { ITileSource } from '../interface';
import MVTSource from '../tile-source/mvt';
import { CustomDataProvider } from './custom-data-provider';
import type { TileLoader } from './tile-loader';

/**
 * mvt 瓦片加载器（阶段 3.1.2 / 3.4）。
 *
 * 从原 `parser/mvt.ts` 的模块级 `getVectorTile` 闭包机械抽取而来 ——
 * 行为与迁移前 100% 等价：
 * - **URL 模板用 `tileParams`（`TileLoadParams`）插值**，与 jsonTile 用
 *   `tile.x/y/z` 不同（mvt 历史行为，本 loader 必须保留此差异）；
 * - `getCustomData` 优先（入参用 `tile.x/y/z`，err/无数据 resolve `undefined`）；
 * - 否则走 `getArrayBuffer` 异步取数（err/无数据 resolve `undefined`，成功
 *   `new MVTSource(data, tile.x, tile.y, tile.z)`）；
 * - err 永不 reject，失败统一 resolve `undefined`（与迁移前等价，
 *   tileset-manager 状态机已处理 undefined）；
 * - **取消语义**：仅 `getArrayBuffer` 分支在 `loadTile` 内同步设置
 *   `tile.xhrCancel = () => xhr.cancel()`（赋值发生在 `getArrayBuffer`
 *   返回后、回调触发前的同步窗口，故任何 fetch 错误到达前 xhrCancel 已就位）；
 *   `getCustomData` 分支无 xhr 句柄，保持等价 —— 不设置 `xhrCancel`。
 *
 * **阶段 3.4**：`getCustomData` 分支改用 `CustomDataProvider.fetch(tile)`
 * （provider 只包装「调用户回调」原语 reject-on-err，empty 检查仍在本 loader
 * `.then` 内用 `!data` —— 与 raster 的 `data.length===0` 语义不同见 provider
 * 注释）：
 * - provider reject(err) → `.catch(() => resolve(undefined))`；
 * - provider resolve(undefined/空) → `.then(data => !data ? resolve(undefined) ...)`;
 * - provider resolve(有效 data) → `new MVTSource(data, tile.x, tile.y, tile.z)`。
 * 三路径 aggregate 后仍与迁移前 `(err || !data) ? resolve(undefined) : resolve(MVTSource)`
 * 字字等价。
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 3.1.2 / 3.4
 */
export class MVTLoader implements TileLoader {
  private readonly customDataProvider?: CustomDataProvider;

  constructor(
    private readonly url: string,
    private readonly requestParameters?: Partial<RequestParameters>,
    getCustomData?: ITileParserCFG['getCustomData'],
  ) {
    // 仅当用户提供 getCustomData 时构造 provider —— 与迁移前 `if (getCustomData)`
    // 分支判断同构。provider 无状态，构造期一次即可。
    if (getCustomData) {
      this.customDataProvider = new CustomDataProvider(getCustomData);
    }
  }

  public loadTile(tileParams: TileLoadParams, tile: SourceTile): Promise<ITileSource | undefined> {
    const tileUrl = getURLFromTemplate(this.url, tileParams);
    return new Promise((resolve) => {
      if (this.customDataProvider) {
        this.customDataProvider
          .fetch(tile)
          .then((data) => {
            if (!data) {
              resolve(undefined);
            } else {
              const vectorSource = new MVTSource(data as ArrayBuffer, tile.x, tile.y, tile.z);
              resolve(vectorSource);
            }
          })
          // provider reject(err) → 与迁移前 `if (err || !data) resolve(undefined)` 的
          // err 分支等价：失败统一 resolve undefined（err 值本身被丢弃，与迁移前同）。
          .catch(() => {
            resolve(undefined);
          });
      } else {
        const xhr = getArrayBuffer(
          {
            ...this.requestParameters,
            url: tileUrl,
          },
          (err, data) => {
            if (err || !data) {
              resolve(undefined);
            } else {
              const vectorSource = new MVTSource(data as ArrayBuffer, tile.x, tile.y, tile.z);
              resolve(vectorSource);
            }
          },
        );
        tile.xhrCancel = () => xhr.cancel();
      }
    });
  }
}
