import {
  ILayer,
  IScaleValue,
  ISubLayerInitOptions,
  ScaleAttributeType,
  StyleAttrField,
} from '@antv/l7-core';
import Source, { Tile } from '@antv/l7-source';
import MaskLayer from '../../mask';
import { getLayerShape, registerLayers } from '../utils';
import VectorLayer from './vectorLayer';

import {
  CacheEvent,
  ILayerTileConfig,
  ITileFactory,
  ITileFactoryOptions,
  ITileStyles,
  Timeout,
} from '../interface';

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

    // set source
    layer.source(source);

    // set scale attribute field
    this.setStyleAttributeField(layer, 'shape', shape);
    this.setStyleAttributeField(layer, 'color', color);
    this.setStyleAttributeField(layer, 'size', size);

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

  public getDefautStyleAttributeField(layer: ILayer, type: string) {
    switch (type) {
      case 'size':
        return 2;
      case 'color':
        return '#fff';
      case 'shape':
        return getLayerShape(this.parentLayer.type, layer);
      default:
        return '';
    }
  }

  public setStyleAttributeField(
    layer: ILayer,
    type: ScaleAttributeType,
    value: IScaleValue | undefined | string,
  ) {
    if (typeof value === 'string') {
      layer[type](value);
      return;
    }
    const defaultValue = this.getDefautStyleAttributeField(layer, type);
    if (!value) {
      layer[type](defaultValue);
      return layer;
    }
    const params = this.parseScaleValue(value, type);
    if (params.length === 0) {
      layer[type](defaultValue);
    } else {
      // @ts-ignore
      layer[type](...params);
    }
  }

  protected parseScaleValue(value: IScaleValue | string, type: string) {
    if (type === 'shape') {
      if (typeof value === 'string') {
        return [value];
      } else if (value?.field) {
        return [value?.field];
      } else {
        return [];
      }
    }
    const { field, values, callback } = value as IScaleValue;
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
