import { Tile } from '../tile';

// 访问状态
const TILE_STATE_VISITED = 1;
// 可见状态
const TILE_STATE_VISIBLE = 2;

/*
 * 瓦片更新状态策略 - 默认
 * 对于当前视野 currentTile 且数据请求中的瓦片
 * 用最近上级的瓦片作为占位符
 * 如果没有最近上级瓦片可用，用最近的子级瓦片作为占位符
 */
export function updateTileStateDefault(tiles: Tile[]) {
  for (const tile of tiles) {
    tile.properties.state = 0;
  }
  for (const tile of tiles) {
    if (tile.isCurrent && !getPlaceholderInAncestors(tile)) {
      getPlaceholderInChildren(tile);
    }
  }
  for (const tile of tiles) {
    tile.isVisible = Boolean(tile.properties.state & TILE_STATE_VISIBLE);
  }
}

/*
 * 瓦片更新状态策略 - 全部替换策略
 * 对于当前视野的所有 currentTile 瓦片在加载完成之前，使用最近的上级瓦片作为占位符
 */
export function updateTileStateReplace(tiles: Tile[]) {
  for (const tile of tiles) {
    tile.properties.state = 0;
  }
  for (const tile of tiles) {
    if (tile.isCurrent) {
      getPlaceholderInAncestors(tile);
    }
  }

  const sortedTiles = Array.from(tiles).sort((t1, t2) => t1.z - t2.z);

  for (const tile of sortedTiles) {
    tile.isVisible = Boolean(tile.properties.state & TILE_STATE_VISIBLE);

    if (tile.isVisible || tile.properties.state & TILE_STATE_VISITED) {
      // 如果瓦片可见，隐藏所有的子级瓦片
      for (const child of tile.children) {
        child.properties.state = TILE_STATE_VISITED;
      }
    } else if (tile.isCurrent) {
      getPlaceholderInChildren(tile);
    }
  }
}

/*
 * 查找上级已加载的瓦片作为占位符
 * 如果找到返回 true
 */
function getPlaceholderInAncestors(tile: Tile) {
  while (tile) {
    if (tile.isLoaded || tile.data) {
      // tile.properties.state = tile.properties.state | TILE_STATE_VISIBLE
      tile.properties.state |= TILE_STATE_VISIBLE;
      return true;
    }
    tile = tile.parent as Tile;
  }
  return false;
}

/*
 * 递归查找将子级已加载瓦片作为占位符
 */
function getPlaceholderInChildren(tile: Tile) {
  for (const child of tile.children) {
    if (child.isLoaded || child.data) {
      child.properties.state |= TILE_STATE_VISIBLE;
    } else {
      getPlaceholderInChildren(child);
    }
  }
}
