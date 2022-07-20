import { IParserCfg } from '@antv/l7-core';
import VectorLineTile from './line';
import VectorPointLayer from './point';
import VectorPolygonTile from './polygon';
import RasterTileFactory from './raster';
import RasterDataFactory from './rasterData';

export type TileType =
  | 'PolygonLayer'
  | 'PointLayer'
  | 'LineLayer'
  | 'RasterLayer';

export function getTileFactory(tileType: TileType, parser: IParserCfg) {
  switch (tileType) {
    case 'PolygonLayer':
      return VectorPolygonTile;
    case 'LineLayer':
      return VectorLineTile;
    case 'PointLayer':
      return VectorPointLayer;
    case 'RasterLayer':
      if (parser.dataType === 'arraybuffer') {
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
