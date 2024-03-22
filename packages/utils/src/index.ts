// @ts-ignore
export * from './ajax';
export * from './anchor';
export * from './color';
export * from './config';
export * from './cull';
export * as DOM from './dom';
export * from './env';
export * from './event';
export * from './geo';
export { BKDRHash, djb2hash, guid } from './hash';
export * from './lineAtOffset';
export * from './lodash-adapter';
export * from './lru_cache';
// export * from './mini-adapter/index';
export * as Satistics from './statistics';
export * from './tileset-manager';
export * from './interface/map'
export function defaultValue(v1:any,v2:any){
  if(v1===undefined||v1===null){
    return v2;
  }
  return v1;
}