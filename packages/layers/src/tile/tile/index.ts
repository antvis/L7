import { ILayer, RasterTileType } from '@antv/l7-core';
import DebugTile from './DebugTile';
import ImageTile from './ImageTile';
import MaskLayer from './MaskTile';
import RasterRGBTile from './RasterRGBTile';
import RasterTerrainRGBTile from './RasterTerrainRGBTile';
import RasterTile from './RasterTile';
import VectorTile from './VectorTile';

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
      switch (dataType) {
        case RasterTileType.RGB:
        case RasterTileType.CUSTOMRGB:
          return RasterRGBTile;
        case RasterTileType.ARRAYBUFFER:
        case RasterTileType.CUSTOMARRAYBUFFER:
          return RasterTile;
        case RasterTileType.TERRAINRGB:
        case RasterTileType.CUSTOMTERRAINRGB:
          return RasterTerrainRGBTile;
        default:
          return ImageTile;
      }
    default:
      return VectorTile;
  }
}

export * from '../interface';
export * from './Tile';
