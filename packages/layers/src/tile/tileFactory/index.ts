import { IParserCfg } from '@antv/l7-core';
import { rasterDataTypes } from '@antv/l7-source';
import VectorTile from './vectortile';
import VectorMask from './mask'
import RasterTileFactory from './raster';
import RasterDataFactory from './rasterData';
import DebugTile from './debug';

export type TileType =
  | 'PolygonLayer'
  | 'PointLayer'
  | 'LineLayer'
  | 'RasterLayer'
  | 'MaskLayer'
  | 'TileDebugLayer';

export function getTileFactory(tileType: TileType, parser: IParserCfg) {
  switch (tileType) {
    case 'PolygonLayer':
      return VectorTile;
    case 'LineLayer':
      return VectorTile;
    case 'PointLayer':
      return VectorTile;
    case 'MaskLayer':
      return VectorMask;
    case 'TileDebugLayer': 
      return DebugTile;
    case 'RasterLayer':
      if(rasterDataTypes.includes(parser.dataType)) {
        return RasterDataFactory;
      } else {
        return RasterTileFactory;
      }
    default:
      console.warn('Current Tile Not Exist!');
      return RasterTileFactory;
  }
}

export * from '../interface';
