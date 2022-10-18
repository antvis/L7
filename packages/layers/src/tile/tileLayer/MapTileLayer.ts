import {
  IBaseTileLayer,
  ITileLayerOPtions,
  IBaseTileLayerManager,
} from '@antv/l7-core';
import { BaseMapTileLayerManager } from '../manager/mapLayerManager';

import { Base } from './base';

export class MapTileLayer extends Base implements IBaseTileLayer {
  public tileLayerManager: IBaseTileLayerManager;
  constructor({
    parent,
    rendererService,
    mapService,
    layerService,
  }: ITileLayerOPtions) {
    super();
    const parentSource = parent.getSource();
    const { sourceLayer } =
      parentSource?.data?.tilesetOptions || {};
    this.sourceLayer = sourceLayer;
    this.parent = parent;
    this.mapService = mapService;
    this.layerService = layerService;

    this.tileLayerManager = new BaseMapTileLayerManager(
      parent,
      mapService,
      rendererService,
    );

    this.initTileSetManager();
  }

}
