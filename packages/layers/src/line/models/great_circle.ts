import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
} from '@l7/core';

import BaseModel from '../../core/BaseModel';
import { LineArcTriangulation } from '../../core/triangulation';
import line_arc2d_vert from '../shaders/line_arc2d_vert.glsl';
import line_arc_frag from '../shaders/line_arc_frag.glsl';

interface IArcLayerStyleOptions {
  opacity: number;
  segmentNumber: number;
  blur: number;
}
export default class GreatCircleModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      opacity,
      blur = 0.99,
    } = this.layer.getStyleOptions() as IArcLayerStyleOptions;
    return {
      u_opacity: opacity || 1,
      segmentNumber: 30,
      u_blur: blur,
    };
  }

  public buildModels(): IModel[] {
    return [
      this.layer.buildLayerModel({
        moduleName: 'arc2dline',
        vertexShader: line_arc2d_vert,
        fragmentShader: line_arc_frag,
        triangulation: LineArcTriangulation,
        depth: { enable: false },
        blend: {
          enable: true,
          func: {
            srcRGB: gl.ONE,
            srcAlpha: 1,
            dstRGB: gl.ONE,
            dstAlpha: 1,
          },
        },
      }),
    ];
  }
  protected registerBuiltinAttributes() {
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

    this.styleAttributeService.registerStyleAttribute({
      name: 'instance', // 弧线起始点信息
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Instance',
        buffer: {
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 4,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          return [vertex[3], vertex[4], vertex[5], vertex[6]];
        },
      },
    });
  }
}
