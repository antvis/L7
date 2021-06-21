import {
  AttributeType,
  gl,
  IAnimateOption,
  IAttribute,
  IElements,
  IEncodeFeature,
  ILayerConfig,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import { isColor, rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { PointFillTriangulation } from '../../core/triangulation';
import pointFillFrag from '../shaders/fill_frag.glsl';
import pointFillVert from '../shaders/fill_vert.glsl';

import { isArray, isNumber, isString } from 'lodash';
import {
  getSize,
  getUvPosition,
  initTextureFloatData,
  initTextureVec4Data,
} from '../../utils/dataMappingStyle';
interface IPointLayerStyleOptions {
  opacity: any;
  strokeWidth: number;
  stroke: string;
  strokeOpacity: number;
  offsets: [number, number];
}

// 用于判断 opacity 的值是否发生该改变
const curretnOpacity: any = '';
const curretnStrokeOpacity: any = '';
const currentStrokeColor: any = '';
const currentStrokeWidth: any = '';

let testTexture = true;

const cellPropertiesLayout = [
  { attr: 'opacity', flag: true, count: 1 },
  { attr: 'strokeOpacity', flag: true, count: 1 },
  { attr: 'strokeWidth', flag: true, count: 1 },
  { attr: 'stroke', flag: true, count: 4 },
];

const WIDTH = 1024; // 数据纹理的固定长度
// let WIDTH = 10
let calHeight = 1;
/**
 * 根据映射的数据字段往推入数据
 * @param d
 * @param cellData
 * @param cellPropertiesLayouts
 */
function patchData(d: number[], cellData: any, cellPropertiesLayouts: any) {
  for (const layout of cellPropertiesLayouts) {
    const { attr, count } = layout;
    if (!cellData) {
      if (attr === 'stroke') {
        d.push(-1, -1, -1, -1);
      } else if (attr === 'offsets') {
        d.push(-1, -1);
      } else {
        d.push(-1);
      }
    } else {
      const value = cellData[attr];

      if (value) {
        // 数据中存在该属性
        if (attr === 'stroke') {
          d.push(...rgb2arr(value));
        } else if (attr === 'offsets') {
          // d.push(...value)
          d.push(-value[0], value[1]);
        } else {
          d.push(value);
        }
      } else {
        // 若不存在时则补位
        patchMod(d, count);
      }
    }
  }
}
/**
 * 补空位
 * @param d
 * @param count
 */
function patchMod(d: number[], count: number) {
  for (let i = 0; i < count; i++) {
    d.push(-1);
  }
}
/**
 * 计算推入数据纹理的数据
 * @param cellLength
 * @param encodeData
 * @param cellPropertiesLayouts
 * @returns
 */
function calDataFrame(
  cellLength: number,
  encodeData: any,
  cellPropertiesLayouts: any,
): any {
  if (cellLength > WIDTH) {
    // console.log('failed');
    return false;
  }

  const encodeDatalength = encodeData.length;
  // WIDTH 行数固定
  const rowCount = Math.ceil((encodeDatalength * cellLength) / WIDTH); // 有多少行

  const totalLength = rowCount * WIDTH;
  const d: number[] = [];
  for (let i = 0; i < encodeDatalength; i++) {
    // 根据 encodeData 数据推入数据
    const cellData = encodeData[i];
    patchData(d, cellData, cellPropertiesLayouts);
  }
  for (let i = d.length; i < totalLength; i++) {
    // 每行不足的部分用 -1 补足（数据纹理时 width * height 的矩形数据集合）
    d.push(-1);
  }
  // console.log(d, rowCount)
  return { data: d, width: WIDTH, height: rowCount };
}
// 判断当前使用的 style 中的变量属性是否需要进行数据映射
let hasOpacity = 0;
let hasStrokeOpacity = 0;
let hasStrokeWidth = 0;
let hasStroke = 0;
let hasOffsets = 0;
export default class FillModel extends BaseModel {
  protected testDataTexture: ITexture2D;

  /**
   * 判断 offsets 是否是常量
   * @param offsets
   * @returns
   */
  public isOffsetStatic(offsets: any) {
    if (
      isArray(offsets) &&
      offsets.length === 2 &&
      isNumber(offsets[0]) &&
      isNumber(offsets[1])
    ) {
      return true;
    } else {
      return false;
    }
  }

  public isColorStatic(stroke: any) {
    if (
      isArray(stroke) &&
      stroke.length === 4 &&
      isNumber(stroke[0]) &&
      isNumber(stroke[1]) &&
      isNumber(stroke[2]) &&
      isNumber(stroke[3])
    ) {
      return true;
    } else {
      return false;
    }
  }

  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      strokeOpacity = 1,
      strokeWidth = 2,
      stroke = [0, 0, 0, 0],
      offsets = [0, 0],
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;

    if (testTexture) {
      const cellProperties = []; // cell 的布局
      let cellLength = 0; // cell 的长度

      if (!isNumber(opacity) && opacity !== undefined) {
        // 数据映射
        cellProperties.push({ attr: 'opacity', flag: true, count: 1 });
        hasOpacity = 1;
        cellLength += 1;
      } else {
        // 常量
        hasOpacity = 0;
      }

      if (!isNumber(strokeOpacity) && strokeOpacity !== undefined) {
        // 数据映射
        cellProperties.push({ attr: 'strokeOpacity', flag: true, count: 1 });
        hasStrokeOpacity = 1;
        cellLength += 1;
      } else {
        // 常量
        hasStrokeOpacity = 0;
      }

      if (!isNumber(strokeWidth) && strokeWidth !== undefined) {
        // 数据映射
        cellProperties.push({ attr: 'strokeWidth', flag: true, count: 1 });
        hasStrokeWidth = 1;
        cellLength += 1;
      } else {
        // 常量
        hasStrokeWidth = 0;
      }
      // console.log('stroke', stroke);
      // if((!isString(stroke) || !isColor(stroke)) && stroke !== undefined) { // 数据映射
      if (!this.isColorStatic(stroke)) {
        // 数据映射
        cellProperties.push({ attr: 'stroke', flag: true, count: 4 });
        cellLength += 4;
        hasStroke = 1;
      } else {
        // 常量
        hasStroke = 0;
      }

      if (!this.isOffsetStatic(offsets)) {
        cellProperties.push({ attr: 'offsets', flag: true, count: 2 });
        cellLength += 2;
        hasOffsets = 1;
      } else {
        hasOffsets = 0;
      }

      // console.log('cellProperties', cellProperties);
      // console.log('cellLength', cellLength);
      // console.log('hasStrokeOpacity', hasStrokeOpacity)
      // console.log('hasStrokeWidth', hasStrokeWidth)

      const encodeData = this.layer.getEncodedData();
      // console.log('encodeData', encodeData)
      // let {data, width, height } = calDataFrame(cellLength, encodeData, cellPropertiesLayout)
      if (cellLength > 0) {
        const { data, width, height } = calDataFrame(
          cellLength,
          encodeData,
          cellProperties,
        );
        calHeight = height;

        this.testDataTexture = this.createTexture2D({
          flipY: true,
          data,
          format: gl.LUMINANCE,
          type: gl.FLOAT,
          width,
          height,
        });
      } else {
        this.testDataTexture = this.createTexture2D({
          flipY: true,
          data: [1],
          format: gl.LUMINANCE,
          type: gl.FLOAT,
          width: 1,
          height: 1,
        });
      }

      // console.log('strokeOpacity', strokeOpacity, isNumber(strokeOpacity)? strokeOpacity : 1.0)
      testTexture = false;
    }

    return {
      u_testTexture: this.testDataTexture, // 数据纹理 - 有数据映射的时候纹理中带数据，若没有任何数据映射时纹理是 [1]
      u_cellTypeLayout: [
        // 传递样式数据映射信息 - 当前纹理大小以及有哪些字段需要映射
        calHeight,
        WIDTH,
        0.0,
        0.0, // rowCount columnCount - 几行几列
        hasOpacity,
        hasStrokeOpacity,
        hasStrokeWidth,
        hasStroke, // opacity strokeOpacity strokeWidth stroke
        hasOffsets,
        0.0,
        0.0,
        0.0, // offsets
        0.0,
        0.0,
        0.0,
        0.0,
      ],

      u_opacity: isNumber(opacity) ? opacity : 1.0,
      u_stroke_opacity: isNumber(strokeOpacity) ? strokeOpacity : 1.0,
      u_stroke_width: isNumber(strokeWidth) ? strokeWidth : 0.0,
      u_stroke_color:
        isString(stroke) && isColor(stroke) ? rgb2arr(stroke) : [0, 0, 0, 0],
      u_offsets: this.isOffsetStatic(offsets)
        ? [-offsets[0], offsets[1]]
        : [0, 0],
    };
  }
  public getAnimateUniforms(): IModelUniform {
    const { animateOption } = this.layer.getLayerConfig() as ILayerConfig;
    return {
      u_aimate: this.animateOption2Array(animateOption as IAnimateOption),
      u_time: this.layer.getLayerAnimateTime(),
    };
  }

  public getAttribute(): {
    attributes: {
      [attributeName: string]: IAttribute;
    };
    elements: IElements;
  } {
    return this.styleAttributeService.createAttributesAndIndices(
      this.layer.getEncodedData(),
      PointFillTriangulation,
    );
  }

  public initModels(): IModel[] {
    // if(cellLength < 1) {
    //   console.log('err')
    // }
    // let encodeData = this.layer.getEncodedData()

    // dataFrameArr = []

    // let mod = WIDTH%cellLength
    // let rowCellCount = (WIDTH-mod)/cellLength
    // let encodeDatalength = encodeData.length
    // let heightCount = Math.ceil(encodeDatalength * cellLength / (WIDTH - mod))

    // let heightStep = 1/heightCount
    // let heightStart = heightStep/2
    // let widthStart = (1/WIDTH)/2
    // let widthStep = (1/WIDTH) * (cellLength - 1.0)

    // for(let i = 0; i < heightCount; i++) { // 行
    //   for(let j = 0; j < rowCellCount; j++) {

    //     let startU = widthStart + widthStep * j
    //     let startV = 1 - (heightStart + heightStep * i)
    //     let endU = startU + widthStep
    //     let endV = startV

    //     dataFrameArr.push({ startU, startV, endU, endV })

    //   }
    // }
    // console.log('dataFrameArr', dataFrameArr)
    return this.buildModels();
  }

  public buildModels(): IModel[] {
    return [
      this.layer.buildLayerModel({
        moduleName: 'pointfill',
        vertexShader: pointFillVert,
        fragmentShader: pointFillFrag,
        triangulation: PointFillTriangulation,
        depth: { enable: false },
        blend: this.getBlend(),
      }),
    ];
  }
  protected animateOption2Array(option: IAnimateOption): number[] {
    return [option.enable ? 0 : 1.0, option.speed || 1, option.rings || 3, 0];
  }
  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'extrude',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Extrude',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const extrude = [1, 1, -1, 1, -1, -1, 1, -1];
          const extrudeIndex = (attributeIdx % 4) * 2;
          return [extrude[extrudeIndex], extrude[extrudeIndex + 1]];
        },
      },
    });

    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const { size = 5 } = feature;
          // console.log('featureIdx', featureIdx, feature)
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });

    // vertex id 用于作为数据纹理取值的唯一编号
    this.styleAttributeService.registerStyleAttribute({
      name: 'vertexId',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_vertexId',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          return [featureIdx];
        },
      },
    });

    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'shape',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Shape',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const { shape = 2 } = feature;
          const shape2d = this.layer.getLayerConfig().shape2d as string[];
          const shapeIndex = shape2d.indexOf(shape as string);
          return [shapeIndex];
        },
      },
    });
  }
}
