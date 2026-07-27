import type {
  EncodeStyleKind,
  IAnimateOption,
  IGlobalConfigService,
  ILayerConfig,
  IStyleAttributeUpdateOptions,
  StyleAttributeField,
  StyleAttributeOption,
} from '@antv/l7-core';
import { lodashUtil } from '@antv/l7-utils';
import { normalizePasses } from '../utils/multiPassRender';
import type BaseLayer from './BaseLayer';

const { isEqual, isFunction, isNumber, isObject, isPlainObject } = lodashUtil;

/** 待更新样式属性条目（镜像 BaseLayer.pendingStyleAttributes 元素形状）。 */
interface PendingStyleAttribute {
  attributeName: string;
  attributeField: StyleAttributeField;
  attributeValues?: StyleAttributeOption;
  defaultName?: string;
  updateOptions?: Partial<IStyleAttributeUpdateOptions>;
}

/**
 * 流式样式 API delegate（阶段 1.1）。
 *
 * 收口 BaseLayer 中 `color`/`size`/`texture`/`rotate`/`filter`/`shape`/`label`/
 * `animate`/`style` 流式方法 + `updateStyleAttribute`/`encodeStyle`/
 * `splitValuesAndCallbackInAttribute` 辅助逻辑（~180 行移出 God class）。
 *
 * **状态全部留 BaseLayer**（`pendingStyleAttributes`/`encodeStyleAttribute`/
 * `encodeStyles`/`shapeOption`/`dataState`/`startInit`/`inited`/
 * `styleAttributeService`/`multiPassRenderer`/`configModel`）：本类经
 * `this.layer.*` 公开成员实时回读。三处 protected（`configService`/
 * `pendingStyleAttributes`/`encodeStyles`）经 ctor 注入的 getter lambda 实时
 * 回读——lambda 每次调用现取，兼容运行时 swap（测试 mock 替换 configService）
 * 与 init 期 `pendingStyleAttributes = []` 重赋值（避免持有过期引用）。
 *
 * 对外均为薄转发，零 API/行为变更；fluent 方法返回 `this` 由 BaseLayer 转发层
 * 完成（同 `LayerScaleLegend.scale` 1.6 先例）。`scale` 已由阶段 1.6 的
 * `LayerScaleLegend` 收口，不在本类。
 */
export default class LayerStyleFluent<ChildLayerStyleOptions = {}> {
  constructor(
    private layer: BaseLayer<ChildLayerStyleOptions>,
    private getGlobalConfigService: () => IGlobalConfigService,
    private getPendingStyleAttributes: () => PendingStyleAttribute[],
    private getEncodeStyles: () => Map<string, EncodeStyleKind>,
  ) {}

  public color(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ): void {
    this.updateStyleAttribute('color', field, values, updateOptions);
  }

  public texture(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ): void {
    this.updateStyleAttribute('texture', field, values, updateOptions);
  }

  public rotate(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ): void {
    this.updateStyleAttribute('rotate', field, values, updateOptions);
  }

  public size(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ): void {
    this.updateStyleAttribute('size', field, values, updateOptions);
  }

  // 对 mapping 后的数据过滤，scale 保持不变
  public filter(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ): void {
    const flag = this.updateStyleAttribute('filter', field, values, updateOptions);
    this.layer.dataState.dataSourceNeedUpdate = flag && this.layer.inited;
  }

  public shape(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ): void {
    this.layer.shapeOption = {
      field,
      values,
    };
    const flag = this.updateStyleAttribute('shape', field, values, updateOptions);
    this.layer.dataState.dataSourceNeedUpdate = flag && this.layer.inited;
  }

  public label(
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ): void {
    this.getPendingStyleAttributes().push({
      attributeName: 'label',
      attributeField: field,
      attributeValues: values,
      updateOptions,
    });
  }

  public animate(options: IAnimateOption | boolean): void {
    let rawAnimate: Partial<IAnimateOption> = {};
    if (isObject(options)) {
      rawAnimate.enable = true;
      rawAnimate = {
        ...rawAnimate,
        ...options,
      };
    } else {
      rawAnimate.enable = options;
    }
    this.layer.updateLayerConfig({
      animateOption: rawAnimate,
    });
  }

