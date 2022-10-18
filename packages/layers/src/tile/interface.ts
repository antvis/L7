import {
  ILayer,
  IMapService,
  IRendererService,
  ISource,
  ISubLayerInitOptions,
} from '@antv/l7-core';
import { SourceTile } from '@antv/l7-utils';

export type Timeout = any;
export type CacheEvent =
  | 'click'
  | 'mousemove'
  | 'mouseup'
  | 'mousedown'
  | 'contextmenu';

export interface ITileFactoryOptions {
  parent: ILayer;
  mapService: IMapService;
  rendererService: IRendererService;
}

export interface ITileStyles {
  [key: string]: any;
}

export interface ILayerTileConfig {
  L7Layer?: any;
  tile: SourceTile;
  initOptions: ISubLayerInitOptions;
  vectorTileLayer?: any;
  source: ISource;
  needListen?: boolean;
}

export interface ITileFactory {
  loaded: boolean;
  layers: ILayer[];
  createTile(
    tile: SourceTile,
    initOptions: ISubLayerInitOptions,
  ): {
    layers: ILayer[];
  };

  createLayer(option: ILayerTileConfig): ILayer;

  updateStyle(styles: ITileStyles): string;
}
