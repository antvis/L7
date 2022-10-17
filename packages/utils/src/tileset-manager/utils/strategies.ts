import { SourceTile } from '../tile';

// 访问状态
const TILE_STATE_DEFAULT = 0;
// 访问状态
const TILE_STATE_VISITED = 1;
// 可见状态
const TILE_STATE_VISIBLE = 2;

/*
 * 瓦片更新状态策略 - 实时更新策略
 * 当前视野 currentTile 请求到数据就立即显示
 * 请求中的数据不显示不填补，渲染留白
 */
export function updateTileStateRealtime(tiles: SourceTile[]) {
  tiles.forEach((tile) => {
    if (tile.isCurrent) {
      tile.isVisible = tile.isLoaded;
    }
  });
}

/*
 * 瓦片更新状态策略 - 渐近更新策略
 * 对于当前视野 currentTile 且数据请求中的瓦片
 * 用最近上级的瓦片作为占位符
 * 如果没有最近上级瓦片可用，用最近的子级瓦片作为占位符
 */
export function updateTileStateOverlap(tiles: SourceTile[]) {
  tiles.forEach((tile) => {
    tile.properties.state = TILE_STATE_DEFAULT;
  });
  tiles.forEach((tile) => {
    if (tile.isCurrent && !getPlaceholderInAncestors(tile)) {
      getPlaceholderInChildren(tile);
    }
  });
  tiles.forEach((tile) => {
    tile.isVisible = Boolean(tile.properties.state & TILE_STATE_VISIBLE);
  });
}

/*
 * 瓦片更新状态策略 - 全部替换策略
 * 对于当前视野的所有 currentTile 瓦片在加载完成之前，使用最近的上级瓦片作为占位符
 */
export function updateTileStateReplace(tiles: SourceTile[]) {
  tiles.forEach((tile) => {
    tile.properties.state = TILE_STATE_DEFAULT;
  });
  // 更新当前视野瓦片的上级瓦片可见状态
  tiles.forEach((tile) => {
    if (tile.isCurrent) {
      getPlaceholderInAncestors(tile);
    }
  });

  // 通过 zoom 层级排序，最小的层级在上面
  const sortedTiles = tiles.slice().sort((t1, t2) => t1.z - t2.z);

  sortedTiles.forEach((tile) => {
    tile.isVisible = Boolean(tile.properties.state & TILE_STATE_VISIBLE);

    if (
      tile.children.length &&
      (tile.isVisible || tile.properties.state & TILE_STATE_VISITED)
    ) {
      // 如果瓦片可见，隐藏所有的子级瓦片
      tile.children.forEach((child) => {
        child.properties.state = TILE_STATE_VISITED;
      });
    } else if (tile.isCurrent) {
      getPlaceholderInChildren(tile);
    }
  });
}

/*
 * 查找上级已加载的瓦片作为占位符
 * 如果找到返回 true
 */
function getPlaceholderInAncestors(tile: SourceTile | null) {
  while (tile) {
    if (tile.isLoaded) {
      // tile.properties.state = tile.properties.state | TILE_STATE_VISIBLE
      tile.properties.state |= TILE_STATE_VISIBLE;
      return true;
    }
    tile = tile.parent;
  }
  return false;
}

/*
 * 递归查找将子级已加载瓦片作为占位符
 */
function getPlaceholderInChildren(tile: SourceTile) {
  tile.children.forEach((child) => {
    if (child.isLoaded) {
      child.properties.state |= TILE_STATE_VISIBLE;
    } else {
      getPlaceholderInChildren(child);
    }
  });
}
