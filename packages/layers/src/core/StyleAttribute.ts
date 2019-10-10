import { ILayerStyleAttribute, IStyleScale, StyleScaleType } from '@l7/core';
import { isNil, isString } from 'lodash';

type CallBack = (...args: any[]) => any;

export default class StyleAttribute implements ILayerStyleAttribute {
  public type: StyleScaleType;
  public names: string[];
  public scales: IStyleScale[] = [];
  public values: any[] = [];
  public field: string;
  constructor(cfg: any) {
    const {
      type = StyleScaleType.CONSTANT,
      scales = [],
      values = [],
      callback,
      field,
    } = cfg;
    this.field = field;
    this.type = type;
    this.scales = scales;
    this.values = values;
    this.names = this.parseFields(field) || [];
    // 设置 range  TODO 2维映射
    // this.scales.forEach((scale) => {
    //   scale.scale.range(values);
    //   if (scale.type === StyleScaleType.VARIABLE) {
    //     this.type = StyleScaleType.VARIABLE;
    //   }
    // });
    if (callback) {
      this.type = StyleScaleType.VARIABLE;
    }
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
  public setScales(scales: IStyleScale[]): void {
    if (scales.some((scale) => scale.type === StyleScaleType.VARIABLE)) {
      this.type = StyleScaleType.VARIABLE;
      scales.forEach((scale) => {
        scale.scale.range(this.values);
      });
    } else {
      // 设置attribute 常量值
      this.values = scales.map((scale, index) => {
        return scale.scale(this.names[index]);
      });
    }
    this.scales = scales;
  }
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
  /**
   * @example
   * 'w*h' => ['w', 'h']
   * 'w' => ['w']
   */
  private parseFields(field: string[] | string): string[] {
    if (Array.isArray(field)) {
      return field;
    }
    if (isString(field)) {
      return field.split('*');
    }
    return [field];
  }
}
