import LRUCache from './lruCache';
export default class TileCache {
  public cache: any;
  constructor(limit = 50, tileDestroy: any) {
    this.cache = new LRUCache(limit, tileDestroy);
  }

  public getTile(key: string) {
    return this.cache.get(key);
  }

  public setTile(tile: any, key: string) {
    this.cache.set(key, tile);
  }
  public destory() {
    this.cache.clear();
  }
  public setNeedUpdate() {
    this.cache.order.forEach((key: string) => {
      const tile = this.cache.get(key);
      tile.needUpdate = true;
    });
  }
}
