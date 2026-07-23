import type { IRasterFileData } from '../../src/interface';
import raster from '../../src/parser/raster';
import rasterRgb from '../../src/parser/rasterRgb';

const DEFAULT_EXTENT = [121.168, 30.2828, 121.384, 30.4219] as [number, number, number, number];

describe('parser.raster (stage 6.2)', () => {
  it('number[] 直传（格式未提供）→ data=Array.from、width/height/min/max 透传、默认 extent 4 角', () => {
    const raw = [1, 2, 3, 4];
    const result = raster(raw, { width: 2, height: 2, min: 0, max: 255 });
    expect(result._id).toEqual(1);
    expect(result.dataArray.length).toEqual(1);
    const cell = result.dataArray[0];
    expect(cell._id).toEqual(1);
    expect(cell.data).toEqual([1, 2, 3, 4]);
    expect(cell.width).toEqual(2);
    expect(cell.height).toEqual(2);
    expect(cell.min).toEqual(0);
    expect(cell.max).toEqual(255);
    // 默认 extent → 4 角（左上、右上、右下、左下）
    expect(cell.coordinates).toEqual([
      [DEFAULT_EXTENT[0], DEFAULT_EXTENT[3]],
      [DEFAULT_EXTENT[2], DEFAULT_EXTENT[3]],
      [DEFAULT_EXTENT[2], DEFAULT_EXTENT[1]],
      [DEFAULT_EXTENT[0], DEFAULT_EXTENT[1]],
    ]);
  });

  it('number[] 直传 + 自定义 extent → 4 角由自定义 extent 派生', () => {
    const result = raster([1, 2], {
      extent: [0, 0, 10, 20],
      width: 2,
      height: 1,
      min: 0,
      max: 255,
    });
    expect(result.dataArray[0].coordinates).toEqual([
      [0, 20],
      [10, 20],
      [10, 0],
      [0, 0],
    ]);
  });

  it('number[] 直传 + 自定义 coordinates → extentToCoord 原样返回（非矩形支持）', () => {
    const coords: [[number, number], [number, number], [number, number], [number, number]] = [
      [0, 0],
      [2, 1],
      [3, 0],
      [1, -1],
    ];
    const result = raster([1], { coordinates: coords, width: 1, height: 1, min: 0, max: 255 });
    expect(result.dataArray[0].coordinates).toEqual(coords);
  });

  it('number[] 即便提供 format 仍走直传路径（isNumberArray 优先于 format 判定）', () => {
    const fmt = jest.fn();
    const result = raster([1, 2], { format: fmt as any, width: 2, height: 1, min: 0, max: 255 });
    expect(result.dataArray[0].data).toEqual([1, 2]);
    expect(fmt).not.toHaveBeenCalled();
  });

  it('ArrayBuffer 路径（format 提供）→ bandsOperation 产 Promise 进 data（既存异步契约，消费方 await）', async () => {
    const mockFormat = jest.fn(async () => ({
      rasterData: new Uint8Array([10, 20, 30]),
      width: 3,
      height: 1,
    }));
    const file: IRasterFileData = { data: new ArrayBuffer(3), bands: [0] };
    const result = raster(file, {
      format: mockFormat as any,
      operation: undefined,
      width: 3,
      height: 1,
      min: 0,
      max: 255,
    });
    const cell = result.dataArray[0];
    expect(cell.data).toBeInstanceOf(Promise);
    const band = await cell.data;
    expect(band.rasterData).toEqual(new Uint8Array([10, 20, 30]));
    expect(band.width).toEqual(3);
    expect(band.height).toEqual(1);
    expect(mockFormat).toHaveBeenCalledWith(new ArrayBuffer(3), [0]);
    // arraybuffer 分支不设置 rasterWidth/rasterHeight（既存行为：数组维度由 band 结果携带）
    expect(cell.width).toBeUndefined();
    expect(cell.height).toBeUndefined();
  });

  it('ArrayBuffer[] 数组 → 包装为 IRasterFileData[] 走同一 bandsOperation 路径', async () => {
    const mockFormat = jest.fn(async () => ({
      rasterData: new Uint8Array([1]),
      width: 1,
      height: 1,
    }));
    const result = raster([{ data: new ArrayBuffer(1), bands: [0] }], {
      format: mockFormat as any,
      width: 1,
      height: 1,
      min: 0,
      max: 255,
    });
    await result.dataArray[0].data;
    expect(mockFormat).toHaveBeenCalledTimes(1);
  });
});

describe('parser.rasterRgb (stage 6.2)', () => {
  it('number[] 直传 → data=Array.from + 附加 rest cfg 字段透传（rasterRgb 用 rest 展开）', () => {
    const result = rasterRgb([5, 10, 15], {
      width: 3,
      height: 1,
      min: 0,
      max: 255,
      coordinates: [
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0],
      ],
    });
    const cell = result.dataArray[0];
    expect(cell.data).toEqual([5, 10, 15]);
    expect(cell.width).toEqual(3);
    expect(cell.height).toEqual(1);
    expect(cell.coordinates).toEqual([
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0],
    ]);
  });
});
