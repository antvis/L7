import { Tile, TileLoadParams, TilesetManagerOptions } from '@antv/l7-utils';
import { IParserData, ITileParserCFG, RasterTileType } from '../interface';
import {
  defaultFormat,
  getTileBuffer,
  getMultiTileBuffer,
  getTileImage,
} from '../utils/getTile';

const DEFAULT_CONFIG: Partial<TilesetManagerOptions> = {
  tileSize: 256,
  minZoom: 0,
  maxZoom: Infinity,
  zoomOffset: 0,
};

export const rasterDataTypes = [
  RasterTileType.ARRAYBUFFER,
  RasterTileType.MultiArrayBuffer,
];

export default function rasterTile(
  data: string | string[],
  cfg?: ITileParserCFG,
): IParserData {
  const tileDataType: RasterTileType = cfg?.dataType || RasterTileType.IMAGE;
  const getTileData = (tileParams: TileLoadParams, tile: Tile) => {
    switch (tileDataType) {
      case RasterTileType.IMAGE:
        return getTileImage(data, tileParams, tile);
      case RasterTileType.ARRAYBUFFER:
        return getTileBuffer(
          data as string,
          tileParams,
          tile,
          cfg?.format || defaultFormat,
        );
      case RasterTileType.MultiArrayBuffer:
        return getMultiTileBuffer(
          data as string[],
          tileParams,
          tile,
          cfg?.format || defaultFormat,
        );
      default:
        return getTileImage(data, tileParams, tile);
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
