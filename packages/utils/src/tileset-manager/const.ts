import { Bounds, UpdateTileStrategy } from './types';
import {
  updateTileStateOverlap,
  updateTileStateReplace,
} from './utils/strategies';

export const TILE_SIZE = 256;
// [-Infinity,-Infinity,Infinity,Infinity,]
export const DEFAULT_EXTENT: Bounds = [
  -Infinity,
  -Infinity,
  Infinity,
  Infinity,
];
export const DEFAULT_CACHE_SCALE = 5;

// 瓦片更新显示策略
export const UPDATE_TILE_STRATEGIES = {
  [UpdateTileStrategy.Overlap]: updateTileStateOverlap,
  [UpdateTileStrategy.Replace]: updateTileStateReplace,
};

export const NOOP = () => {
  //
};
