import {
  IGlobalConfigService,
  ILayer,
  ILayerPlugin,
  ILogService,
  IScale,
  IScaleOptions,
  IStyleAttribute,
  IStyleScale,
  lazyInject,
  ScaleTypes,
  StyleScaleType,
  TYPES,
} from '@l7/core';
import { IParseDataItem } from '@l7/source';
import { extent } from 'd3-array';
import * as d3 from 'd3-scale';
import { inject, injectable } from 'inversify';
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

/**
 * 根据 Source 原始数据为指定字段创建 Scale，保存在 StyleAttribute 上，供下游插件使用
 */
@injectable()
export default class FeatureScalePlugin implements ILayerPlugin {
  @inject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

  @inject(TYPES.ILogService)
  private readonly logger: ILogService;

  // key = field_attribute name
  private scaleCache: {
    [field: string]: IStyleScale;
  } = {};

  private scaleOptions: IScaleOptions = {};

  public apply(layer: ILayer) {
    layer.hooks.init.tap('FeatureScalePlugin', () => {
      this.scaleOptions = layer.getScaleOptions();
      const attributes = layer.styleAttributeService.getLayerStyleAttributes();
      const { dataArray } = layer.getSource().data;
      this.caculateScalesForAttributes(attributes || [], dataArray);
    });

    layer.hooks.beforeRender.tap('FeatureScalePlugin', () => {
      this.scaleOptions = layer.getScaleOptions();
      const attributes = layer.styleAttributeService.getLayerStyleAttributes();
      if (attributes) {
        const { dataArray } = layer.getSource().data;
        const attributesToRescale = attributes.filter(
          (attribute) => attribute.needRescale,
        );
        if (attributesToRescale.length) {
          this.caculateScalesForAttributes(attributesToRescale, dataArray);
          this.logger.info('rescale finished');
        }
      }
    });
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
        attributeScale.names = this.parseFields(attribute!.scale!.field || []);
        const scales: IStyleScale[] = attributeScale.names.map(
          (field: string) => {
            return this.getOrCreateScale(field, attribute, dataArray);
          },
        );

        // 为scales 设置值区间
        if (scales.some((scale) => scale.type === StyleScaleType.VARIABLE)) {
          attributeScale.type = StyleScaleType.VARIABLE;
          scales.forEach((scale) => {
            // 如果设置了回调, 这不需要设置让range
            if (!attributeScale.callback) {
              if(attributeScale.values) {
                scale.scale.range(attributeScale.values);
              } else if(scale.option?.type==='cat') {

                // 如果没有设置初值且 类型为cat，range ==domain;
                scale.scale.range(scale.option.domain);
              }

            }
          });
        } else {
          // 设置attribute 常量值 常量直接在value取值
          attributeScale.type = StyleScaleType.CONSTANT;
          attributeScale.values = scales.map((scale, index) => {
            return scale.scale(attributeScale.names[index]);
          });
        }

        attributeScale.scalers = scales.map((scale: IStyleScale) => {
          return {
            field: scale.field,
            func: scale.scale,
          };
        });

        attribute.needRescale = false;
      }
    });
  }
  private getOrCreateScale(
    field: string,
    attribute: IStyleAttribute,
    dataArray: IParseDataItem[],
  ) {
    const scalekey = [field, attribute.name].join('_');
    if (this.scaleCache[scalekey]) {
      return this.scaleCache[scalekey];
    }
    const styleScale = this.createScale(field, dataArray);
    this.scaleCache[scalekey] = styleScale;

    if (
      styleScale.type === StyleScaleType.VARIABLE &&
      attribute.scale?.values &&
      attribute.scale?.values.length > 0
    ) {
      // 只有变量初始化range
      styleScale.scale.range(attribute.scale?.values);
    }

    return this.scaleCache[scalekey];
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

  private createScale(field: string, data?: IParseDataItem[]): IStyleScale {
    // 首先查找全局默认配置例如 color
    const scaleOption: IScale | undefined = this.scaleOptions[field];
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
    if (isNumber(field) || (isNil(firstValue) && !scaleOption)) {
      styleScale.scale = d3.scaleOrdinal([field]);
      styleScale.type = StyleScaleType.CONSTANT;
    } else {
      // 根据数据类型判断 默认等分位，时间，和枚举类型
      const type =
        (scaleOption && scaleOption.type) || this.getDefaultType(firstValue);

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
    type: ScaleTypes,
    field: string,
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
