import {
  ILayer,
  IScaleValue,
  ISource,
  ISubLayerInitOptions,
  StyleAttrField,
} from '@antv/l7-core';
import Source from '@antv/l7-source';
import { Tile } from '@antv/l7-utils';
import MaskLayer from '../../mask';
import { registerLayers } from '../utils';
import VectorLayer from './vectorLayer';
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
  setStyle(layer: ILayer, type: 'color' | 'size', value: IScaleValue): void;
  setColor(layer: ILayer, scaleValue: IScaleValue): ILayer;
  setSize(layer: ILayer, scaleValue: IScaleValue): ILayer;
}
type Timeout = any;
type CacheEvent =
  | 'click'
  | 'mousemove'
  | 'mouseup'
  | 'mousedown'
  | 'contextmenu';
export default class TileFactory implements ITileFactory {
  public type: string;
  public parentLayer: ILayer;
  public outSideEventTimer: Timeout | null = null;
  protected layers: ILayer[];
  // 用于记录图层内事件，辅助判断图层外事件逻辑
  private eventCache = {
    click: 0,
    mousemove: 0,
    mouseup: 0,
    mousedown: 0,
    contextmenu: 0,
  };
  constructor(option: ITileFactoryOptions) {
    this.parentLayer = option.parent;
  }

  public createTile(tile: Tile, initOptions: ISubLayerInitOptions) {
    return {
      layers: [] as ILayer[],
      layerIDList: [] as string[],
    };
  }

  public getFeatureData(tile: Tile, initOptions: ISubLayerInitOptions) {
    const emptyData = {
      features: [],
      featureId: null,
      vectorTileLayer: null,
      source: null,
    };
    const { layerName, featureId } = initOptions;
    if (!layerName) {
      return emptyData;
    }
    const vectorTileLayer = tile.data.layers[layerName];
    const features = vectorTileLayer?.features;
    if (!(Array.isArray(features) && features.length > 0)) {
      return emptyData;
    } else {
      const source = new Source(
        {
          type: 'FeatureCollection',
          features,
        },
        {
          parser: {
            type: 'geojson',
            featureId,
          },
        },
      );

      return {
        features,
        featureId,
        vectorTileLayer,
        source,
      };
    }
  }

  public createLayer(tileLayerOption: ILayerTileConfig) {
    const {
      L7Layer,
      tile,
      initOptions,
      vectorTileLayer,
      source,
    } = tileLayerOption;
    const { mask, color, layerType, size, shape } = initOptions;
    const FactoryTileLayer = L7Layer ? L7Layer : VectorLayer;
    const layer = new FactoryTileLayer({
      visible: tile.isVisible,
      tileOrigin: vectorTileLayer?.l7TileOrigin,
      coord: vectorTileLayer?.l7TileCoord,
      ...this.getrLayerInitOption(initOptions),
    });
    // vector layer set config
    if (layer.isVector) {
      this.emitEvent([layer]);
      layer.type = layerType;
      layer.select(true);
    }

    layer.source(source);
    layer.shape(shape);

    this.setColor(layer, color);
    if (size) {
      this.setSize(layer, size);
    }

    // set mask
    const layers = [layer];
    if (mask) {
      const masklayer = new MaskLayer()
        .source({
          type: 'FeatureCollection',
          features: [tile.bboxPolygon],
        })
        .shape('fill');

      layers.push(masklayer as VectorLayer);

      layer.addMaskLayer(masklayer);
    }
    // regist layer
    registerLayers(this.parentLayer, layers);

    this.layers = [layer];

    return layer;
  }

  public updateStyle(styles: ITileStyles) {
    return '';
  }

  public setStyle(layer: ILayer, type: 'color' | 'size', value: IScaleValue) {
    if (type === 'color') {
      this.setColor(layer, value);
    } else if (type === 'size') {
      this.setSize(layer, value);
    }
  }

