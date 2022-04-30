// Bounds [minLng, minLat, maxLng, maxLat]
export type Bounds = [number, number, number, number];

// 瓦片更新显示策略
export enum UpdateTileStrategy {
  // 渐近更新策略
  Overlap = 'overlap',
  // 全部替换策略
  Replace = 'replace',
}
