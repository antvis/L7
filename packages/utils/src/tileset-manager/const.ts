import {
  updateTileStateDefault,
  updateTileStateReplace,
} from './utils/strategies';

export const TILE_SIZE = 256;
export const DEFAULT_EXTENT: [number, number, number, number] = [
  -Infinity,
  -Infinity,
  Infinity,
  Infinity,
];
export const DEFAULT_CACHE_SCALE = 5;

export enum UpdateTileStrategy {
  STRATEGY_DEFAULT = 'STRATEGY_DEFAULT',
  STRATEGY_REPLACE = 'STRATEGY_REPLACE',
  STRATEGY_NEVER = 'STRATEGY_NEVER',
}

// 瓦片更新显示策略
export const UPDATE_TILE_STRATEGIES = {
  [UpdateTileStrategy.STRATEGY_DEFAULT]: updateTileStateDefault,
  [UpdateTileStrategy.STRATEGY_REPLACE]: updateTileStateReplace,
  [UpdateTileStrategy.STRATEGY_NEVER]: () => {
    //
  },
};

export const NOOP = () => {
  //
};
