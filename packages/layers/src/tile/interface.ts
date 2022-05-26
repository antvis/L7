import {
  ILayer,
  IScaleValue,
  ISource,
  ISubLayerInitOptions,
  ScaleAttributeType,
} from '@antv/l7-core';
import { Tile } from '@antv/l7-source';

export type Timeout = any;
export type CacheEvent =
  | 'click'
  | 'mousemove'
  | 'mouseup'
  | 'mousedown'
  | 'contextmenu';

export interface ITileFactoryOptions {
  parent: ILayer;
}

export interface ITileStyles {
  [key: string]: any;
}

export interface ILayerTileConfig {
  L7Layer?: any;
  tile: Tile;
  initOptions: ISubLayerInitOptions;
  vectorTileLayer?: any;
  source: ISource;
}

export interface ITileFactory {
  createTile(
    tile: Tile,
    initOptions: ISubLayerInitOptions,
  ): {
    layers: ILayer[];
    layerIDList: string[];
  };

  createLayer(option: ILayerTileConfig): ILayer;

  updateStyle(styles: ITileStyles): string;
  setStyleAttributeField(
    layer: ILayer,
    type: ScaleAttributeType,
    value: IScaleValue,
  ): void;
}
