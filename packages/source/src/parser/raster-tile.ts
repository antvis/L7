import { ITileParserCFG, RasterTileType } from '@antv/l7-core';
import {
  ITileBand,
  SourceTile,
  TileLoadParams,
  TilesetManagerOptions,
} from '@antv/l7-utils';
import { IParserData } from '../interface';
import { getCustomData, getCustomImageData } from '../utils/tile/getCustomData';
import {
  defaultFormat,
  getTileBuffer,
  getTileImage,
} from '../utils/tile/getRasterTile';

const DEFAULT_CONFIG: Partial<TilesetManagerOptions> = {
  tileSize: 256,
  minZoom: 0,
  maxZoom: Infinity,
  zoomOffset: 0,
  warp: true,
};

export const rasterDataTypes = [RasterTileType.ARRAYBUFFER, RasterTileType.RGB];

function isUrlError(url: string | string[] | ITileBand[]) {
  if (Array.isArray(url) && url.length === 0) {
    return true;
  }
  if (!Array.isArray(url) && typeof url !== 'string') {
    return true;
  }
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
  cfg: Partial<ITileParserCFG> = {},
): IParserData {
  if (isUrlError(data)) {
    throw new Error('tile server url is error');
  }
  let tileDataType: RasterTileType = cfg?.dataType || RasterTileType.IMAGE;
  // Tip: RasterTileType.RGB 是彩色多通道的数据纹理，同样走数据纹理的请求
  if (tileDataType === RasterTileType.RGB) {
    tileDataType = RasterTileType.ARRAYBUFFER;
  }
  const getTileData = (tileParams: TileLoadParams, tile: SourceTile) => {
    switch (tileDataType) {
      case RasterTileType.IMAGE:
        return getTileImage(data as string | string[], tileParams, tile, cfg);
      case RasterTileType.CUSTOMIMAGE:
      case RasterTileType.CUSTOMTERRAINRGB:
        return getCustomImageData(
          // 自定义地形请求方式数据
          tile,
          // @ts-ignore
          cfg?.getCustomData,
        );
      case RasterTileType.ARRAYBUFFER:
        return getTileBuffer(
          data,
          tileParams,
          tile,
          cfg?.format || defaultFormat,
          cfg?.operation,
        );
      case RasterTileType.CUSTOMARRAYBUFFER:
      case RasterTileType.CUSTOMRGB:
        return getCustomData(
          tile,
          // @ts-ignore
          cfg?.getCustomData,
          cfg?.format || defaultFormat,
          cfg?.operation,
        );
      default:
        return getTileImage(data as string | string[], tileParams, tile, cfg);
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
