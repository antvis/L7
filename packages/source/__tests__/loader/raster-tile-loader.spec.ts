jest.mock('../../src/utils/tile/getRasterTile', () => ({
  getTileImage: jest.fn(),
  getTileBuffer: jest.fn(),
  defaultFormat: jest.fn(),
}));

// ⚠️ 用 requireActual 展开 + 覆盖 formatImage：raster spec 经 RasterTileType
// 值导入拉起 @antv/l7-core/index → 其 BasePostProcessingPass 从 l7-utils 解构
// lodashUtil/gl 等；若整模块只导 formatImage，core 侧解构 undefined 报错。故
// 保留真实 l7-utils，仅覆盖 loader 直接消费的 formatImage。
jest.mock('@antv/l7-utils', () => ({
  ...jest.requireActual('@antv/l7-utils'),
  formatImage: jest.fn(),
}));

jest.mock('../../src/utils/bandOperation/bands', () => ({
  processRasterData: jest.fn(),
}));

import type { ITileParserCFG } from '@antv/l7-core';
import { RasterTileType } from '@antv/l7-core';
import type { SourceTile, TileLoadParams } from '@antv/l7-utils';
import { formatImage } from '@antv/l7-utils';
import { RasterTileLoader } from '../../src/loader/raster-tile-loader';
import { processRasterData } from '../../src/utils/bandOperation/bands';
import { defaultFormat, getTileBuffer, getTileImage } from '../../src/utils/tile/getRasterTile';

// 关键差异点（raster 是第 4 种 tile/tileParams 混用形态，勿与矢量统一）：
// - IMAGE / ARRAYBUFFER：同时用 tileParams（URL 模板）+ tile（xhrCancel）
// - CUSTOM*：只用 tile（{x,y,z} 传用户 getCustomData 回调），不用 tileParams
// 两组故意取不同值以精确锁死该契约（CUSTOM* 经 CustomDataProvider.fetch(tile)
// 调用户回调，入参从 tile 取）。
const tile = { x: 1, y: 2, z: 3 } as unknown as SourceTile;
const tileParams = { x: 10, y: 20, z: 30 } as TileLoadParams;
const URL = 'http://t/{z}/{x}/{y}.png';
const DATA: string[] = [URL];

const makeFn = (
  impl: (p: { x: number; y: number; z: number }, cb: (err: any, data: any) => void) => void,
) => jest.fn(impl) as unknown as ITileParserCFG['getCustomData'];

