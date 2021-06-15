import {
  ILayer,
  IStyleAttributeUpdateOptions,
  StyleAttributeField,
  StyleAttributeOption,
} from '@antv/l7-core';
import { isArray, isFunction, isNumber, isString } from 'lodash';
/**
 * 该文件中的工具方法主要用于对 style 中的属性进行 数据映射
 */

/**
 * 当 style 中使用的 opacity 不是常数的时候根据数据进行映射
 * @param field
 * @param values
 * @param updateOptions
 */
function registerOpacityAttribute(
  layer: ILayer,
  field: StyleAttributeField,
  values?: StyleAttributeOption,
  updateOptions?: Partial<IStyleAttributeUpdateOptions>,
) {
  layer.updateStyleAttribute('opacity', field, values, updateOptions);
}

/**
 * 根据传入参数 opacity 的类型和值做相应的操作
 */
function handleStyleOpacity(layer: ILayer, opacity: any) {
  if (isString(opacity)) {
    // opacity = 'string'
    registerOpacityAttribute(layer, opacity, (value: any) => {
      return value;
    });
  } else if (isNumber(opacity)) {
    // opacity = 0.4 -> opacity 传入数字、u_Opacity 生效、v_Opacity 不生效
    registerOpacityAttribute(layer, [-1], undefined);
  } else if (isArray(opacity) && opacity.length === 2) {
    if (isString(opacity[0]) && isFunction(opacity[1])) {
      // opacity = ['string', callback]
      registerOpacityAttribute(layer, opacity[0], opacity[1]);
    } else if (
      isString(opacity[0]) &&
      isArray(opacity[1]) &&
      isNumber(opacity[1][0]) &&
      isNumber(opacity[1][1])
    ) {
      // opacity = ['string', [start: number, end: nuber]]
      registerOpacityAttribute(layer, opacity[0], opacity[1]);
    } else {
      registerOpacityAttribute(layer, [1.0], undefined);
    }
  } else {
    registerOpacityAttribute(layer, [1.0], undefined);
  }
}

export { handleStyleOpacity };
