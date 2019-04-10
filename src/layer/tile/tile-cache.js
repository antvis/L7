import LRUCache from '../../util/lru-cache';
export default class TileCache {
  constructor(limit = 50) {
    this._cache = new LRUCache(limit);
  }

  getTile(z, x, y) {
    const key = this._generateKey(z, x, y);
    return this._cache.get(key);
  }

  setTile(tile, z, x, y) {
    const key = this._generateKey(z, x, y);
    this._cache.set(key, tile);
  }
  _generateKey(z, x, y) {
    return [ z, x, y ].join('_');
  }
  destory() {
    this._cache.clear();
  }
}
