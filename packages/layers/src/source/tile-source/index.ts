/**
 * 瓦片数据源（TileSource）实现
 *
 * 每种瓦片格式有独立的 Source 类，封装「已解码瓦片 → GeoJSON features」的读取与缓存。
 *
 * 命名说明（阶段 0.6）：
 * - `MVTSource`：处理 Mapbox Vector Tile (MVT, 即 PBF 编码的矢量瓦片)
 * - `GeoJSONVTTileSource`：处理 geojson-vt 在内存中切出的瓦片（也用于 jsonTile）
 *
 * 历史兼容：
 * - 旧公开导出名 `VectorSource` 保留为 `MVTSource` 的别名，标 `@deprecated`。
 *   迁移完成后调用方应改用 `MVTSource`。
 */
export * from '../interface';
export { default as GeoJSONVTTileSource } from './geojsonvt';
export { default as MVTSource } from './mvt';

/** @deprecated 改用 MVTSource。保留以向后兼容。 */
export { default as VectorSource } from './mvt';
