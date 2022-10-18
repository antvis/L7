import VectorTile from './VectorTile2';
import DebugTile from './DebugTile';

export type TileType =
  | 'VectorTile'
  | 'DebugTile'
  | 'PolygonLayer'
  | 'PointLayer'
  | 'LineLayer'
  | 'RasterLayer'
  | 'MaskLayer'
  | 'TileDebugLayer';

export function getTileFactory(tileType: TileType) {
  switch (tileType) {
    case 'PolygonLayer':
      return VectorTile;
    case 'LineLayer':
      return VectorTile;
    case 'PointLayer':
      return VectorTile;
    case 'TileDebugLayer': 
      return DebugTile;
    default:
      return VectorTile
    // case 'MaskLayer':
    //   return VectorMask;
 
    // case 'RasterLayer':
    //   if(rasterDataTypes.includes(parser.dataType)) {
    //     return RasterDataFactory;
    //   } else {
    //     return RasterTileFactory;
    //   }
    // default:
    //   console.warn('Current Tile Not Exist!');
    //   return RasterTileFactory;
  }
}

export * from '../interface';
export * from './Tile'