  public setColor(layer: ILayer, colorValue?: IScaleValue) {
    if (!colorValue) {
      layer.color('#fff');
      return layer;
    }
    const parseValueList = this.parseScaleValue(colorValue);
    if (parseValueList.length === 2) {
      layer.color(parseValueList[0] as StyleAttrField, parseValueList[1]);
    } else if (parseValueList.length === 1) {
      layer.color(parseValueList[0] as StyleAttrField);
    } else {
      layer.color('#fff');
    }
    return layer;
  }

  public setSize(layer: ILayer, sizeValue?: IScaleValue) {
    if (!sizeValue) {
      layer.size(2);
      return layer;
    }
    const parseValueList = this.parseScaleValue(sizeValue);
    if (parseValueList.length === 2) {
      layer.size(parseValueList[0] as StyleAttrField, parseValueList[1]);
    } else if (parseValueList.length === 1) {
      layer.size(parseValueList[0] as StyleAttrField);
    } else {
      layer.size(2);
    }
    return layer;
  }

  protected parseScaleValue(scaleValue: IScaleValue) {
    const { field, values, callback } = scaleValue;
    if (field && values && Array.isArray(values)) {
      return [field, values];
    } else if (field && callback) {
      return [field, callback];
    } else if (field) {
      return [field];
    }
    return [];
  }

  protected emitEvent(layers: ILayer[]) {
    layers.map((layer) => {
      layer.once('inited', () => {
        layer.on('click', (e) => {
          this.eventCache.click = 1;
          this.getFeatureAndEmitEvent(layer, 'subLayerClick', e);
        });
        layer.on('mousemove', (e) => {
          this.eventCache.mousemove = 1;
          this.getFeatureAndEmitEvent(layer, 'subLayerMouseMove', e);
        });
        layer.on('mouseup', (e) => {
          this.eventCache.mouseup = 1;
          this.getFeatureAndEmitEvent(layer, 'subLayerMouseUp', e);
        });
        layer.on('mouseenter', (e) => {
          this.getFeatureAndEmitEvent(layer, 'subLayerMouseEnter', e);
        });
        layer.on('mouseout', (e) => {
          this.getFeatureAndEmitEvent(layer, 'subLayerMouseOut', e);
        });
        layer.on('mousedown', (e) => {
          this.eventCache.mousedown = 1;
          this.getFeatureAndEmitEvent(layer, 'subLayerMouseDown', e);
        });
        layer.on('contextmenu', (e) => {
          this.eventCache.contextmenu = 1;
          this.getFeatureAndEmitEvent(layer, 'subLayerContextmenu', e);
        });

        // out side
        layer.on('unclick', (e) =>
          this.handleOutsideEvent('click', 'subLayerUnClick', layer, e),
        );
        layer.on('unmouseup', (e) =>
          this.handleOutsideEvent('mouseup', 'subLayerUnMouseUp', layer, e),
        );
        layer.on('unmousedown', (e) =>
          this.handleOutsideEvent('mousedown', 'subLayerUnMouseDown', layer, e),
        );
        layer.on('uncontextmenu', (e) =>
          this.handleOutsideEvent(
            'contextmenu',
            'subLayerUnContextmenu',
            layer,
            e,
          ),
        );
      });
    });
  }

  protected getFeatureAndEmitEvent(layer: ILayer, eventName: string, e: any) {
    const featureId = e.featureId;
    const source = layer.getSource();
    const features = source.data.dataArray.filter(
      (feature) => feature._id === featureId,
    );
    e.feature = features;
    this.parentLayer.emit(eventName, e);
  }

  private getrLayerInitOption(initOptions: ISubLayerInitOptions) {
    const option = { ...initOptions };
    delete option.color;
    delete option.shape;
    delete option.size;
    delete option.coords;
    delete option.layerName;
    delete option.coords;
    return option;
  }

  private handleOutsideEvent(
    type: CacheEvent,
    emitType: string,
    layer: ILayer,
    e: any,
  ) {
    if (this.outSideEventTimer) {
      clearTimeout(this.outSideEventTimer);
      this.outSideEventTimer = null;
    }
    this.outSideEventTimer = setTimeout(() => {
      if (this.eventCache[type] > 0) {
        this.eventCache[type] = 0;
      } else {
        this.getFeatureAndEmitEvent(layer, emitType, e);
      }
    }, 64);
  }
}
