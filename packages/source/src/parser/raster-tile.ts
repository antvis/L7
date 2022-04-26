import { IParserData, IRasterTileParserCFG } from '../interface';

export default function rasterTile(
  data: string,
  cfg?: IRasterTileParserCFG,
): IParserData {
  return {
    url: data,
    dataArray: [],
    ...getTileConfig(cfg),
  };
}

function getTileConfig(cfg?: IRasterTileParserCFG) {
  const defaultTileConfig = {
    tileSize: 256,
    minZoom: 2,
    maxZoom: 17,
    zoomOffset: 0,
    extent: [-180, -85.051129, 180, 85.051129],
  };

  if (cfg) {
    Object.assign(defaultTileConfig, cfg);
  }

  return defaultTileConfig;
}
