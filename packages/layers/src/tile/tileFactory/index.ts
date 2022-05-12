import { ITileFactory } from './base';
import VectorPolygonTile from './polygon';
import RasterTileFactory from './raster';

export type TileType =
  | 'rasterTile'
  | 'mvt'
  | 'vectorPoint'
  | 'rasterLine'
  | 'rasterPolygon';

export function getTileFactory(tileType: TileType) {
  switch (tileType) {
    case 'rasterTile':
      return RasterTileFactory;
    case 'mvt':
      return VectorPolygonTile;
    default:
      return RasterTileFactory;
  }
}

export { ITileFactory };
