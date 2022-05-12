import { ITileFactory } from './base';
import RasterTileFactory from './raster';

export type TileType =
  | 'rasterTile'
  | 'vectorPoint'
  | 'rasterLine'
  | 'rasterPolygon';

export function getTileFactory(tileType: TileType) {
  switch (tileType) {
    case 'rasterTile':
      return RasterTileFactory;
    default:
      return RasterTileFactory;
  }
}

export { ITileFactory };
