import { ILayer, IScaleValue, ISubLayerInitOptions, ScaleAttributeType } from '@antv/l7-core';
import EventEmitter from 'eventemitter3';
import { isEqual } from 'lodash';
export interface ITileStyleService {
  setConfig(key: string, value: any): void;
  checkConfig(layer: ILayer): void;
  on(event: string, fn: (...args: any[]) => void): void;
  getAttributeScale(layer: ILayer, name: string): IScaleValue;
  setStyleAttributeField( layer: ILayer, parent: ILayer, type: ScaleAttributeType, value: IScaleValue | undefined | string | string[],): void;
}

export class TileStyleService extends EventEmitter {
  public cacheConfig: Map<string, any>;
  public checkConfigList: string[] = [];
  constructor() {
    super();
    this.cacheConfig = new Map();
  }

  getLayerShape(layerType: string, layer: ILayer) {
    const layerShape = layer.getAttribute('shape');
    if (layerShape && layerShape.scale?.field) {
      if (layerShape.scale?.values === 'text') {
        return [layerShape.scale.field, layerShape.scale.values] as string[];
      }
      return layerShape.scale.field as string;
    }
    switch (layerType) {
      case 'PolygonLayer':
        return 'fill';
      case 'LineLayer':
        return 'tileline';
      case 'PointLayer':
        return 'circle';
      case 'RasterLayer':
        return 'image';
      default:
        return '';
    }
  }

  public getDefaultStyleAttributeField(layer: ILayer, type: string, style: string) {
    switch (style) {
      case 'size':
        return 1;
      case 'color':
        return '#fff';
      case 'shape':
        return this.getLayerShape(type, layer);
      default:
        return '';
    }
  }

  public setStyleAttributeField(
    layer: ILayer,
    parent: ILayer,
    style: ScaleAttributeType,
    value: IScaleValue | undefined | string | string[],
  ) {
    if (Array.isArray(value)) {
      // @ts-ignore
      layer[style](...value);
      return;
    }
    if (typeof value === 'string') {
      layer[style](value);
      return;
    }
    const defaultValue = this.getDefaultStyleAttributeField(layer, parent.type, style);
    if (!value) {
      layer[style](defaultValue);
      return layer;
    }
    const params = this.parseScaleValue(value, style);
    if (params.length === 0) {
      layer[style](defaultValue);
    } else {
      // @ts-ignore
      layer[style](...params);
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

  public setConfig(key: string, value: any) {
    if (!this.checkConfigList.includes(key)) {
      this.checkConfigList.push(key);
    }
    this.cacheConfig.set(key, value);
  }

  public removeConfig(key: string) {
    const configIndex = this.checkConfigList.indexOf(key);
    if (configIndex > -1) {
      this.cacheConfig.delete(key);
      this.checkConfigList.splice(configIndex, 1);
    }
  }

  public checkConfig(layer: ILayer) {
    if (!layer.inited) {
      return;
    }

    const layerConfig = layer.getLayerConfig() as ISubLayerInitOptions;
    const updateConfigs: string[] = [];
    this.checkConfigList.map((key) => {
      const cacheConfig = this.cacheConfig.get(key);

      let currentConfig;
      if (['color', 'size', 'shape'].includes(key)) {
        currentConfig = layer.getAttribute(key)?.scale;
      } else {
        if (!(key in layerConfig)) {
          return;
        }
        // @ts-ignore
        currentConfig = layerConfig[key];
      }

      if (!isEqual(cacheConfig, currentConfig)) {
        updateConfigs.push(key);
        this.setConfig(key, currentConfig);
      }
    });
    if (updateConfigs.length > 0) {
      console.warn('tile config cache update!', updateConfigs);
      this.emit('updateConfig', updateConfigs);
    }
  }

  public getAttributeScale(layer: ILayer, name: string): IScaleValue {
    const attribute = layer.getAttribute(name);
    const scaleValue: IScaleValue = {
      field: undefined,
      values: undefined,
      callback: undefined,
    };
    if (attribute && attribute.scale) {
      const { field, values, callback } = attribute.scale;
      scaleValue.field = field;
      scaleValue.values = values;
      scaleValue.callback = callback;
    }
    return scaleValue;
  }
}
