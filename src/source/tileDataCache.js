import LRUCache from '../util/lru-cache';
export default class TileDataCache {
  constructor(limit = 50, tileDestroy) {
    this._cache = new LRUCache(limit, tileDestroy);
  }

  getTile(key) {
    return this._cache.get(key);
  }

  setTile(tile, key) {
    this._cache.set(key, tile);
  }
  removeTile(key) {
    return this._cache.delete(key);
  }
  destory() {
    this._cache.clear();
  }
}
