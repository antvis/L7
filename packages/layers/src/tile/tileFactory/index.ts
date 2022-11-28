import { ILayer } from '@antv/l7-core';
import VectorTile from './VectorTile';
import DebugTile from './DebugTile';
import ImageTile from  './ImageTile';
import RasterTile from './RasterTile';
import RasterRGBTile from './RasterRGBTile';
import RasterTerrainRGBTile  from './RasterTerrainRGBTile';
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
        case 'customRGB':
          return RasterRGBTile;
        case 'arraybuffer':
        case 'customArrayBuffer':
          return RasterTile
        case "terrainRGB" :
            return RasterTerrainRGBTile
        default:
          return ImageTile;
      }
    default:
      return VectorTile;
  }
}

export * from '../interface';
export * from './Tile'
