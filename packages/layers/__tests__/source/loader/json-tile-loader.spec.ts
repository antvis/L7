jest.mock('@antv/l7-utils', () => ({
  getData: jest.fn(),
  getURLFromTemplate: jest.fn((url: string, p: { x: number; y: number; z: number }) =>
    url.replace('{x}', String(p.x)).replace('{y}', String(p.y)).replace('{z}', String(p.z)),
  ),
}));

import type { ITileParserCFG } from '@antv/l7-core';
import type { SourceTile, TileLoadParams } from '@antv/l7-utils';
import { getData, getURLFromTemplate } from '@antv/l7-utils';
import { JsonTileLoader } from '../../../src/source/loader/json-tile-loader';

const tile = { x: 1, y: 2, z: 3 } as unknown as SourceTile;
const tileParams = {} as TileLoadParams;
const URL = 'http://t/{z}/{x}/{y}.json';

// jsonTile.loadTile uses tile.{x,y,z} for the URL template (params={x:1,y:2,z:3}),
// so a {z}/{x}/{y} template resolves to 'http://t/3/1/2.json'.
const EXPECTED_URL = 'http://t/3/1/2.json';

const pointFeature = (n: number) => ({
  type: 'Feature',
  properties: { id: n },
  geometry: { type: 'Point', coordinates: [n, n] },
});

describe('JsonTileLoader (stage 3.1)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('fetches via getData and unpacks JSON into defaultLayer features', async () => {
    const features = [pointFeature(1), pointFeature(2)];
    (getData as jest.Mock).mockImplementation((_p, cb) => cb(null, JSON.stringify(features)));

    const loader = new JsonTileLoader(URL);
    const src = await loader.loadTile(tileParams, tile);

    expect(src).toBeDefined();
    expect(getURLFromTemplate).toHaveBeenCalledWith(URL, { x: 1, y: 2, z: 3 });
    expect(getData).toHaveBeenCalledWith(
      expect.objectContaining({ url: EXPECTED_URL }),
      expect.any(Function),
    );
    expect(src!.getTileData('defaultLayer')).toEqual(features);
  });

  it('resolves an empty defaultLayer when getData errors', async () => {
    (getData as jest.Mock).mockImplementation((_p, cb) => cb(new Error('net'), null));

    const loader = new JsonTileLoader(URL);
    const src = await loader.loadTile(tileParams, tile);

    expect(src).toBeDefined();
    expect(src!.getTileData('defaultLayer')).toEqual([]);
  });

  it('resolves an empty defaultLayer when getData returns no data', async () => {
    (getData as jest.Mock).mockImplementation((_p, cb) => cb(null, null));

    const loader = new JsonTileLoader(URL);
    const src = await loader.loadTile(tileParams, tile);

    expect(src).toBeDefined();
    expect(src!.getTileData('defaultLayer')).toEqual([]);
  });

  it('routes through getCustomData when provided and unpacks its features', async () => {
    const features = [pointFeature(3)];
    const getCustomData = jest.fn(((
      _p: { x: number; y: number; z: number },
      cb: (err: any, data: any) => void,
    ) => cb(null, { features })) as ITileParserCFG['getCustomData']);

    const loader = new JsonTileLoader(URL, undefined, getCustomData);
    const src = await loader.loadTile(tileParams, tile);

    expect(getCustomData).toHaveBeenCalledWith({ x: 1, y: 2, z: 3 }, expect.any(Function));
    expect(getData).not.toHaveBeenCalled();
    expect(src!.getTileData('defaultLayer')).toEqual(features);
  });

  it('resolves an empty defaultLayer when getCustomData errors', async () => {
    const getCustomData = jest.fn(
      (_p: { x: number; y: number; z: number }, cb: (err: any, data: any) => void) =>
        cb(new Error('custom'), null),
    ) as unknown as ITileParserCFG['getCustomData'];

    const loader = new JsonTileLoader(URL, undefined, getCustomData);
    const src = await loader.loadTile(tileParams, tile);

    expect(src).toBeDefined();
    expect(src!.getTileData('defaultLayer')).toEqual([]);
  });

  it('spreads requestParameters into the getData request', async () => {
    (getData as jest.Mock).mockImplementation((_p, cb) => cb(null, JSON.stringify([])));
    const requestParameters = { headers: { Authorization: 'Bearer t' } };

    const loader = new JsonTileLoader(URL, requestParameters);
    await loader.loadTile(tileParams, tile);

    expect(getData).toHaveBeenCalledWith(
      expect.objectContaining({
        url: EXPECTED_URL,
        headers: { Authorization: 'Bearer t' },
      }),
      expect.any(Function),
    );
  });
});
