import type { SourceTile, TileLoadParams } from '@antv/l7-utils';
import type { ITileSource } from '../interface';

/**
 * 瓦片加载器契约（阶段 3.1）。
 *
 * 核心思想：**parser = 数据形状转换（纯函数）；loader = 数据获取
 * （fetch / decode）**。本接口把 mvt / jsonTile / geojsonvt parser 里的
 * `getVectorTile` 闭包抽成实现本接口的类，parser 只组装
 * `tilesetOptions.getTileData = (params, tile) => loader.loadTile(params, tile)`。
 *
 * 返回 `Promise<ITileSource | undefined>`：
 * - **mvt** 在 fetch 失败 / 无数据时 resolve `undefined`（与迁移前等价，
 *   tileset-manager 的 tile 状态机已处理 undefined）。
 * - **jsonTile / geojsonvt** 始终 resolve 一个 `ITileSource`（空数据时为空
 *   `defaultLayer` 的 GeoJSONVTTileSource），undefined 是合法但不使用的值。
 *
 * ⚠️ 取消语义：实现需在 `loadTile` 内把 `tile.xhrCancel` 设置为取消函数
 * （如 mvt 的 `tile.xhrCancel = () => xhr.cancel()`）。jsonTile / geojsonvt
 * 当前无取消逻辑，本接口不强制 —— 保持与迁移前等价（不设置 xhrCancel）。
 *
 * 重构参考：docs/refactoring/source/PLAN.md › 阶段 3.1
 */
export interface TileLoader {
  loadTile(tileParams: TileLoadParams, tile: SourceTile): Promise<ITileSource | undefined>;
}
