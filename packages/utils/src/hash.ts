export function BKDRHash(str: string) {
  const seed = 131;
  const seed2 = 137;
  let hash = 0;
  str += 'x';
  const MAX_SAFE_INTEGER = Math.floor(9007199254740991 / seed2);
  for (let i = 0; i < str.length; i++) {
    if (hash > MAX_SAFE_INTEGER) {
      hash = Math.floor(hash / seed2);
    }
    hash = hash * seed + str.charCodeAt(i);
  }
  return hash;
}
export function djb2hash(str: string) {
  str = str.toString();
  let hash = 5381;
  let i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return hash >>> 0;
}

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
