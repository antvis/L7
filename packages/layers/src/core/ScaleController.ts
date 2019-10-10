import {
  IScaleOption,
  IStyleScale,
  ScaleTypes,
  StyleScaleType,
} from '@l7/core';
import { extent } from 'd3-array';
import * as d3 from 'd3-scale';
import { isNil, isNumber, isString, uniq } from 'lodash';

const dateRegex = /^(?:(?!0000)[0-9]{4}([-/.]+)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))(\s+([01]|([01][0-9]|2[0-3])):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9]))?$/;

const scaleMap = {
  [ScaleTypes.LINEAR]: d3.scaleLinear,
  [ScaleTypes.POWER]: d3.scalePow,
  [ScaleTypes.LOG]: d3.scaleLog,
  [ScaleTypes.IDENTITY]: d3.scaleIdentity,
  [ScaleTypes.TIME]: d3.scaleTime,
  [ScaleTypes.QUANTILE]: d3.scaleQuantile,
  [ScaleTypes.QUANTIZE]: d3.scaleQuantize,
  [ScaleTypes.THRESHOLD]: d3.scaleThreshold,
  [ScaleTypes.CAT]: d3.scaleOrdinal,
};

export default class ScaleController {
  private scaleOptions: {
    [field: string]: IScaleOption;
  };
  constructor(cfg: { [field: string]: IScaleOption }) {
    this.scaleOptions = cfg;
  }

  public createScale(field: string, data?: any[]): IStyleScale {
    let scaleOption: IScaleOption = this.scaleOptions[field];
    const scale: IStyleScale = {
      field,
      scale: undefined,
      type: StyleScaleType.VARIABLE,
    };
    if (!data || !data.length) {
      // 数据为空
      if (scaleOption && scaleOption.type) {
        scale.scale = this.generateScale(scaleOption.type, scaleOption);
      } else {
        scale.scale = d3.scaleOrdinal([field]);
        scale.type = StyleScaleType.CONSTANT;
      }
      return scale;
    }
    let firstValue = null;
    data.some((item) => {
      if (!isNil(item[field])) {
        firstValue = item[field];
        return true;
      }
      firstValue = null;
    });
    // 常量 Scale
    if (isNumber(field) || (isNil(firstValue) && !scaleOption)) {
      scale.scale = d3.scaleOrdinal([field]);
      scale.type = StyleScaleType.CONSTANT;
    } else {
      // 根据数据类型判断 默认等分位，时间，和枚举类型
      const type =
        scaleOption && scaleOption.type
          ? scaleOption.type
          : this.getDefaultType(field, firstValue);
      const cfg = this.getScaleCfg(type, field, data);
      Object.assign(cfg, scaleOption);
      scaleOption = cfg; // 更新scale配置
      scale.scale = this.generateScale(type, cfg);
    }
    return scale;
  }

  private getDefaultType(field: string, firstValue: any) {
    let type = ScaleTypes.QUANTIZE;
    if (dateRegex.test(firstValue)) {
      type = ScaleTypes.TIME;
    } else if (isString(firstValue)) {
      type = ScaleTypes.CAT;
    }
    return type;
  }

  private getScaleCfg(type: ScaleTypes, field: string, data: any[]) {
    const cfg: IScaleOption = {
      field,
      type,
    };
    const values = data.map((item) => item[field]);
    // 默认类型为 Quantile Scales https://github.com/d3/d3-scale#quantile-scales
    if (type !== ScaleTypes.CAT && type !== ScaleTypes.QUANTILE) {
      cfg.domain = extent(values);
    } else if (type === ScaleTypes.CAT) {
      cfg.domain = uniq(values);
    }
    return cfg;
  }

  private generateScale(type: ScaleTypes, scaleOption: IScaleOption) {
    // @ts-ignore
    const scale = scaleMap[type]();
    if (scaleOption.hasOwnProperty('domain')) {
      // 处理同一字段映射不同视觉通道的问题
      scale.copy().domain(scaleOption.domain);
    }
    // TODO 其他属性支持
    return scale;
  }
}
