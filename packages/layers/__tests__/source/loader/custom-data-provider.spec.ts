import type { ITileParserCFG } from '@antv/l7-core';
import type { SourceTile } from '@antv/l7-utils';
import { CustomDataProvider } from '../../../src/source/loader/custom-data-provider';

// provider 只包装「调用户 getCustomData 回调」原语 —— 入参从 tile.{x,y,z} 取
// （与 mvt/raster CUSTOM* 三消费点一致：均用 tile 不用 tileParams）。
const tile = { x: 1, y: 2, z: 3 } as unknown as SourceTile;

const makeFn = (
  impl: (p: { x: number; y: number; z: number }, cb: (err: any, data: any) => void) => void,
) => jest.fn(impl) as unknown as ITileParserCFG['getCustomData'];

describe('CustomDataProvider (stage 3.4)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetch resolves data when cb fires (err=null, data=buffer)', async () => {
    const buf = new ArrayBuffer(8);
    const fn = makeFn((_p, cb) => cb(null, buf));
    const provider = new CustomDataProvider(fn);

    await expect(provider.fetch(tile)).resolves.toBe(buf);
  });

  it('fetch rejects with err when cb fires (err=Error)', async () => {
    const boom = new Error('boom');
    const fn = makeFn((_p, cb) => cb(boom, null));
    const provider = new CustomDataProvider(fn);

    await expect(provider.fetch(tile)).rejects.toBe(boom);
  });

  it('fetch resolves undefined when cb fires (err=null, data=undefined) — provider does NOT empty-check (consumer job)', async () => {
    // 关键契约：provider 不做 empty 判定。cb(null, undefined) → err falsy →
    // resolve(undefined)。消费点在 .then 内各自用 !data / data.length===0 判空。
    const fn = makeFn((_p, cb) => cb(null, undefined));
    const provider = new CustomDataProvider(fn);

    await expect(provider.fetch(tile)).resolves.toBeUndefined();
  });

  it('fetch resolves empty array when cb fires (err=null, data=[]) — provider does NOT length-check', async () => {
    // 空 TypedArray / 空数组真值但 length===0 —— provider 透传，raster-buffer
    // 消费点 .then 内用 data.length===0 reject（raster-image 用 !data 不会 reject []）。
    const fn = makeFn((_p, cb) => cb(null, []));
    const provider = new CustomDataProvider(fn);

    await expect(provider.fetch(tile)).resolves.toEqual([]);
  });

  it('fetch calls user fn with {x,y,z} from tile (not tileParams) + a callback', async () => {
    const fn = makeFn((_p, cb) => cb(null, 'ok'));
    const provider = new CustomDataProvider(fn);

    await provider.fetch(tile);

    expect(fn).toHaveBeenCalledWith({ x: 1, y: 2, z: 3 }, expect.any(Function));
  });

  it('fetch settles when cb fires asynchronously (deferred)', async () => {
    const fn = makeFn((_p, cb) => setTimeout(() => cb(null, 'deferred'), 0));
    const provider = new CustomDataProvider(fn);

    await expect(provider.fetch(tile)).resolves.toBe('deferred');
  });
});
