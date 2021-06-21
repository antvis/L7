import {
  gl,
  ILayer,
  IStyleAttributeUpdateOptions,
  ITexture2D,
  StyleAttributeField,
  StyleAttributeOption,
} from '@antv/l7-core';
import { rgb2arr } from '@antv/l7-utils';
import { isArray, isFunction, isNumber, isString } from 'lodash';
/**
 * 该文件中的工具方法主要用于对 style 中的属性进行 数据映射
 */

interface IConfigToUpdate {
  opacity?: any;
  strokeOpacity?: any;
  stroke?: any;
  strokeWidth?: any;
  offsets?: any;
}

// 画布默认的宽度
const WIDTH = 1024;

/**
 * 当 style 中使用的 opacity 不是常数的时候根据数据进行映射
 * @param field
 * @param values
 * @param updateOptions
 */
function registerStyleAttribute(
  fieldName: string,
  layer: ILayer,
  field: StyleAttributeField,
  values?: StyleAttributeOption,
  updateOptions?: Partial<IStyleAttributeUpdateOptions>,
) {
  layer.updateStyleAttribute(fieldName, field, values, updateOptions);
}

function handleStyleDataMapping(configToUpdate: IConfigToUpdate, layer: any) {
  if (configToUpdate.opacity) {
    // 处理 style 中 opacity 属性的数据映射

    handleStyleFloat('opacity', layer, configToUpdate.opacity);
  }

  if (configToUpdate.strokeWidth) {
    // 处理 style 中 strokeWidth 属性的数据映射

    handleStyleFloat('strokeWidth', layer, configToUpdate.strokeWidth);
  }

  if (configToUpdate.strokeOpacity) {
    // 处理 style 中 strokeOpacity 属性的数据映射

    handleStyleFloat('strokeOpacity', layer, configToUpdate.strokeOpacity);
  }

  if (configToUpdate.stroke) {
    // 处理 style 中 stroke (strokeColor) 属性的数据映射
    handleStyleColor('stroke', layer, configToUpdate.stroke);
  }

  if (configToUpdate.offsets) {
    handleStyleOffsets('offsets', layer, configToUpdate.offsets);
  }
}

/**
 * 根据传入参数 opacity 的类型和值做相应的操作
 */
function handleStyleFloat(fieldName: string, layer: ILayer, styleFloat: any) {
  if (isString(styleFloat)) {
    // opacity = 'string'
    registerStyleAttribute(fieldName, layer, styleFloat, (value: any) => {
      return value;
    });
  } else if (isNumber(styleFloat)) {
    // opacity = 0.4 -> opacity 传入数字
    registerStyleAttribute(fieldName, layer, [styleFloat], undefined);
  } else if (isArray(styleFloat) && styleFloat.length === 2) {
    if (isString(styleFloat[0]) && isFunction(styleFloat[1])) {
      // opacity = ['string', callback]
      registerStyleAttribute(fieldName, layer, styleFloat[0], styleFloat[1]);
    } else if (
      isString(styleFloat[0]) &&
      isArray(styleFloat[1]) &&
      isNumber(styleFloat[1][0]) &&
      isNumber(styleFloat[1][1])
    ) {
      // opacity = ['string', [start: number, end: nuber]]
      registerStyleAttribute(fieldName, layer, styleFloat[0], styleFloat[1]);
    } else {
      registerStyleAttribute(fieldName, layer, [1.0], undefined);
    }
  } else {
    registerStyleAttribute(fieldName, layer, [1.0], undefined);
  }
}

function handleStyleOffsets(
  fieldName: string,
  layer: ILayer,
  styleOffsets: any,
) {
  if (isString(styleOffsets)) {
    // 字符串
    registerStyleAttribute(fieldName, layer, styleOffsets, (value: any) => {
      return value;
    });
  } else if (
    isArray(styleOffsets) &&
    styleOffsets.length === 2 &&
    isString(styleOffsets[0]) &&
    isFunction(styleOffsets[1])
  ) {
    // callback
    registerStyleAttribute(fieldName, layer, styleOffsets[0], styleOffsets[1]);
  } else if (
    isArray(styleOffsets) &&
    styleOffsets.length === 2 &&
    isNumber(styleOffsets[0]) &&
    isNumber(styleOffsets[1])
  ) {
    // normal
    registerStyleAttribute(fieldName, layer, styleOffsets, undefined);
  } else {
    registerStyleAttribute(fieldName, layer, [0, 0], undefined);
  }
}

/**
 * 根据传入参数 stroke / color 的类型和值做相应的操作
 * @param fieldName
 * @param layer
 * @param styleColor
 */
function handleStyleColor(fieldName: string, layer: ILayer, styleColor: any) {
  if (isString(styleColor)) {
    registerStyleAttribute(fieldName, layer, styleColor, undefined);
  } else if (isArray(styleColor) && styleColor.length === 2) {
    if (isString(styleColor[0]) && isFunction(styleColor[1])) {
      registerStyleAttribute(fieldName, layer, styleColor[0], styleColor[1]);
    } else if (
      isString(styleColor[0]) &&
      isArray(styleColor[1]) &&
      styleColor[1].length > 0
    ) {
      registerStyleAttribute(fieldName, layer, styleColor[0], styleColor[1]);
    } else {
      registerStyleAttribute(fieldName, layer, '#fff', undefined);
    }
  } else {
    registerStyleAttribute(fieldName, layer, '#fff', undefined);
  }
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
 * 2、根据输入的 heightCount 以及默认的 WIDTH 为纹理对象提供数据 (float)
 * 3、根据输入的 createTexture2D 构建纹理对象
 * 4、存储
 * @param heightCount
 * @param createTexture2D
 * @param originData
 * @param field
 * @returns
 */
function initTextureFloatData(
  heightCount: number,
  createTexture2D: any,
  originData: any,
  field: string,
): ITexture2D {
  const d = [];

  for (let i = 0; i < WIDTH * heightCount; i++) {
    if (originData[i] && originData[i][field]) {
      const v = originData[i][field];
      d.push(v);
    } else {
      d.push(0);
    }
  }

  const texture = createTexture2D({
    flipY: true,
    data: d,
    format: gl.LUMINANCE,
    type: gl.FLOAT,
    width: WIDTH,
    height: heightCount,
  });

  return texture;
}

/**
 * 1、根据输入的 field 字段从 originData 中取值 （style 样式用于数据映射的值）
 * 2、根据输入的 heightCount 以及默认的 WIDTH 为纹理对象提供数据 (color)
 * 3、根据输入的 createTexture2D 构建纹理对象
 * @param heightCount
 * @param createTexture2D
 * @param originData
 * @param field
 * @returns
 */
function initTextureVec4Data(
  heightCount: number,
  createTexture2D: any,
  originData: any,
  field: string,
): ITexture2D {
  const d = [];
  for (let i = 0; i < WIDTH * heightCount; i++) {
    if (originData[i] && originData[i][field]) {
      const [r, g, b, a] = rgb2arr(originData[i][field]);
      d.push(r * 255, g * 255, b * 255, a * 255);
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

export {
  handleStyleDataMapping,
  handleStyleFloat,
  getSize,
  getUvPosition,
  initTextureFloatData,
  initTextureVec4Data,
  handleStyleColor,
};
