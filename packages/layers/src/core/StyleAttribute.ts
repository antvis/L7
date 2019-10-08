import { ILayerStyleAttribute } from '@l7/core';
import { isNil } from 'lodash';

type CallBack = (...args: any[]) => any;

export default class StyleAttribute implements ILayerStyleAttribute {
  public type: string;
  public names: string[];
  public scales: any[] = [];
  public values: any[] = [];
  public field: string;
  constructor(cfg: any) {
    const {
      type = 'base',
      names = [],
      scales = [],
      values = [],
      callback,
      field,
    } = cfg;
    this.field = field;
    this.type = type;
    this.scales = scales;
    this.values = values;
    this.names = names;
    // 设置 range  TODO 2维映射
    this.scales.forEach((scale) => {
      scale.scale.range(values);
    });
    this.callback = (...params: any[]): any[] => {
      /**
       * 当用户设置的 callback 返回 null 时, 应该返回默认 callback 中的值
       */
      if (callback) {
        // 使用用户返回的值处理
        const ret = callback(...params);
        if (!isNil(ret)) {
          return [ret];
        }
      }

      // 没有 callback 或者用户 callback 返回值为空，则使用默认的逻辑处理
      return this.defaultCallback.apply(this, params);
    };
  }
  public callback: CallBack = () => [];

  public mapping(...params: unknown[]): unknown[] {
    return this.callback.apply(this, params);
  }

  private defaultCallback(...params: unknown[]): unknown[] {
    // 没有 params 的情况，是指没有指定 fields，直接返回配置的 values 常量
    if (params.length === 0) {
      return this.values;
    }
    return params.map((param, idx) => {
      const scale = this.scales[idx];
      const value = scale.scale(param);
      return value;
    });
  }
}
