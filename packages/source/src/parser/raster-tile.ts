import {
  getURLFromTemplate,
  Tile,
  TilesetManagerOptions,
} from '@antv/l7-utils';
import { IParserData, IRasterTileParserCFG } from '../interface';

const DEFAULT_CONFIG: Partial<TilesetManagerOptions> = {
  tileSize: 256,
  minZoom: 0,
  maxZoom: Infinity,
  zoomOffset: 0,
  // TODO: extent wrapLng wrapLat
  extent: [-180, -85.051129, 180, 85.051129] as [
    number,
    number,
    number,
    number,
  ],
};

export default function rasterTile(
  data: string,
  cfg?: IRasterTileParserCFG,
): IParserData {
  const getTileData = (tile: Tile) => {
    const url = getURLFromTemplate(data, tile);
    return url;
  };
  const tilesetOptions = { ...DEFAULT_CONFIG, getTileData, ...cfg };

  return {
    url: data,
    dataArray: [],
    tilesetOptions,
  };
}
