import {
  ILayer,
  IStyleAttributeUpdateOptions,
  ITexture2D,
  StyleAttributeField,
  StyleAttributeOption,
} from '@antv/l7-core';
import { isArray, isFunction, isNumber, isString } from 'lodash';
/**
 * 该文件中的工具方法主要用于对 style 中的属性进行 数据映射
 */

// 画布默认的宽度
const WIDTH = 1024;

/**
 * 当 style 中使用的 opacity 不是常数的时候根据数据进行映射
 * @param field
 * @param values
 * @param updateOptions
 */
function registerOpacityAttribute(
  fieldName: string,
  layer: ILayer,
  field: StyleAttributeField,
  values?: StyleAttributeOption,
  updateOptions?: Partial<IStyleAttributeUpdateOptions>,
) {
  layer.updateStyleAttribute(fieldName, field, values, updateOptions);
}

/**
 * 根据传入参数 opacity 的类型和值做相应的操作
 */
function handleStyleOpacity(fieldName: string, layer: ILayer, opacity: any) {
  if (isString(opacity)) {
    // opacity = 'string'
    registerOpacityAttribute(fieldName, layer, opacity, (value: any) => {
      return value;
    });
  } else if (isNumber(opacity)) {
    // opacity = 0.4 -> opacity 传入数字
    registerOpacityAttribute(fieldName, layer, [opacity], undefined);
  } else if (isArray(opacity) && opacity.length === 2) {
    if (isString(opacity[0]) && isFunction(opacity[1])) {
      // opacity = ['string', callback]
      registerOpacityAttribute(fieldName, layer, opacity[0], opacity[1]);
    } else if (
      isString(opacity[0]) &&
      isArray(opacity[1]) &&
      isNumber(opacity[1][0]) &&
      isNumber(opacity[1][1])
    ) {
      // opacity = ['string', [start: number, end: nuber]]
      registerOpacityAttribute(fieldName, layer, opacity[0], opacity[1]);
    } else {
      registerOpacityAttribute(fieldName, layer, [1.0], undefined);
    }
  } else {
    registerOpacityAttribute(fieldName, layer, [1.0], undefined);
  }
}

/**
 * 根据传入参数 strokeOpacity 的类型和值做相应的操作
 */
function handleStyleStrokeOpacity(
  fieldName: string,
  layer: ILayer,
  strokeOpacity: any,
) {
  handleStyleOpacity(fieldName, layer, strokeOpacity);
}

/**
 * 根据输入的 feature 的长度以及默认的宽度计算画布的大小
 * @param encodeDatalength
 * @returns
 */
function getSize(encodeDatalength: number) {
  const width = WIDTH;
  const height = Math.ceil(encodeDatalength / width);
  return { width, height };
}

/**
 * 根据输入的宽高边距信息，为需要为 index 的 feature 计算在画布上对应的 uv 值
 * @param widthStep
 * @param widthStart
 * @param heightStep
 * @param heightStart
 * @param id
 * @returns
 */
function getUvPosition(
  widthStep: number,
  widthStart: number,
  heightStep: number,
  heightStart: number,
  index: number,
) {
  // index 从零开始
  const row = Math.ceil((index + 1) / WIDTH); // 当前 index 所在的行
  let column = (index + 1) % WIDTH;
  if (column === 0) {
    // 取余等于零
    column = WIDTH;
  }
  const u = widthStart + (column - 1) * widthStep;
  const v = 1 - (heightStart + (row - 1) * heightStep);
  return [u, v];
}

/**
 * 1、根据输入的 field 字段从 originData 中取值 （style 样式用于数据映射的值）
 * 2、根据输入的 heightCount 以及默认的 WIDTH 为纹理对象提供数据
 * 3、根据输入的 createTexture2D 构建纹理对象
 * @param heightCount
 * @param createTexture2D
 * @param originData
 * @param field
 * @returns
 */
function initTextureData(
  heightCount: number,
  createTexture2D: any,
  originData: any,
  field: string,
): ITexture2D {
  const d = [];
  for (let i = 0; i < WIDTH * heightCount; i++) {
    if (originData[i] && originData[i][field]) {
      const v = originData[i][field] * 255;
      d.push(v, v, v, v);
    } else {
      d.push(0, 0, 0, 0);
    }
  }
  const arr = new Uint8ClampedArray(d);
  const imageData = new ImageData(arr, WIDTH, heightCount); // (arr, width, height)

  const texture = createTexture2D({
    flipY: true,
    data: new Uint8Array(imageData.data),
    width: imageData.width,
    height: imageData.height,
  });

  return texture;
}

function initDefaultTextureData(
  heightCount: number,
  createTexture2D: any,
): ITexture2D {
  const d = [];
  for (let i = 0; i < WIDTH * heightCount; i++) {
    d.push(255, 255, 255, 255);
  }
  const arr = new Uint8ClampedArray(d);
  const imageData = new ImageData(arr, WIDTH, heightCount); // (arr, width, height)

  const texture = createTexture2D({
    flipY: true,
    data: new Uint8Array(imageData.data),
    width: imageData.width,
    height: imageData.height,
  });

  return texture;
}

export {
  handleStyleOpacity,
  handleStyleStrokeOpacity,
  getSize,
  getUvPosition,
  initTextureData,
  initDefaultTextureData,
};
