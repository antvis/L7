jest.mock('@antv/l7-utils', () => ({
  getArrayBuffer: jest.fn(),
  getURLFromTemplate: jest.fn((url: string, p: { x: number; y: number; z: number }) =>
    url.replace('{x}', String(p.x)).replace('{y}', String(p.y)).replace('{z}', String(p.z)),
  ),
}));

jest.mock('../../../src/source/tile-source/mvt', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import type { ITileParserCFG } from '@antv/l7-core';
import type { SourceTile, TileLoadParams } from '@antv/l7-utils';
import { getArrayBuffer, getURLFromTemplate } from '@antv/l7-utils';
import { MVTLoader } from '../../../src/source/loader/mvt-loader';
import MVTSource from '../../../src/source/tile-source/mvt';

// 关键差异点（阶段 3.1.2 风险①③）：mvt 用 `tileParams`(TileLoadParams)
// 做 URL 模板插值，但用 `tile.x/y/z`(SourceTile) 做 getCustomData 入参与
// MVTSource 构造。两组故意取不同值以精确锁死该差异。
const tile = { x: 1, y: 2, z: 3 } as unknown as SourceTile;
const tileParams = { x: 10, y: 20, z: 30 } as TileLoadParams;
const URL = 'http://t/{z}/{x}/{y}.pbf';
// getURLFromTemplate 用 tileParams={x:10,y:20,z:30} → {z}/{x}/{y}=30/10/20
const EXPECTED_URL = 'http://t/30/10/20.pbf';

const features = [
  { type: 'Feature', properties: { id: 1 }, geometry: { type: 'Point', coordinates: [1, 2] } },
];

const mockMVTSource = () => {
  (MVTSource as jest.Mock).mockImplementation(
    (data: ArrayBuffer, x: number, y: number, z: number) => ({
      data,
      x,
      y,
      z,
      getTileData: jest.fn(() => features),
    }),
  );
};

describe('MVTLoader (stage 3.1.2)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMVTSource();
    // 隔离：tile 是跨 case 共享的可变对象，getArrayBuffer 分支会写
    // tile.xhrCancel，需在每条 case 前重置以避免泄露到 getCustomData case。
    delete (tile as SourceTile).xhrCancel;
  });

  it('fetches via getArrayBuffer, templates URL from tileParams (not tile.xyz), constructs MVTSource with tile.xyz', async () => {
    const buf = new ArrayBuffer(8);
    (getArrayBuffer as jest.Mock).mockImplementation((_p, cb) => {
      cb(null, buf);
      return { cancel: jest.fn() };
    });

    const loader = new MVTLoader(URL);
    const src = await loader.loadTile(tileParams, tile);

    // URL 模板用 tileParams（{x:10,y:20,z:30}），不是 tile.xyz（1,2,3）
    expect(getURLFromTemplate).toHaveBeenCalledWith(URL, tileParams);
    expect(getArrayBuffer).toHaveBeenCalledWith(
      expect.objectContaining({ url: EXPECTED_URL }),
      expect.any(Function),
    );
    // MVTSource 构造用 tile.xyz（1,2,3），不是 tileParams
    expect(MVTSource).toHaveBeenCalledWith(buf, 1, 2, 3);
    expect(src).toBeDefined();
    expect(src!.getTileData('sourceLayer')).toEqual(features);
  });

  it('resolves undefined when getArrayBuffer errors (xhrCancel still set)', async () => {
    (getArrayBuffer as jest.Mock).mockImplementation((_p, cb) => {
      cb(new Error('net'), null);
      return { cancel: jest.fn() };
    });

    const loader = new MVTLoader(URL);
    const src = await loader.loadTile(tileParams, tile);

    expect(src).toBeUndefined();
    expect(MVTSource).not.toHaveBeenCalled();
    // xhrCancel 在 getArrayBuffer 返回后同步赋值，先于回调触发的错误
    expect(tile.xhrCancel).toEqual(expect.any(Function));
  });

  it('resolves undefined when getArrayBuffer returns no data', async () => {
    (getArrayBuffer as jest.Mock).mockImplementation((_p, cb) => {
      cb(null, null);
      return { cancel: jest.fn() };
    });

    const loader = new MVTLoader(URL);
    const src = await loader.loadTile(tileParams, tile);

    expect(src).toBeUndefined();
    expect(MVTSource).not.toHaveBeenCalled();
  });

  it('routes through getCustomData when provided (uses tile.xyz, no xhrCancel, skips getArrayBuffer)', async () => {
    const buf = new ArrayBuffer(8);
    const getCustomData = jest.fn(((
      _p: { x: number; y: number; z: number },
      cb: (err: any, data: any) => void,
    ) => cb(null, buf)) as unknown as ITileParserCFG['getCustomData']);

    const loader = new MVTLoader(URL, undefined, getCustomData);
    const src = await loader.loadTile(tileParams, tile);

    // getCustomData 入参用 tile.xyz（1,2,3），不是 tileParams（10,20,30）
    expect(getCustomData).toHaveBeenCalledWith({ x: 1, y: 2, z: 3 }, expect.any(Function));
    expect(getArrayBuffer).not.toHaveBeenCalled();
    expect(MVTSource).toHaveBeenCalledWith(buf, 1, 2, 3);
    expect(src).toBeDefined();
    expect(src!.getTileData('sourceLayer')).toEqual(features);
    // getCustomData 分支无 xhr 句柄，保持等价 —— 不设 xhrCancel
    expect(tile.xhrCancel).toBeUndefined();
  });

  it('resolves undefined when getCustomData errors (no xhrCancel)', async () => {
    const getCustomData = jest.fn(
      (_p: { x: number; y: number; z: number }, cb: (err: any, data: any) => void) =>
        cb(new Error('custom'), null),
    ) as unknown as ITileParserCFG['getCustomData'];

    const loader = new MVTLoader(URL, undefined, getCustomData);
    const src = await loader.loadTile(tileParams, tile);

    expect(src).toBeUndefined();
    expect(MVTSource).not.toHaveBeenCalled();
    expect(tile.xhrCancel).toBeUndefined();
  });

  it('spreads requestParameters into the getArrayBuffer request', async () => {
    (getArrayBuffer as jest.Mock).mockImplementation((_p, cb) => {
      cb(null, new ArrayBuffer(4));
      return { cancel: jest.fn() };
    });
    const requestParameters = { headers: { Authorization: 'Bearer t' } };

    const loader = new MVTLoader(URL, requestParameters);
    await loader.loadTile(tileParams, tile);

    expect(getArrayBuffer).toHaveBeenCalledWith(
      expect.objectContaining({
        url: EXPECTED_URL,
        headers: { Authorization: 'Bearer t' },
      }),
      expect.any(Function),
    );
  });
});
