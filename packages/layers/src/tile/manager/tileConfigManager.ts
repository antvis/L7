import { ILayer, IScaleValue, ITileLayerOPtions } from '@antv/l7-core';
import EventEmitter from 'eventemitter3';
import { isEqual } from 'lodash';
import { IRasterTileLayerStyleOptions } from '../../core/interface';

export interface ITileConfigManager {
  setConfig(key: string, value: any): void;
  checkConfig(layer: ILayer): void;
  on(event: string, fn: (...args: any[]) => void): void;
  getAttributeScale(layer: ILayer, name: string): IScaleValue;
}

export default class TileConfigManager extends EventEmitter {
  public cacheConfig: Map<string, any>;
  public checkConfigList: string[] = [];
  constructor() {
    super();
    this.cacheConfig = new Map();
  }

  public setConfig(key: string, value: any) {
    if (!this.checkConfigList.includes(key)) {
      this.checkConfigList.push(key);
    }
    this.cacheConfig.set(key, value);
  }

  public removeConfig(key: string) {
    this.cacheConfig.delete(key);
    const configIndex = this.checkConfigList.indexOf(key);
    if (configIndex > -1) {
      this.checkConfigList.splice(configIndex, 1);
    }
  }

  public checkConfig(layer: ILayer) {
    if (!layer.inited) {
      return;
    }
    const layerConfig = layer.getLayerConfig() as IRasterTileLayerStyleOptions;

    const updateConfigs: string[] = [];
    this.checkConfigList.map((key) => {
      const cacheConfig = this.cacheConfig.get(key);
      let currentConfig;
      if (key === 'color' || key === 'size') {
        currentConfig = layer.getAttribute(key)?.scale;
      } else {
        // @ts-ignore
        currentConfig = layerConfig[key];
        if (currentConfig === undefined) {
          return;
        }
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
