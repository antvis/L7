import {
  IParserData,
  IRasterTileParserCFG,
  RasterTileType,
} from '../interface';
import {
  Tile,
  TileLoadParams,
  TilesetManagerOptions,
} from '../tileset-manager';
import { defaultFormat, getTileBuffer, getTileImage } from '../utils/getTile';

const DEFAULT_CONFIG: Partial<TilesetManagerOptions> = {
  tileSize: 256,
  minZoom: 0,
  maxZoom: Infinity,
  zoomOffset: 0,
};

export default function rasterTile(
  data: string,
  cfg?: IRasterTileParserCFG,
): IParserData {
  const tileDataType: RasterTileType = cfg?.dataType || RasterTileType.IMAGE;
  const getTileData = (tileParams: TileLoadParams, tile: Tile) => {
    if (tileDataType === RasterTileType.IMAGE) {
      return getTileImage(data, tileParams, tile);
    } else {
      return getTileBuffer(
        data,
        tileParams,
        tile,
        cfg?.format || defaultFormat,
      );
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
