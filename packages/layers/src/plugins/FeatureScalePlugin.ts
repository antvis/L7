import {
  IGlobalConfigService,
  ILayer,
  ILayerPlugin,
  IScale,
  IScaleOptions,
  IStyleAttribute,
  IStyleAttributeService,
  IStyleScale,
  ScaleTypeName,
  ScaleTypes,
  StyleScaleType,
  TYPES,
} from '@antv/l7-core';
import { IParseDataItem } from '@antv/l7-source';
import { extent, ticks } from 'd3-array';
import * as d3 from 'd3-scale';
import { inject, injectable } from 'inversify';
import { isNil, isString, uniq } from 'lodash';
import 'reflect-metadata';

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

/**
 * 根据 Source 原始数据为指定字段创建 Scale，保存在 StyleAttribute 上，供下游插件使用
 */
@injectable()
export default class FeatureScalePlugin implements ILayerPlugin {
  @inject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;
  // key = field_attribute name
  private scaleCache: {
    [field: string]: IStyleScale;
  } = {};

  private scaleOptions: IScaleOptions = {};

  public apply(
    layer: ILayer,
    {
      styleAttributeService,
    }: { styleAttributeService: IStyleAttributeService },
  ) {
    layer.hooks.init.tap('FeatureScalePlugin', () => {
      this.scaleOptions = layer.getScaleOptions();
      const attributes = styleAttributeService.getLayerStyleAttributes();
      const { dataArray } = layer.getSource().data;
      if (dataArray.length === 0) {
        return;
      }
      this.caculateScalesForAttributes(attributes || [], dataArray);
    });

    // 检测数据是否需要更新
    layer.hooks.beforeRenderData.tap('FeatureScalePlugin', () => {
      this.scaleOptions = layer.getScaleOptions();
      const attributes = styleAttributeService.getLayerStyleAttributes();
      const { dataArray } = layer.getSource().data;
      this.caculateScalesForAttributes(attributes || [], dataArray);
      layer.layerModelNeedUpdate = true;
      return true;
    });

    layer.hooks.beforeRender.tap('FeatureScalePlugin', () => {
      if (layer.layerModelNeedUpdate) {
        return;
      }
      this.scaleOptions = layer.getScaleOptions();
      const attributes = styleAttributeService.getLayerStyleAttributes();
      if (attributes) {
        const { dataArray } = layer.getSource().data;
        if (dataArray.length === 0) {
          return;
        }
        const attributesToRescale = attributes.filter(
          (attribute) => attribute.needRescale,
        );
        if (attributesToRescale.length) {
          this.caculateScalesForAttributes(attributesToRescale, dataArray);
        }
      }
    });
  }
  private isNumber(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  private caculateScalesForAttributes(
    attributes: IStyleAttribute[],
    dataArray: IParseDataItem[],
  ) {
    this.scaleCache = {};
    attributes.forEach((attribute) => {
      if (attribute.scale) {
        // 创建Scale
        const attributeScale = attribute.scale;
        const type = attribute.name;
        attributeScale.names = this.parseFields(attribute!.scale!.field || []);
        const scales: IStyleScale[] = [];
        attributeScale.names.forEach((field: string | number) => {
          scales.push(this.getOrCreateScale(field, attribute, dataArray));
        });

        // 为scales 设置值区间
        if (scales.some((scale) => scale.type === StyleScaleType.VARIABLE)) {
          attributeScale.type = StyleScaleType.VARIABLE;
          scales.forEach((scale) => {
            // 如果设置了回调, 这不需要设置让range
            if (!attributeScale.callback) {
              if (attributeScale.values && attributeScale.values !== 'text') {
                if (
                  scale.option?.type === 'linear' &&
                  attributeScale.values.length > 2
                ) {
                  const tick = scale.scale.ticks(attributeScale.values.length);
                  if (type === 'color') {
                    // TODO: 这里改变了值域，获取图例的时候有问题
                    scale.scale.domain(tick);
                  }
                }
                scale.scale.range(attributeScale.values); // 判断常量, 默认值
              } else if (scale.option?.type === 'cat') {
                // 如果没有设置初值且 类型为cat，range ==domain;

                scale.scale.range(scale.option.domain);
              }
            }
          });
        } else {
          // 设置attribute 常量值 常量直接在value取值
          attributeScale.type = StyleScaleType.CONSTANT;
          attributeScale.defaultValues = scales.map((scale, index) => {
            return scale.scale(attributeScale.names[index]);
          });
        }
        attributeScale.scalers = scales.map((scale: IStyleScale) => {
          return {
            field: scale.field,
            func: scale.scale,
            option: scale.option,
          };
        });

        attribute.needRescale = false;
      }
    });
  }
  private getOrCreateScale(
    field: string | number,
    attribute: IStyleAttribute,
    dataArray: IParseDataItem[],
  ) {
    const scalekey = [field, attribute.name].join('_');
    const values = attribute.scale?.values;
    // if (this.scaleCache[scalekey]) {
    //   return this.scaleCache[scalekey];
    // }
    const styleScale = this.createScale(
      field,
      attribute.name,
      values,
      dataArray,
    );
    // this.scaleCache[scalekey] = styleScale;
    return styleScale;
  }

  /**
   * @example
   * 'w*h' => ['w', 'h']
   * 'w' => ['w']
   */
  private parseFields(
    field: string[] | string | number[],
  ): string[] | number[] {
    if (Array.isArray(field)) {
      return field;
    }
    if (isString(field)) {
      return field.split('*');
    }
    return [field];
  }

  private createScale(
    field: string | number,
    name: string,
    values: unknown[] | string | undefined,
    data?: IParseDataItem[],
  ): IStyleScale {
    // scale 支持根据视觉通道和字段
    const scaleOption: IScale | undefined =
      this.scaleOptions[name] && this.scaleOptions[name]?.field === field
        ? this.scaleOptions[name]
        : this.scaleOptions[field];
    const styleScale: IStyleScale = {
      field,
      scale: undefined,
      type: StyleScaleType.VARIABLE,
      option: scaleOption,
    };

    if (!data || !data.length) {
      if (scaleOption && scaleOption.type) {
        styleScale.scale = this.createDefaultScale(scaleOption);
      } else {
        styleScale.scale = d3.scaleOrdinal([field]);
        styleScale.type = StyleScaleType.CONSTANT;
      }
      return styleScale;
    }
    const firstValue = data!.find((d) => !isNil(d[field]))?.[field];
    // 常量 Scale
    if (this.isNumber(field) || (isNil(firstValue) && !scaleOption)) {
      styleScale.scale = d3.scaleOrdinal([field]);
      styleScale.type = StyleScaleType.CONSTANT;
    } else {
      // 根据数据类型判断 默认等分位，时间，和枚举类型
      let type =
        (scaleOption && scaleOption.type) || this.getDefaultType(firstValue);
      if (values === 'text') {
        // text 为内置变 如果是文本则为cat
        type = ScaleTypes.CAT;
      }
      const cfg = this.createDefaultScaleConfig(type, field, data);
      Object.assign(cfg, scaleOption);
      styleScale.scale = this.createDefaultScale(cfg);
      styleScale.option = cfg;
    }
    return styleScale;
  }

  private getDefaultType(firstValue: unknown) {
    let type = ScaleTypes.LINEAR;
    if (typeof firstValue === 'string') {
      type = dateRegex.test(firstValue) ? ScaleTypes.TIME : ScaleTypes.CAT;
    }
    return type;
  }

  private createDefaultScaleConfig(
    type: ScaleTypeName,
    field: string | number,
    data?: IParseDataItem[],
  ) {
    const cfg: IScale = {
      type,
    };
    const values = data?.map((item) => item[field]) || [];
    // 默认类型为 Quantile Scales https://github.com/d3/d3-scale#quantile-scales
    if (type !== ScaleTypes.CAT && type !== ScaleTypes.QUANTILE) {
      cfg.domain = extent(values);
    } else if (type === ScaleTypes.CAT) {
      cfg.domain = uniq(values);
    } else if (type === ScaleTypes.QUANTILE) {
      cfg.domain = values;
    }
    return cfg;
  }

  private createDefaultScale({ type, domain }: IScale) {
    // @ts-ignore
    const scale = scaleMap[type]();
    if (domain) {
      scale.domain(domain);
    }
    // TODO 其他属性支持
    return scale;
  }
}
