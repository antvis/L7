import type { ITileParserCFG } from '@antv/l7-core';
import { RasterTileType } from '@antv/l7-core';
import type { ITileBand, SourceTile, TileLoadParams, TilesetManagerOptions } from '@antv/l7-utils';
import type { IParserData } from '../interface';
import { RasterTileLoader } from '../loader/raster-tile-loader';
import { extentToCoord } from '../utils/util';

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

  const { extent = [Infinity, Infinity, -Infinity, -Infinity], coordinates } = cfg;

  let tileDataType: RasterTileType = cfg?.dataType || RasterTileType.IMAGE;
  // Tip, RasterTileType.RGB 是彩色多通道的数据纹理，同样走数据纹理的请求
  if (tileDataType === RasterTileType.RGB) {
    tileDataType = RasterTileType.ARRAYBUFFER;
  }

  // 取数分发下沉 loader（阶段 3.2.1）；parser 只做 config 形状组装（isUrlError
  // guard / RGB→ARRAYBUFFER 归并 / DEFAULT_CONFIG 合并 / extent·coordinates）
  // — 与 mvt/jsonTile/geojsonvt 同构：parser=形状转换、loader=数据获取
  const loader = new RasterTileLoader(data, tileDataType, cfg);
  const getTileData = (tileParams: TileLoadParams, tile: SourceTile) =>
    loader.loadTile(tileParams, tile);

  const tilesetOptions = { ...DEFAULT_CONFIG, ...cfg, getTileData };
  const rasterTileCoord = extentToCoord(coordinates, extent);

  return {
    data,
    dataArray: [
      {
        _id: 1,
        coordinates: rasterTileCoord,
      },
    ],
    tilesetOptions,
    isTile: true,
  };
}
