import { Tile, TileLoadParams, TilesetManagerOptions, ITileBand } from '@antv/l7-utils';
import { IParserData, ITileParserCFG, RasterTileType } from '../interface';
import { defaultFormat, getTileBuffer, getTileImage } from '../utils/tile/getRasterTile';

const DEFAULT_CONFIG: Partial<TilesetManagerOptions> = {
  tileSize: 256,
  minZoom: 0,
  maxZoom: Infinity,
  zoomOffset: 0,
};

export const rasterDataTypes = [RasterTileType.ARRAYBUFFER];

function isUrlError(url: string | string[] | ITileBand[]) {
  if(Array.isArray(url) && url.length === 0) return true;
  if(!Array.isArray(url) && typeof url !== 'string') return true;
  return false;
}
/**
 *
 * @param data
 * @param cfg
 * @returns
 */
export default function rasterTile(
  data: string | string[] | ITileBand[],
  cfg?: ITileParserCFG,
): IParserData {
  if(isUrlError(data)) throw new Error('tile server url is error');

  const tileDataType: RasterTileType = cfg?.dataType || RasterTileType.IMAGE;
  const getTileData = (tileParams: TileLoadParams, tile: Tile) => {
    switch (tileDataType) {
      case RasterTileType.IMAGE:
        return getTileImage(data as (string | string[]), tileParams, tile);
      case RasterTileType.ARRAYBUFFER:
        return getTileBuffer(
          data,
          tileParams,
          tile,
          cfg?.format || defaultFormat,
          cfg?.operation,
        );
      default:
        return getTileImage(data as (string | string[]), tileParams, tile);
    }
  };

  const tilesetOptions = { ...DEFAULT_CONFIG, ...cfg, getTileData };

  return {
    data,
    dataArray: [],
    tilesetOptions,
    isTile: true,
  };
}
