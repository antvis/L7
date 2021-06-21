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
interface IPointLayerStyleOptions {
  opacity: any;
  strokeWidth: number;
  stroke: string;
  strokeOpacity: number;
  offsets: [number, number];
}
// 判断当前使用的 style 中的变量属性是否需要进行数据映射

export default class FillModel extends BaseModel {
  protected dataTexture: ITexture2D;

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

  /**
   * 判断数据纹理是否需要重新计算 - 每一个layer 对象需要进行判断的条件都不一样，所以需要单独实现
   * @param opacity
   * @param strokeOpacity
   * @param strokeWidth
   * @param stroke
   * @param offsets
   * @returns
   */
  public isDataTextureUpdate(
    opacity: any,
    strokeOpacity: any,
    strokeWidth: any,
    stroke: any,
    offsets: any,
  ) {
    let isUpdate = false;
    if (this.curretnOpacity !== JSON.stringify(opacity)) {
      // 判断 opacity 是否发生改变
      isUpdate = true;
      this.curretnOpacity = JSON.stringify(opacity);
    }
    if (this.curretnStrokeOpacity !== JSON.stringify(strokeOpacity)) {
      // 判断 strokeOpacity 是否发生改变
      isUpdate = true;
      this.curretnStrokeOpacity = JSON.stringify(strokeOpacity);
    }
    if (this.currentStrokeWidth !== JSON.stringify(strokeWidth)) {
      // 判断 strokeWidth 是否发生改变
      isUpdate = true;
      this.currentStrokeWidth = JSON.stringify(strokeWidth);
    }
    if (this.currentStrokeColor !== JSON.stringify(stroke)) {
      // 判断 stroke 是否发生改变
      isUpdate = true;
      this.currentStrokeColor = JSON.stringify(stroke);
    }
    if (this.currentOffsets !== JSON.stringify(offsets)) {
      // 判断 offsets 是否发生改变
      isUpdate = true;
      this.currentOffsets = JSON.stringify(offsets);
    }
    if (this.dataTexture === undefined) {
      isUpdate = true;
    }
    return isUpdate;
  }

  /**
   * 清除上一次的计算结果 - 每一个layer 对象需要进行清除的内容都不一样，所以需要单独实现
   */
  public clearLastCalRes() {
    this.cellProperties = []; // 清空上一次计算的需要进行数据映射的属性集合
    this.cellLength = 0; // 清空上一次计算的 cell 的长度
    this.hasOpacity = 0; // 清空上一次是否需要对 opacity 属性进行数据映射的判断
    this.hasStrokeOpacity = 0; // 清空上一次是否需要对 strokeOpacity 属性进行数据映射的判断
    this.hasStrokeWidth = 0; // 清空上一次是否需要对 strokeWidth 属性进行数据映射的判断
    this.hasStroke = 0; // 清空上一次是否需要对 stroke 属性进行数据映射的判断
    this.hasOffsets = 0; // 清空上一次是否需要对 offsets 属性进行数据映射的判断
  }

  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      strokeOpacity = 1,
      strokeWidth = 0,
      stroke = 'rgba(0,0,0,0)',
      offsets = [0, 0],
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;

    if (
      this.isDataTextureUpdate(
        opacity,
        strokeOpacity,
        strokeWidth,
        stroke,
        offsets,
      )
    ) {
      this.clearLastCalRes(); // 清除上一次的计算结果

      if (!isNumber(opacity)) {
        // 数据映射
        this.cellProperties.push({ attr: 'opacity', count: 1 });
        this.hasOpacity = 1;
        this.cellLength += 1;
      }

      if (!isNumber(strokeOpacity)) {
        // 数据映射
        this.cellProperties.push({ attr: 'strokeOpacity', count: 1 });
        this.hasStrokeOpacity = 1;
        this.cellLength += 1;
      }

      if (!isNumber(strokeWidth)) {
        // 数据映射
        this.cellProperties.push({ attr: 'strokeWidth', count: 1 });
        this.hasStrokeWidth = 1;
        this.cellLength += 1;
      }

      if (!isColor(stroke)) {
        // 数据映射
        this.cellProperties.push({ attr: 'stroke', count: 4 });
        this.cellLength += 4;
        this.hasStroke = 1;
      }

      if (!this.isOffsetStatic(offsets)) {
        // 数据映射
        this.cellProperties.push({ attr: 'offsets', count: 2 });
        this.cellLength += 2;
        this.hasOffsets = 1;
      }

      const encodeData = this.layer.getEncodedData();
      if (this.cellLength > 0) {
        // 需要构建数据纹理
        const { data, width, height } = this.calDataFrame(
          this.cellLength,
          encodeData,
          this.cellProperties,
        );
        this.rowCount = height; // 当前数据纹理有多少行

        this.dataTexture = this.createTexture2D({
          flipY: true,
          data,
          format: gl.LUMINANCE,
          type: gl.FLOAT,
          width,
          height,
        });
      } else {
        // 不需要构建数据纹理 - 构建一个空纹理
        this.dataTexture = this.createTexture2D({
          flipY: true,
          data: [1],
          format: gl.LUMINANCE,
          type: gl.FLOAT,
          width: 1,
          height: 1,
        });
      }
    }

    return {
      u_dataTexture: this.dataTexture, // 数据纹理 - 有数据映射的时候纹理中带数据，若没有任何数据映射时纹理是 [1]
      u_cellTypeLayout: [
        // 传递样式数据映射信息 - 当前纹理大小以及有哪些字段需要映射
        this.rowCount, // 数据纹理有几行
        this.DATA_TEXTURE_WIDTH, // 数据纹理有几列
        0.0,
        0.0,
        this.hasOpacity, // cell 中是否存在 opacity
        this.hasStrokeOpacity, // cell 中是否存在 strokeOpacity
        this.hasStrokeWidth, // cell 中是否存在 strokeWidth
        this.hasStroke, // cell 中是否存在 stroke
        this.hasOffsets, // cell 中是否存在 offsets
        0.0,
        0.0,
        0.0,
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
