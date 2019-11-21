import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayer,
  ILayerModel,
  IModel,
  IModelUniform,
} from '@l7/core';

import BaseModel from '../../core/baseModel';
import { rgb2arr } from '../../utils/color';
import normalFrag from '../shaders/normal_frag.glsl';
import normalVert from '../shaders/normal_vert.glsl';

interface IPointLayerStyleOptions {
  opacity: number;
  strokeWidth: number;
  strokeColor: string;
}
export function PointTriangulation(feature: IEncodeFeature) {
  const coordinates = feature.coordinates as number[];
  return {
    vertices: [...coordinates],
    indices: [0],
    size: coordinates.length,
  };
}

export default class NormalModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      strokeColor = 'rgb(0,0,0,0)',
      strokeWidth = 1,
    } = this.layer.getStyleOptions() as IPointLayerStyleOptions;
    return {
      u_opacity: opacity,
      u_stroke_width: strokeWidth,
      u_stroke_color: rgb2arr(strokeColor),
    };
  }

  public buildModels(): IModel[] {
    return [
      this.layer.buildLayerModel({
        moduleName: 'normalpoint',
        vertexShader: normalVert,
        fragmentShader: normalFrag,
        triangulation: PointTriangulation,
        depth: { enable: false },
        primitive: gl.POINTS,
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
    this.layer.styleAttributeService.registerStyleAttribute({
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
  }
}
