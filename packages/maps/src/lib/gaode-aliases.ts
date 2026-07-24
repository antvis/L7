/**
 * 高德地图（GaodeMap）公开导出与 V1/V2 弃用别名 —— 单一来源。
 *
 * `@antv/l7-maps` 主入口（`index.ts`）与 `@antv/l7-maps/gaode` 子路径入口
 * （`gaode.ts`）共用此模块，避免两处 entry 各自重复定义同一段弃用别名样板。
 */
import GaodeMapNext from '../amap-next';

/**
 * 高德地图（默认即最新版 V2）
 */
export const GaodeMap = GaodeMapNext;

/**
 * @deprecated
 * 不再支持 GaodeMapV1，自动指向最新版 GaodeMap V2
 */
export const GaodeMapV1 = GaodeMapNext;

/**
 * @deprecated
 * 不再暴露 GaodeMapV2，默认自动指向最新版 GaodeMap
 */
export const GaodeMapV2 = GaodeMapNext;
