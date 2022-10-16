import { IParserCfg } from '@antv/l7-core';
import { rasterDataTypes } from '@antv/l7-source';
import VectorLineTile from './line';
import VectorPointLayer from './point';
import VectorPolygonTile from './polygon';
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
      return VectorPolygonTile;
    case 'LineLayer':
      return VectorLineTile;
    case 'PointLayer':
      return VectorPointLayer;
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
