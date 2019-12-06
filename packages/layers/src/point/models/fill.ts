import {
  AttributeType,
  gl,
  IAttribute,
  IElements,
  IEncodeFeature,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { PointFillTriangulation } from '../../core/triangulation';
import { rgb2arr } from '../../utils/color';
import pointFillFrag from '../shaders/fill_frag.glsl';
import pointFillVert from '../shaders/fill_vert.glsl';
interface IPointLayerStyleOptions {
  opacity: number;
  strokeWidth: number;
  strokeColor: string;
}
export default class FillModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      strokeColor = 'rgb(0,0,0,0)',
      strokeWidth = 1,
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    return {
      u_opacity: opacity,
      u_stroke_width: strokeWidth,
      u_stroke_color: rgb2arr(strokeColor),
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
  public buildModels(): IModel[] {
    return [
      this.layer.buildLayerModel({
        moduleName: 'pointfill',
        vertexShader: pointFillVert,
        fragmentShader: pointFillFrag,
        triangulation: PointFillTriangulation,
        depth: { enable: false },
      }),
    ];
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
          const extrude = [-1, -1, 1, -1, 1, 1, -1, 1];
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
          const { size } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
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
