import { ILayer } from '@antv/l7-core';
import VectorTile from './VectorTile';
import DebugTile from './DebugTile';
import ImageTile from  './ImageTile';
import RasterTile from './RasterTile';
import MaskLayer from './MaskTile';


export type TileType =
  | 'VectorTile'
  | 'DebugTile'
  | 'PolygonLayer'
  | 'PointLayer'
  | 'LineLayer'
  | 'RasterLayer'
  | 'image'
  | 'MaskLayer'
  | 'TileDebugLayer';

export function getTileFactory(layer: ILayer) {
  const tileType = layer.type;
  // console.log('tileType', tileType)
  switch (tileType) {
    case 'PolygonLayer':
      return VectorTile;
    case 'LineLayer':
      return VectorTile;
    case 'PointLayer':
      return VectorTile;
    case 'TileDebugLayer': 
      return DebugTile;
    case 'MaskLayer':
      return MaskLayer;
    case 'RasterLayer':
      const { dataType } = layer.getSource().parser;
      switch(dataType) {
        case 'rgb':
        case 'arraybuffer':
          return RasterTile
        default:
          return ImageTile;
      }
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
