import {
  IGlobalConfigService,
  ILayer,
  ILayerPlugin,
  ILogService,
  IScale,
  IStyleAttribute,
  lazyInject,
  ScaleTypes,
  TYPES,
} from '@l7/core';
import { IParseDataItem } from '@l7/source';
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

/**
 * 根据 Source 原始数据为指定字段创建 Scale，保存在 StyleAttribute 上，供下游插件使用
 */
export default class FeatureScalePlugin implements ILayerPlugin {
  @lazyInject(TYPES.IGlobalConfigService)
  private readonly configService: IGlobalConfigService;

  @lazyInject(TYPES.ILogService)
  private readonly logger: ILogService;

  private scaleCache: {
    [field: string]: unknown;
  } = {};

  public apply(layer: ILayer) {
    layer.hooks.init.tap('FeatureScalePlugin', () => {
      const attributes = layer.styleAttributeService.getLayerStyleAttributes();
      const { dataArray } = layer.getSource().data;
      this.caculateScalesForAttributes(attributes || [], dataArray);
    });

    layer.hooks.beforeRender.tap('FeatureScalePlugin', () => {
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
        attribute.scale.scalers = this.parseFields(
          attribute.scale.field || '',
        ).map((field: string) => ({
          field,
          func: this.getOrCreateScale(field, attribute, dataArray),
        }));
        attribute.needRescale = false;
      }
    });
  }

  private getOrCreateScale(
    field: string,
    attribute: IStyleAttribute,
    dataArray: IParseDataItem[],
  ) {
    if (this.scaleCache[field]) {
      return this.scaleCache[field];
    }
    this.scaleCache[field] = this.createScale(field, dataArray);
    (this.scaleCache[field] as {
      range: (c: unknown[]) => void;
    }).range(attribute?.scale?.values || []);
    return this.scaleCache[field];
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

  private createScale(field: string, data?: IParseDataItem[]): unknown {
    // 首先查找全局默认配置例如 color
    const scaleOption: IScale | undefined = this.configService.getConfig()?.scales?.[field];

    if (!data || !data.length) {
      // 数据为空
      return scaleOption && scaleOption.type
        ? this.createDefaultScale(scaleOption)
        : d3.scaleOrdinal([field]);
    }
    const firstValue = data.find((d) => !isNil(d[field]))?.[field];
    // 常量 Scale
    if (isNumber(field) || (isNil(firstValue) && !scaleOption)) {
      return d3.scaleOrdinal([field]);
    } else {
      // 根据数据类型判断 默认等分位，时间，和枚举类型
      const type =
        (scaleOption && scaleOption.type) || this.getDefaultType(firstValue);
      return this.createDefaultScale(
        this.createDefaultScaleConfig(type, field, data),
      );
    }
  }

  private getDefaultType(firstValue: unknown) {
    let type = ScaleTypes.QUANTIZE;
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
