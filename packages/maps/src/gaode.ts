/**
 * 高德地图独立入口
 * 用法: import { GaodeMap } from '@antv/l7-maps/gaode'
 */
import { default as GaodeMapNext } from './amap-next';

const GaodeMap = GaodeMapNext;

/**
 * @deprecated
 * 不再支持 GaodeMapV1，自动指向最新版 GaodeMap V2
 */
const GaodeMapV1 = GaodeMapNext;

/**
 * @deprecated
 * 不再暴露 GaodeMapV2，默认自动指向最新版 GaodeMap
 */
const GaodeMapV2 = GaodeMapNext;

export { GaodeMap, GaodeMapV1, GaodeMapV2 };
