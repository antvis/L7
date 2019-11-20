import { AttributeType, gl, IEncodeFeature } from '@antv/l7-core';
import BaseLayer from '../core/BaseLayer';
import { LineTriangulation } from '../core/triangulation';
import line_dash_frag from './shaders/line_dash_frag.glsl';
import line_dash_vert from './shaders/line_dash_vert.glsl';
interface IDashLineLayerStyleOptions {
  opacity: number;
  dashArray: [number, number];
}
export default class DashLineLayer extends BaseLayer<
  IDashLineLayerStyleOptions
> {
  public name: string = 'LineLayer';

  protected getConfigSchema() {
    return {
      properties: {
        opacity: {
          type: 'number',
          minimum: 0,
          maximum: 1,
        },
      },
    };
  }

  protected renderModels() {
    const { opacity, dashArray = [10, 5] } = this.getStyleOptions();
    this.models.forEach((model) =>
      model.draw({
        uniforms: {
          u_opacity: opacity || 1.0,
          u_dash_array: dashArray,
        },
      }),
    );
    return this;
  }

  protected buildModels() {
    this.registerBuiltinAttributes();
    this.models = [
      this.buildLayerModel({
        moduleName: 'line_dash',
        vertexShader: line_dash_vert,
        fragmentShader: line_dash_frag,
        triangulation: LineTriangulation,
        blend: {
          enable: true,
          func: {
            srcRGB: gl.SRC_ALPHA,
            srcAlpha: 1,
            dstRGB: gl.ONE_MINUS_SRC_ALPHA,
            dstAlpha: 1,
          },
        },
      }),
    ];
  }

  private registerBuiltinAttributes() {
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
      name: 'normal',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Normal',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
          normal: number[],
        ) => {
          return normal;
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'miter',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Miter',
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
          return [vertex[4]];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'startPos',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_StartPos',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const coordinates = feature.coordinates as number[][];
          const coord = coordinates[0];
          return coord.length === 3 ? coord : [...coord, 0.0];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'distance',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Distance',
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
          return [vertex[3]];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'total_distance',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Total_Distance',
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
          return [vertex[5]];
        },
      },
    });
  }
}