// resetAllMocks（非 clearAllMocks）：清 mockImplementation/mockReturnValue 防跨
// case 泄露（见阶段 3.3 image-loader spec 流程教训）。
describe('RasterTileLoader (stage 3.2.1 / 3.4)', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // ---------- IMAGE / ARRAYBUFFER：双用 tileParams + tile（不变，走 getRasterTile）----------

  it('IMAGE 路由到 getTileImage(data, tileParams, tile, cfg) 并透传返回值', async () => {
    const img = { tag: 'image' };
    (getTileImage as jest.Mock).mockResolvedValue(img);

    const loader = new RasterTileLoader(DATA, RasterTileType.IMAGE, {});
    const result = await loader.loadTile(tileParams, tile);

    expect(getTileImage).toHaveBeenCalledWith(DATA, tileParams, tile, {});
    expect(getTileBuffer).not.toHaveBeenCalled();
    expect(result).toBe(img);
  });

  it('ARRAYBUFFER 路由到 getTileBuffer(data, tileParams, tile, cfg) 并透传返回值', async () => {
    const buf = { tag: 'buffer' };
    (getTileBuffer as jest.Mock).mockResolvedValue(buf);

    const loader = new RasterTileLoader(DATA, RasterTileType.ARRAYBUFFER, {});
    const result = await loader.loadTile(tileParams, tile);

    expect(getTileBuffer).toHaveBeenCalledWith(DATA, tileParams, tile, {});
    expect(getTileImage).not.toHaveBeenCalled();
    expect(result).toBe(buf);
  });

  it('未知 dataType 走 default 分支路由到 getTileImage（兜底）', async () => {
    (getTileImage as jest.Mock).mockResolvedValue({ tag: 'default' });

    // TERRAINRGB 既非 CUSTOM* 也非 ARRAYBUFFER/IMAGE，落 default
    const loader = new RasterTileLoader(DATA, RasterTileType.TERRAINRGB, {});
    const result = await loader.loadTile(tileParams, tile);

    expect(getTileImage).toHaveBeenCalledWith(DATA, tileParams, tile, {});
    expect(result).toEqual({ tag: 'default' });
  });

  // ---------- CUSTOMIMAGE / CUSTOMTERRAINRGB：经 provider + formatImage / HTMLImageElement ----------

  it('CUSTOMIMAGE: cb(null, ArrayBuffer) → formatImage 解码 → resolve image（入参用 tile 不用 tileParams）', async () => {
    const buf = new ArrayBuffer(8);
    const img = { tag: 'img' };
    (formatImage as jest.Mock).mockImplementation((_d, cb) => cb(null, img));
    const fn = makeFn((_p, cb) => cb(null, buf));

    const loader = new RasterTileLoader(DATA, RasterTileType.CUSTOMIMAGE, { getCustomData: fn });
    const result = await loader.loadTile(tileParams, tile);

    // CUSTOM* 入参用 tile（{x:1,y:2,z:3}），不是 tileParams
    expect(fn).toHaveBeenCalledWith({ x: 1, y: 2, z: 3 }, expect.any(Function));
    expect(formatImage).toHaveBeenCalledWith(buf, expect.any(Function));
    expect(getTileImage).not.toHaveBeenCalled();
    expect(result).toBe(img);
  });

  it('CUSTOMTERRAINRGB: 与 CUSTOMIMAGE 同路径（仅 dataType 不同）', async () => {
    const buf = new ArrayBuffer(8);
    const img = { tag: 'img' };
    (formatImage as jest.Mock).mockImplementation((_d, cb) => cb(null, img));
    const fn = makeFn((_p, cb) => cb(null, buf));

    const loader = new RasterTileLoader(DATA, RasterTileType.CUSTOMTERRAINRGB, {
      getCustomData: fn,
    });
    const result = await loader.loadTile(tileParams, tile);

    expect(fn).toHaveBeenCalledWith({ x: 1, y: 2, z: 3 }, expect.any(Function));
    expect(formatImage).toHaveBeenCalledWith(buf, expect.any(Function));
    expect(result).toBe(img);
  });

  it('CUSTOMIMAGE: cb(null, HTMLImageElement) → 直传 resolve，不调 formatImage', async () => {
    const el = document.createElement('img');
    const fn = makeFn((_p, cb) => cb(null, el));

    const loader = new RasterTileLoader(DATA, RasterTileType.CUSTOMIMAGE, { getCustomData: fn });
    const result = await loader.loadTile(tileParams, tile);

    expect(formatImage).not.toHaveBeenCalled();
    expect(result).toBe(el);
  });

  it('CUSTOMIMAGE: formatImage 解码出错 → reject(error)', async () => {
    const buf = new ArrayBuffer(8);
    (formatImage as jest.Mock).mockImplementation((_d, cb) => cb(new Error('decode'), null));
    const fn = makeFn((_p, cb) => cb(null, buf));

    const loader = new RasterTileLoader(DATA, RasterTileType.CUSTOMIMAGE, { getCustomData: fn });

    await expect(loader.loadTile(tileParams, tile)).rejects.toThrow('decode');
  });

  it('CUSTOMIMAGE: cb(null, null) → !data → reject(undefined)', async () => {
    const fn = makeFn((_p, cb) => cb(null, null));

    const loader = new RasterTileLoader(DATA, RasterTileType.CUSTOMIMAGE, { getCustomData: fn });

    await expect(loader.loadTile(tileParams, tile)).rejects.toBeUndefined();
    expect(formatImage).not.toHaveBeenCalled();
  });

  it('CUSTOMIMAGE: cb(err, null) → provider reject(err) 透传', async () => {
    const fn = makeFn((_p, cb) => cb(new Error('custom'), null));

    const loader = new RasterTileLoader(DATA, RasterTileType.CUSTOMIMAGE, { getCustomData: fn });

    await expect(loader.loadTile(tileParams, tile)).rejects.toThrow('custom');
    expect(formatImage).not.toHaveBeenCalled();
  });

  it('CUSTOMIMAGE: cb(null, <truthy 非 ArrayBuffer/HTMLImageElement>) → reject(undefined)', async () => {
    // 迁移前 `else { reject(err) }`（err 此时 falsy → undefined）
    const fn = makeFn((_p, cb) => cb(null, 'weird-string'));

    const loader = new RasterTileLoader(DATA, RasterTileType.CUSTOMIMAGE, { getCustomData: fn });

    await expect(loader.loadTile(tileParams, tile)).rejects.toBeUndefined();
    expect(formatImage).not.toHaveBeenCalled();
  });

  // ---------- CUSTOMARRAYBUFFER / CUSTOMRGB：经 provider + processRasterData ----------

  it('CUSTOMARRAYBUFFER: cb(null, ArrayBuffer) → processRasterData([{data,bands:[0]}], defaultFormat, operation, cb)', async () => {
    const buf = new ArrayBuffer(16);
    const raster = { tag: 'raster' };
    (processRasterData as jest.Mock).mockImplementation((_files, _fmt, _op, cb) =>
      cb(null, raster),
    );
    const fn = makeFn((_p, cb) => cb(null, buf));

    const loader = new RasterTileLoader(DATA, RasterTileType.CUSTOMARRAYBUFFER, {
      getCustomData: fn,
      operation: 'add',
    });
    const result = await loader.loadTile(tileParams, tile);

    // 入参用 tile（{x:1,y:2,z:3}）
    expect(fn).toHaveBeenCalledWith({ x: 1, y: 2, z: 3 }, expect.any(Function));
    const call = (processRasterData as jest.Mock).mock.calls[0];
    expect(call[0][0].data).toBe(buf);
    expect(call[0][0].bands).toEqual([0]);
    expect(call[1]).toBe(defaultFormat); // cfg.format 未提供 → defaultFormat
    expect(call[2]).toBe('add');
    expect(typeof call[3]).toBe('function');
    expect(getTileImage).not.toHaveBeenCalled();
    expect(result).toBe(raster);
  });

  it('CUSTOMRGB: 与 CUSTOMARRAYBUFFER 同路径（仅 dataType 不同）', async () => {
    const buf = new ArrayBuffer(16);
    const raster = { tag: 'raster' };
    (processRasterData as jest.Mock).mockImplementation((_f, _fmt, _op, cb) => cb(null, raster));
    const fn = makeFn((_p, cb) => cb(null, buf));

    const loader = new RasterTileLoader(DATA, RasterTileType.CUSTOMRGB, {
      getCustomData: fn,
      operation: 'add',
    });
    const result = await loader.loadTile(tileParams, tile);

    expect(fn).toHaveBeenCalledWith({ x: 1, y: 2, z: 3 }, expect.any(Function));
    expect((processRasterData as jest.Mock).mock.calls[0][0][0].data).toBe(buf);
    expect(result).toBe(raster);
  });

  it('CUSTOMARRAYBUFFER: cfg.format 提供时传 cfg.format，否则 defaultFormat', async () => {
    const buf = new ArrayBuffer(16);
    (processRasterData as jest.Mock).mockImplementation((_f, _fmt, _op, cb) => cb(null, {}));

    // 提供 cfg.format
    const customFormat = jest.fn();
    const loader1 = new RasterTileLoader(DATA, RasterTileType.CUSTOMARRAYBUFFER, {
      getCustomData: makeFn((_p, cb) => cb(null, buf)),
      format: customFormat,
    });
    await loader1.loadTile(tileParams, tile);
    expect((processRasterData as jest.Mock).mock.calls[0][1]).toBe(customFormat);

    // 未提供 cfg.format → defaultFormat（与 mocked 模块同一引用）
    jest.resetAllMocks();
    (processRasterData as jest.Mock).mockImplementation((_f, _fmt, _op, cb) => cb(null, {}));
    const loader2 = new RasterTileLoader(DATA, RasterTileType.CUSTOMARRAYBUFFER, {
      getCustomData: makeFn((_p, cb) => cb(null, buf)),
    });
    await loader2.loadTile(tileParams, tile);
    expect((processRasterData as jest.Mock).mock.calls[0][1]).toBe(defaultFormat);
  });

  it('CUSTOMARRAYBUFFER: cb(null, []) → data.length===0 → reject(undefined)（非 !data 语义）', async () => {
    // 空 TypedArray / 空数组真值但 length===0 —— raster-buffer 独有 reject 语义
    const fn = makeFn((_p, cb) => cb(null, []));

    const loader = new RasterTileLoader(DATA, RasterTileType.CUSTOMARRAYBUFFER, {
      getCustomData: fn,
    });

    await expect(loader.loadTile(tileParams, tile)).rejects.toBeUndefined();
    expect(processRasterData).not.toHaveBeenCalled();
  });

  it('CUSTOMARRAYBUFFER: cb(err, null) → provider reject(err) 透传', async () => {
    const fn = makeFn((_p, cb) => cb(new Error('custom'), null));

    const loader = new RasterTileLoader(DATA, RasterTileType.CUSTOMARRAYBUFFER, {
      getCustomData: fn,
    });

    await expect(loader.loadTile(tileParams, tile)).rejects.toThrow('custom');
    expect(processRasterData).not.toHaveBeenCalled();
  });

  it('CUSTOMARRAYBUFFER: processRasterData 解码出错 → reject(error)', async () => {
    const buf = new ArrayBuffer(16);
    (processRasterData as jest.Mock).mockImplementation((_f, _fmt, _op, cb) =>
      cb(new Error('bands'), null),
    );
    const fn = makeFn((_p, cb) => cb(null, buf));

    const loader = new RasterTileLoader(DATA, RasterTileType.CUSTOMARRAYBUFFER, {
      getCustomData: fn,
    });

    await expect(loader.loadTile(tileParams, tile)).rejects.toThrow('bands');
  });
});
