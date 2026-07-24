import type {
  ILegend,
  ILegendClassificaItem,
  ILegendSegmentItem,
  IScale,
  IScaleOptions,
  LegendItems,
} from '@antv/l7-core';
import { lodashUtil } from '@antv/l7-utils';
import type BaseLayer from './BaseLayer';

const { isEqual, isObject, isUndefined } = lodashUtil;

/**
 * Scale 配置与 Legend 读取 delegate（阶段 1.6）。
 *
 * 收口 BaseLayer 中 scale 配置与图例读取：
 * - 状态 `scaleOptions`（原 private，经 `getScaleOptions()` 返回引用供
 *   `FeatureScalePlugin` 缓存到其自身字段，转发保持同一引用语义）
 * - 配置写入 `scale(field, cfg)`（读 `styleAttributeService`，public）
 * - Legend 读取 `getScale` / `getLegend` / `getLegendItems`（三分支分类法：
 *   `invertExtent` 分段 / `ticks` 连续 / `domain` 枚举，字节级镜像原实现）
 *
 * `styleAttributeService` 在 BaseLayer 为 public(:209)，本类经公开
 * `this.layer.styleAttributeService` 访问。对外均为薄转发，零 API/行为变更；
 * `scale()` 返回 `ILayer` 由 BaseLayer 转发层完成（`return this`）。
 */
export default class LayerScaleLegend {
  private layer: BaseLayer;
  private scaleOptions: IScaleOptions = {};

  constructor(layer: BaseLayer) {
    this.layer = layer;
  }

  public scale(field: string | number | IScaleOptions, cfg?: IScale): void {
    const preOption = { ...this.scaleOptions };
    if (isObject(field)) {
      this.scaleOptions = {
        ...this.scaleOptions,
        ...field,
      };
    } else {
      this.scaleOptions[field] = cfg;
    }
    const styleAttributeService = this.layer.styleAttributeService;
    if (styleAttributeService && !isEqual(preOption, this.scaleOptions)) {
      const scaleOptions = isObject(field) ? field : { [field]: cfg };
      styleAttributeService.updateScaleAttribute(scaleOptions);
    }
  }

  public getScaleOptions(): IScaleOptions {
    return this.scaleOptions;
  }

  public getScale(name: string): any {
    return this.layer.styleAttributeService.getLayerAttributeScale(name);
  }

  public getLegend(name: string): ILegend {
    const attribute = this.layer.styleAttributeService.getLayerStyleAttribute(name);
    const scales = attribute?.scale?.scalers || [];

    return {
      type: scales[0]?.option?.type,
      field: scales[0]?.field,
      items: this.getLegendItems(name),
    };
  }

  public getLegendItems(name: string): LegendItems {
    const scale = this.layer.styleAttributeService.getLayerAttributeScale(name);
    // 函数自定义映射，没有 scale 返回为空数组
    if (!scale) {
      return [];
    }

    if (scale.invertExtent) {
      // 分段类型  Quantize、Quantile、Threshold
      const items: ILegendSegmentItem[] = scale.range().map((item: number) => {
        return {
          value: scale.invertExtent(item),
          [name]: item,
        };
      });

      return items;
    } else if (scale.ticks) {
      // 连续类型 Continuous (Linear, Power, Log, Identity, Time)
      const items: ILegendClassificaItem[] = scale.ticks().map((item: string) => {
        return {
          value: item,
          [name]: scale(item),
        };
      });

      return items;
    } else if (scale?.domain) {
      // 枚举类型 Cat
      const items: ILegendClassificaItem[] = scale
        .domain()
        .filter((item: string | number | undefined) => !isUndefined(item))
        .map((item: string | number) => {
          return {
            value: item,
            [name]: scale(item) as string,
          };
        });

      return items;
    }

    return [];
  }
}
