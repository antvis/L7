import {
  FeatureCollection,
  Geometries,
  Properties,
} from '@turf/helpers';

import {  IParserData, ITileParserCFG } from '../interface';


export default function tile(
  data: FeatureCollection<Geometries, Properties>,
  cfg?: ITileParserCFG,
): IParserData {
   
  return {
    tileUrls: data,
    dataArray: [],
    ...getTileConfig(cfg)
  };
}

function getTileConfig(cfg?: ITileParserCFG) {
    const defaultTileConfig = {
        resolution: 'low',
        tileSize: 256,
        minZoom: 2,
        maxZoom: 17,
        zoomOffset: 0,
        extent: [-180, -85.051129, 180, 85.051129],
    }
    if(cfg) {
        const { resolution = 'low', tileSize = 256, minZoom = 2, maxZoom = 17, zoomOffset = 0, extent = [-180, -85.051129, 180, 85.051129] } = cfg
        defaultTileConfig.resolution = resolution;
        defaultTileConfig.tileSize = tileSize;
        defaultTileConfig.minZoom = minZoom;
        defaultTileConfig.maxZoom = maxZoom;
        defaultTileConfig.zoomOffset = zoomOffset;
        defaultTileConfig.extent = extent;
    }
    return defaultTileConfig;
}
