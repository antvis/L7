import type { ITileParserCFG } from '@antv/l7-core';
import type { RequestParameters, SourceTile, TileLoadParams } from '@antv/l7-utils';
import { getArrayBuffer, getURLFromTemplate } from '@antv/l7-utils';
import type { ITileSource } from '../interface';
import MVTSource from '../tile-source/mvt';
import type { TileLoader } from './tile-loader';

/**
 * mvt 瓦片加载器（阶段 3.1.2）。
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
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 3.1.2
 */
export class MVTLoader implements TileLoader {
  constructor(
    private readonly url: string,
    private readonly requestParameters?: Partial<RequestParameters>,
    private readonly getCustomData?: ITileParserCFG['getCustomData'],
  ) {}

  public loadTile(tileParams: TileLoadParams, tile: SourceTile): Promise<ITileSource | undefined> {
    const tileUrl = getURLFromTemplate(this.url, tileParams);
    return new Promise((resolve) => {
      if (this.getCustomData) {
        this.getCustomData(
          {
            x: tile.x,
            y: tile.y,
            z: tile.z,
          },
          (err, data) => {
            if (err || !data) {
              resolve(undefined);
            } else {
              const vectorSource = new MVTSource(data, tile.x, tile.y, tile.z);
              resolve(vectorSource);
            }
          },
        );
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
              const vectorSource = new MVTSource(data, tile.x, tile.y, tile.z);
              resolve(vectorSource);
            }
          },
        );
        tile.xhrCancel = () => xhr.cancel();
      }
    });
  }
}