  public style(options: Partial<ChildLayerStyleOptions> & Partial<ILayerConfig>): void {
    const { passes, ...rest } = options;
    const styleRest = rest as Record<string, any>;
    // passes 特殊处理
    if (passes) {
      normalizePasses(passes).forEach((pass: [string, { [key: string]: unknown }]) => {
        const postProcessingPass = this.layer.multiPassRenderer
          .getPostProcessor()
          .getPostProcessingPassByName(pass[0]);
        if (postProcessingPass) {
          postProcessingPass.updateOptions(pass[1]);
        }
      });
    }
    // 兼容 borderColor borderWidth
    if (styleRest.borderColor) {
      styleRest.stroke = styleRest.borderColor;
    }
    if (styleRest.borderWidth) {
      styleRest.strokeWidth = styleRest.borderWidth;
    }

    // 兼容老版本的写法 ['field, 'value']
    const newOption: { [key: string]: any } = rest;
    Object.keys(rest).forEach((key: string) => {
      const values = styleRest[key];
      if (
        Array.isArray(values) &&
        values.length === 2 &&
        !isNumber(values[0]) &&
        !isNumber(values[1])
      ) {
        newOption[key] = {
          field: values[0],
          value: values[1],
        };
      }
    });

    this.encodeStyle(newOption);
    this.layer.updateLayerConfig(newOption);
  }

  // 参与数据映射的字段 encodeing
  private encodeStyle(options: { [key: string]: any }): void {
    Object.keys(options).forEach((key: string) => {
      if (
        // 需要数据映射
        this.getEncodeStyles().has(key) &&
        isPlainObject(options[key]) &&
        (options[key].field || options[key].value) &&
        !isEqual(this.layer.encodeStyleAttribute[key], options[key]) // 防止计算属性重复计算
      ) {
        this.layer.encodeStyleAttribute[key] = options[key];
        const v: any = options[key];
        this.updateStyleAttribute(
          key,
          v.field as StyleAttributeField,
          v.value as StyleAttributeOption,
        );
        if (this.layer.inited) {
          this.layer.dataState.dataMappingNeedUpdate = true;
        }
      } else {
        // 不需要数据映射
        if (this.layer.encodeStyleAttribute[key]) {
          delete this.layer.encodeStyleAttribute[key]; // 删除已经存在的属性
          this.layer.dataState.dataSourceNeedUpdate = true;
        }
      }
    });
  }

  public updateStyleAttribute(
    type: string,
    field: StyleAttributeField,
    values?: StyleAttributeOption,
    updateOptions?: Partial<IStyleAttributeUpdateOptions>,
  ): boolean {
    const configService = this.getGlobalConfigService();
    // encode diff
    const preAttribute = configService.getAttributeConfig(this.layer.id) || {};
    // @ts-ignore
    if (isEqual(preAttribute[type], { field, values })) {
      // 检测是否发生更新
      return false;
    }

    // 存储 Attribute 瓦片图层使用
    if (['color', 'size', 'texture', 'rotate', 'filter', 'label', 'shape'].indexOf(type) !== -1) {
      configService.setAttributeConfig(this.layer.id, {
        [type]: {
          field,
          values,
        },
      });
    }

    if (!this.layer.startInit) {
      // 开始初始化执行
      this.getPendingStyleAttributes().push({
        attributeName: type,
        attributeField: field,
        attributeValues: values,
        updateOptions,
      });
    } else {
      this.layer.styleAttributeService.updateStyleAttribute(
        type,
        {
          // @ts-ignore
          scale: {
            field,
            ...this.splitValuesAndCallbackInAttribute(
              // @ts-ignore
              values,
              // @ts-ignore
              this.layer.getLayerConfig()[field],
            ),
          },
        },
        // @ts-ignore
        updateOptions,
      );
    }
    return true;
  }

  public splitValuesAndCallbackInAttribute(
    valuesOrCallback?: unknown[],
    // defaultValues?: unknown[],
  ) {
    return {
      values: isFunction(valuesOrCallback) ? undefined : valuesOrCallback,
      callback: isFunction(valuesOrCallback) ? valuesOrCallback : undefined,
    };
  }
}
