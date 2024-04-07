import type { TileBounds } from './types';
import { UpdateTileStrategy } from './types';
import {
  updateTileStateOverlap,
  updateTileStateRealtime,
  updateTileStateReplace,
} from './utils/strategies';

export const TILE_SIZE = 256;
export const DEFAULT_EXTENT: TileBounds = [-Infinity, -Infinity, Infinity, Infinity];

export const BOUNDS_BUFFER_SCALE = 0.2;
export const DEFAULT_CACHE_SCALE = 5;

// 瓦片更新显示策略
export const UPDATE_TILE_STRATEGIES = {
  [UpdateTileStrategy.Realtime]: updateTileStateRealtime,
  [UpdateTileStrategy.Overlap]: updateTileStateOverlap,
  [UpdateTileStrategy.Replace]: updateTileStateReplace,
};

export const NOOP = () => {
  //
};
