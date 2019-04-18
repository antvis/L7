import LRUCache from '../../util/lru-cache';
export default class TileCache {
  constructor(limit = 500) {
    this._cache = new LRUCache(limit);
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
}
