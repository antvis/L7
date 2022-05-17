import { ITileFactory } from './base';
import VectorLineTile from './line';
import VectorPointLayer from './point';
import VectorPolygonTile from './polygon';
import RasterTileFactory from './raster';

export type TileType =
  | 'PolygonLayer'
  | 'PointLayer'
  | 'LineLayer'
  | 'RasterLayer';

export function getTileFactory(tileType: TileType) {
  switch (tileType) {
    case 'PolygonLayer':
      return VectorPolygonTile;
    case 'LineLayer':
      return VectorLineTile;
    case 'PointLayer':
      return VectorPointLayer;
    case 'RasterLayer':
      return RasterTileFactory;
    default:
      console.warn('Current Tile Not Exist!');
      return RasterTileFactory;
  }
}

export { ITileFactory };
