import {
  ILayer,
  IScaleValue,
  ISubLayerInitOptions,
  StyleAttrField,
} from '@antv/l7-core';
import { Tile } from '@antv/l7-utils';

export interface ITileFactoryOptions {
  parent: ILayer;
}

export interface ITileStyles {
  [key: string]: any;
}

export interface ITileFactory {
  createTile(
    tile: Tile,
    initOptions: ISubLayerInitOptions,
  ): {
    layers: ILayer[];
    layerIDList: string[];
  };

  updateStyle(styles: ITileStyles): string;
  setColor(layer: ILayer, scaleValue: IScaleValue): ILayer;
  setSize(layer: ILayer, scaleValue: IScaleValue): ILayer;
}

export default class TileFactory implements ITileFactory {
  public type: string;
  public parentLayer: ILayer;
  constructor(option: ITileFactoryOptions) {
    this.parentLayer = option.parent;
  }

  public createTile(tile: Tile, initOptions: ISubLayerInitOptions) {
    return {
      layers: [] as ILayer[],
      layerIDList: [] as string[],
    };
  }

  public updateStyle(styles: ITileStyles) {
    return '';
  }

  public setColor(layer: ILayer, colorValue: IScaleValue) {
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

  public setSize(layer: ILayer, colorValue: IScaleValue) {
    const parseValueList = this.parseScaleValue(colorValue);
    if (parseValueList.length === 2) {
      layer.size(parseValueList[0] as StyleAttrField, parseValueList[1]);
    } else if (parseValueList.length === 1) {
      layer.size(parseValueList[0] as StyleAttrField);
    } else {
      layer.size(1);
    }
    return layer;
  }

  protected parseScaleValue(scaleValue: IScaleValue) {
    const { field, values, callback } = scaleValue;
    if (field && values) {
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
        layer.on('click', (e) =>
          this.getFeatureAndEmitEvent(layer, 'subLayerClick', e),
        );
        layer.on('mousemove', (e) =>
          this.getFeatureAndEmitEvent(layer, 'subLayerMouseMove', e),
        );
        layer.on('unmousemove', (e) =>
          this.getFeatureAndEmitEvent(layer, 'subLayerUnMouseMove', e),
        );
        layer.on('mouseenter', (e) =>
          this.getFeatureAndEmitEvent(layer, 'subLayerMouseEnter', e),
        );
        layer.on('mouseout', (e) =>
          this.getFeatureAndEmitEvent(layer, 'subLayerMouseOut', e),
        );
        layer.on('mousedown', (e) =>
          this.getFeatureAndEmitEvent(layer, 'subLayerMouseDown', e),
        );
        layer.on('contextmenu', (e) =>
          this.getFeatureAndEmitEvent(layer, 'subLayerContextmenu', e),
        );
      });
    });
  }

  protected getFeatureAndEmitEvent(layer: ILayer, eventName: string, e: any) {
    const featureId = e.featureId;
    const features = layer
      .getSource()
      .data.dataArray.filter((feature) => feature._id === featureId);
    e.feature = features;
    this.parentLayer.emit(eventName, e);
  }
}
