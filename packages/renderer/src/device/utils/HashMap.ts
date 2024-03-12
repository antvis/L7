// Jenkins One-at-a-Time hash from http://www.burtleburtle.net/bob/hash/doobs.html
export function hashCodeNumberUpdate(hash: number, v: number = 0): number {
  hash += v;
  hash += hash << 10;
  hash += hash >>> 6;
  return hash >>> 0;
}

export function hashCodeNumberFinish(hash: number): number {
  hash += hash << 3;
  hash ^= hash >>> 11;
  hash += hash << 15;
  return hash >>> 0;
}

// Pass this as a hash function to use a one-bucket HashMap (equivalent to linear search in an array),
// which can be efficient for small numbers of items.
export function nullHashFunc(): number {
  return 0;
}

export type EqualFunc<K> = (a: K, b: K) => boolean;
export type HashFunc<K> = (a: K) => number;

class HashBucket<K, V> {
  keys: K[] = [];
  values: V[] = [];
}

export class HashMap<K, V> {
  buckets = new Map<number, HashBucket<K, V>>();

  constructor(
    private keyEqualFunc: EqualFunc<K>,
    private keyHashFunc: HashFunc<K>,
  ) {}

  private findBucketIndex(bucket: HashBucket<K, V>, k: K): number {
    for (let i = 0; i < bucket.keys.length; i++)
      if (this.keyEqualFunc(k, bucket.keys[i])) return i;
    return -1;
  }

  private findBucket(k: K): HashBucket<K, V> | undefined {
    const bw = this.keyHashFunc(k);
    return this.buckets.get(bw);
  }

  get(k: K): V | null {
    const bucket = this.findBucket(k);
    if (bucket === undefined) return null;
    const bi = this.findBucketIndex(bucket, k);
    if (bi < 0) return null;
    return bucket.values[bi];
  }

  add(k: K, v: V): void {
    const bw = this.keyHashFunc(k);
    if (this.buckets.get(bw) === undefined)
      this.buckets.set(bw, new HashBucket<K, V>());
    const bucket = this.buckets.get(bw)!;
    bucket.keys.push(k);
    bucket.values.push(v);
  }

  delete(k: K): void {
    const bucket = this.findBucket(k);
    if (bucket === undefined) return;
    const bi = this.findBucketIndex(bucket, k);
    if (bi === -1) return;
    bucket.keys.splice(bi, 1);
    bucket.values.splice(bi, 1);
  }

  clear(): void {
    this.buckets.clear();
  }

  size(): number {
    let acc = 0;
    for (const bucket of this.buckets.values()) acc += bucket.values.length;
    return acc;
  }

  *values(): IterableIterator<V> {
    for (const bucket of this.buckets.values())
      for (let j = bucket.values.length - 1; j >= 0; j--)
        yield bucket.values[j];
  }
}
