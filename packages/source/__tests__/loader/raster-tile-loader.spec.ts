jest.mock('../../src/utils/tile/getRasterTile', () => ({
  getTileImage: jest.fn(),
  getTileBuffer: jest.fn(),
  defaultFormat: jest.fn(),
}));

jest.mock('../../src/utils/tile/getCustomData', () => ({
  getCustomData: jest.fn(),
  getCustomImageData: jest.fn(),
}));

import type { ITileParserCFG } from '@antv/l7-core';
import { RasterTileType } from '@antv/l7-core';
import type { SourceTile, TileLoadParams } from '@antv/l7-utils';
import { RasterTileLoader } from '../../src/loader/raster-tile-loader';
import { getCustomData, getCustomImageData } from '../../src/utils/tile/getCustomData';
import { defaultFormat, getTileBuffer, getTileImage } from '../../src/utils/tile/getRasterTile';

// 关键差异点（raster 是第 4 种 tile/tileParams 混用形态，勿与矢量统一）：
// - IMAGE / ARRAYBUFFER：同时用 tileParams（URL 模板）+ tile（xhrCancel）
// - CUSTOM*：只用 tile（{x,y,z}），不用 tileParams
// 两组故意取不同值以精确锁死该契约。
const tile = { x: 1, y: 2, z: 3 } as unknown as SourceTile;
const tileParams = { x: 10, y: 20, z: 30 } as TileLoadParams;
const URL = 'http://t/{z}/{x}/{y}.png';
const DATA: string[] = [URL];

const getCustomDataFunc = jest.fn() as unknown as ITileParserCFG['getCustomData'];

describe('RasterTileLoader (stage 3.2.1)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('IMAGE 路由到 getTileImage(data, tileParams, tile, cfg) 并透传返回值', async () => {
    const img = { tag: 'image' };
    (getTileImage as jest.Mock).mockResolvedValue(img);

    const loader = new RasterTileLoader(DATA, RasterTileType.IMAGE, {});
    const result = await loader.loadTile(tileParams, tile);

    // IMAGE 同时用 tileParams + tile —— 锁死「双参」契约
    expect(getTileImage).toHaveBeenCalledWith(DATA, tileParams, tile, {});
    expect(getTileBuffer).not.toHaveBeenCalled();
    expect(getCustomData).not.toHaveBeenCalled();
    expect(getCustomImageData).not.toHaveBeenCalled();
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

  it('CUSTOMIMAGE 与 CUSTOMTERRAINRGB 都路由到 getCustomImageData(tile, getCustomData)', async () => {
    const img = { tag: 'custom-image' };
    (getCustomImageData as jest.Mock).mockResolvedValue(img);
    const cfg = { getCustomData: getCustomDataFunc };

    // CUSTOMIMAGE
    const loader1 = new RasterTileLoader(DATA, RasterTileType.CUSTOMIMAGE, cfg);
    const r1 = await loader1.loadTile(tileParams, tile);
    expect(getCustomImageData).toHaveBeenCalledWith(tile, getCustomDataFunc);
    expect(r1).toBe(img);
    // CUSTOM* 只用 tile（{x,y,z}=1,2,3），不传 tileParams
    expect(getCustomImageData).not.toHaveBeenCalledWith(tileParams, expect.anything());

    // CUSTOMTERRAINRGB —— 与 CUSTOMIMAGE 同路径，仅 dataType 不同
    jest.clearAllMocks();
    (getCustomImageData as jest.Mock).mockResolvedValue(img);
    const loader2 = new RasterTileLoader(DATA, RasterTileType.CUSTOMTERRAINRGB, cfg);
    const r2 = await loader2.loadTile(tileParams, tile);
    expect(getCustomImageData).toHaveBeenCalledWith(tile, getCustomDataFunc);
    expect(r2).toBe(img);
    expect(getTileImage).not.toHaveBeenCalled();
  });

  it('CUSTOMARRAYBUFFER 与 CUSTOMRGB 都路由到 getCustomData(tile, getCustomData, defaultFormat, operation)', async () => {
    const raster = { tag: 'raster' };
    (getCustomData as jest.Mock).mockResolvedValue(raster);
    const cfg = { getCustomData: getCustomDataFunc, operation: 'add' };

    // CUSTOMARRAYBUFFER（cfg.format 未提供 → 传 defaultFormat）
    const loader1 = new RasterTileLoader(DATA, RasterTileType.CUSTOMARRAYBUFFER, cfg);
    const r1 = await loader1.loadTile(tileParams, tile);
    expect(getCustomData).toHaveBeenCalledWith(tile, getCustomDataFunc, defaultFormat, 'add');
    expect(r1).toBe(raster);
    // CUSTOM* 只用 tile，不传 tileParams
    expect(getCustomData).not.toHaveBeenCalledWith(
      tileParams,
      expect.anything(),
      expect.anything(),
      expect.anything(),
    );

    // CUSTOMRGB —— 与 CUSTOMARRAYBUFFER 同路径，仅 dataType 不同
    jest.clearAllMocks();
    (getCustomData as jest.Mock).mockResolvedValue(raster);
    const loader2 = new RasterTileLoader(DATA, RasterTileType.CUSTOMRGB, cfg);
    const r2 = await loader2.loadTile(tileParams, tile);
    expect(getCustomData).toHaveBeenCalledWith(tile, getCustomDataFunc, defaultFormat, 'add');
    expect(r2).toBe(raster);
  });

  it('CUSTOMARRAYBUFFER: cfg.format 提供时传 cfg.format，否则传 defaultFormat', async () => {
    (getCustomData as jest.Mock).mockResolvedValue({});
    const customFormat = jest.fn();

    // 提供 cfg.format
    const loader1 = new RasterTileLoader(DATA, RasterTileType.CUSTOMARRAYBUFFER, {
      getCustomData: getCustomDataFunc,
      format: customFormat,
    });
    await loader1.loadTile(tileParams, tile);
    expect(getCustomData).toHaveBeenCalledWith(tile, getCustomDataFunc, customFormat, undefined);

    // 未提供 cfg.format → defaultFormat（与 mocked 模块同一引用）
    jest.clearAllMocks();
    (getCustomData as jest.Mock).mockResolvedValue({});
    const loader2 = new RasterTileLoader(DATA, RasterTileType.CUSTOMARRAYBUFFER, {
      getCustomData: getCustomDataFunc,
    });
    await loader2.loadTile(tileParams, tile);
    expect(getCustomData).toHaveBeenCalledWith(tile, getCustomDataFunc, defaultFormat, undefined);
  });

  it('未知 dataType 走 default 分支路由到 getTileImage（兜底）', async () => {
    (getTileImage as jest.Mock).mockResolvedValue({ tag: 'default' });

    // 用一个不在 switch 命中的 enum 值（TERRAINRGB 既非 CUSTOM* 也非 ARRAYBUFFER/IMAGE）
    const loader = new RasterTileLoader(DATA, RasterTileType.TERRAINRGB, {});
    const result = await loader.loadTile(tileParams, tile);

    expect(getTileImage).toHaveBeenCalledWith(DATA, tileParams, tile, {});
    expect(getTileBuffer).not.toHaveBeenCalled();
    expect(result).toEqual({ tag: 'default' });
  });
});
