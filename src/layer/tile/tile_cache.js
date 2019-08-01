import LRUCache from '../../util/lru-cache';
export default class TileCache {
  constructor(limit = 50, tileDestroy) {
    this._cache = new LRUCache(limit, tileDestroy);
  }

  getTile(key) {
    return this._cache.get(key);
  }

  setTile(tile, key) {
    this._cache.set(key, tile);
  }
  destory() {
    this._cache.clear();
  }
  setNeedUpdate() {
    this._cache._order.forEach(key => {
      const tile = this._cache.get(key);
      tile.needUpdate = true;
    });
  }
}
