/**
 * LRU Cache class with limit
 *
 * Update order for each get/set operation
 * Delete oldest when reach given limit
 */

export default class LRUCache {
  public limit: number;
  public order: any[];
  public cache: any;
  public destroy: any;
  constructor(limit = 50, destroy = () => '') {
    this.limit = limit;
    this.destroy = destroy;
    this.order = [];
    this.clear();
  }

  public clear() {
    this.order.forEach((key: any) => {
      this.delete(key);
    });
    this.cache = {};
    // access/update order, first item is oldest, last item is newest
    this.order = [];
  }

  public get(key: string) {
    const value = this.cache[key];
    if (value) {
      // update order
      this.deleteOrder(key);
      this.appendOrder(key);
    }
    return value;
  }

  public set(key: string, value: any) {
    if (!this.cache[key]) {
      // if reach limit, delete the oldest
      if (Object.keys(this.cache).length === this.limit) {
        this.delete(this.order[0]);
      }

      this.cache[key] = value;
      this.appendOrder(key);
    } else {
      // if found in cache, delete the old one, insert new one to the first of list
      this.delete(key);

      this.cache[key] = value;
      this.appendOrder(key);
    }
  }

  public delete(key: string) {
    const value = this.cache[key];
    if (value) {
      this.deleteCache(key);
      this.deleteOrder(key);
      this.destroy(value, key);
    }
  }

  public deleteCache(key: string) {
    delete this.cache[key];
  }

  public deleteOrder(key: string) {
    const index = this.order.findIndex((o) => o === key);
    if (index >= 0) {
      this.order.splice(index, 1);
    }
  }

  public appendOrder(key: string) {
    this.order.push(key);
  }
}
