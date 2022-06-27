import { Tile } from './tile';

// Bounds [minLng, minLat, maxLng, maxLat]
export type TileBounds = [number, number, number, number];

// 瓦片更新显示策略
export enum UpdateTileStrategy {
  // 实时更新策略
  Realtime = 'realtime',
  // 渐近更新策略
  Overlap = 'overlap',
  // 全部替换策略
  Replace = 'replace',
}

export type TileOptions = { x: number; y: number; z: number; tileSize: number };

export type TileLoadParams = TileOptions & {
  bounds: TileBounds;
  signal: AbortSignal;
};

export type TileLoadDataOptions = {
  getData: (params: TileLoadParams, tile: Tile) => Promise<any>;
  onLoad: (tile: Tile) => void;
  onError: (error: Error, tile: Tile) => void;
};

export enum LoadTileDataStatus {
  Loading = 'Loading',
  Loaded = 'Loaded',
  Failure = 'Failure',
  Cancelled = 'Cancelled',
}

export type TilesetManagerOptions = {
  tileSize: number;
  zoomOffset: number;
  minZoom: number;
  maxZoom: number;
  extent: TileBounds;
  getTileData: (params: TileLoadParams, tile: Tile) => any;
  updateStrategy: UpdateTileStrategy | ((tiles: Tile[]) => void);
};
