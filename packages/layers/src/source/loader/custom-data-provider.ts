import type { ITileParserCFG } from '@antv/l7-core';
import type { SourceTile } from '@antv/l7-utils';

/**
 * 用户自定义取数 Provider（阶段 3.4）。
 *
 * 把 mvt / raster 三处消费点共有的「调用户 `getCustomData` 回调 + Promise
 * 包装」原语抽成单一抽象：
 * - **mvt-loader** 的 `getCustomData` 分支（阶段 3.1.2，失败 resolve
 *   `undefined`，成功 `new MVTSource(data, tile.x, tile.y, tile.z)`）；
 * - **raster-tile-loader** 的 CUSTOMARRAYBUFFER / CUSTOMRGB 分支（失败
 *   reject，成功 `processRasterData([{data, bands:[0]}], format, operation)`
 *   解码栅格）；
 * - **raster-tile-loader** 的 CUSTOMIMAGE / CUSTOMTERRAINRGB 分支（失败
 *   reject，成功 `formatImage(data)` 或直传 `HTMLImageElement`）。
 *
 * ⚠️ **设计取舍（方案 A，零行为变化）**：本 provider **只**封装「调用户回调
 * + Promise 包装」这一 1 行共享原语 —— 三处都 `getCustomDataFunc({x:tile.x,
 * y:tile.y, z:tile.z}, cb)` 调用户回调取数，机械抽出。
 *
 * provider **不在自身层做 empty 判定**，因为三消费点的 empty 语义不同：
 * - mvt / raster-image 用 `!data`（ArrayBuffer `new ArrayBuffer(0)` 恒真值）；
 * - raster-buffer 用 `data.length === 0`（对 ArrayBuffer `.length` 恒 undefined
 *   故从不触发，但对空 TypedArray / 空数组会 reject）。
 * provider 统一做 empty 判定会改变 raster-buffer 空 TypedArray 的 reject 行为
 * （空 TypedArray 真值但 length===0），违反渐进等价原则。故 provider **只在
 * `err` 真值时 reject(err)**，`err` 为 falsy 时**无条件 resolve(data)**（即使
 * data 为 undefined / 空数组 / 空缓冲）—— 各消费点在 `.then` 内保留**各自**
 * 的 empty 检查与后处理：
 * - mvt：`.then(data => data ? new MVTSource(...) : undefined).catch(() => undefined)`；
 * - raster-buffer：`.then(data => data.length === 0 ? reject : processRasterData).catch(e => reject(e))`；
 * - raster-image：`.then(data => !data ? reject : ArrayBuffer ? formatImage : HTMLImageElement ? resolve : reject).catch(e => reject(e))`。
 *
 * **取消语义**：`getCustomData` 回调无 xhr 句柄（用户自取数），与 mvt
 * `getArrayBuffer` 分支 / raster IMAGE+ARRAYBUFFER 的 `tile.xhrCancel` 不同
 * —— provider 不设置 `tile.xhrCancel`，与迁移前等价。
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 3.4
 */
export class CustomDataProvider {
  constructor(private readonly getCustomDataFunc: ITileParserCFG['getCustomData']) {}

  /**
   * 调用户 `getCustomData({x,y,z}, cb)` 取数并包装成 Promise。
   *
   * `err` 真值 → reject(err)；否则 resolve(data)（data 可为 undefined / 空
   * 数组 / 空缓冲 —— empty 判定交由消费点 `.then` 内各自完成，见类注释）。
   *
   * @returns 包装用户回调的 Promise。`tile.x/y/z` 作为入参传给用户回调
   * （与迁移前三消费点一致 —— CUSTOM* 仅用 `tile`，不传 `tileParams`）。
   */
  public fetch(tile: SourceTile): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.getCustomDataFunc(
        {
          x: tile.x,
          y: tile.y,
          z: tile.z,
        },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        },
      );
    });
  }
}
