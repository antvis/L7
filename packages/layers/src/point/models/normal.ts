import {
  AttributeType,
  BlendType,
  gl,
  IEncodeFeature,
  ILayerConfig,
  IModel,
  IModelUniform,
} from '@antv/l7-core';

import { rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { BlendTypes } from '../../utils/blend';
import normalFrag from '../shaders/normal_frag.glsl';
import normalVert from '../shaders/normal_vert.glsl';
interface IPointLayerStyleOptions {
  opacity: number;
  strokeWidth: number;
  stroke: string;
  offsets: [number, number];
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
  public getDefaultStyle(): Partial<IPointLayerStyleOptions & ILayerConfig> {
    return {
      blend: 'additive',
    };
  }
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      stroke = 'rgb(0,0,0,0)',
      strokeWidth = 1,
      offsets = [0, 0],
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    return {
      u_opacity: opacity,
      u_stroke_width: strokeWidth,
      u_stroke_color: rgb2arr(stroke),
      u_offsets: [-offsets[0], offsets[1]],
    };
  }

  public initModels(): IModel[] {
    return this.buildModels();
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
        blend: this.getBlend(),
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
          const { size = 1 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });
  }
  private defaultStyleOptions(): Partial<
    IPointLayerStyleOptions & ILayerConfig
  > {
    return {
      blend: BlendType.additive,
    };
  }
}
