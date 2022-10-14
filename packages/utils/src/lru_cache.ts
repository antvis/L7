/**
 * LRU Cache class with limit
 *
 * Update order for each get/set operation
 * Delete oldest when reach given limit
 */
type callback = (...args: any[]) => void;
interface ICache {
  [key: string]: any;
}
export class LRUCache {
  private limit: number;
  private cache: ICache;
  private destroy: (value: any, key: string) => void;
  private order: any[];
  constructor(limit = 50, destroy?: callback) {
    this.limit = limit;
    this.destroy = destroy || this.defaultDestroy;
    this.order = [];
    this.clear();
  }

  public clear() {
    this.order.forEach((key) => {
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

  private deleteCache(key: string) {
    delete this.cache[key];
  }

  private deleteOrder(key: string) {
    const index = this.order.findIndex((o) => o === key);
    if (index >= 0) {
      this.order.splice(index, 1);
    }
  }

  private appendOrder(key: string) {
    this.order.push(key);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private defaultDestroy(value: any, key: string) {
    return null;
  }
}
