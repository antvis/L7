import {
  getURLFromTemplate,
  Tile,
  TilesetManager,
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
  const config = { ...DEFAULT_CONFIG, ...cfg };
  const getTileData = (tile: Tile) => {
    const url = getURLFromTemplate(data, tile);
    return url;
  };
  const tilesetManager = new TilesetManager({
    ...config,
    getTileData,
  });

  return {
    url: data,
    tilesetManager,
    dataArray: [],
    ...config,
  };
}
