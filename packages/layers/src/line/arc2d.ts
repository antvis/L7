import { AttributeType, gl, IEncodeFeature, ILayer } from '@l7/core';
import BaseLayer from '../core/BaseLayer';
import { LineArcTriangulation } from '../core/triangulation';
import line_arc2d_vert from './shaders/line_arc2d_vert.glsl';
import line_arc_frag from './shaders/line_arc_frag.glsl';
interface IArcLayerStyleOptions {
  opacity: number;
  segmentNumber: number;
  blur: number;
}
export default class ArcCircleLineLayer extends BaseLayer<
  IArcLayerStyleOptions
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
    const { opacity, blur = 0.99 } = this.getStyleOptions();
    this.models.forEach((model) =>
      model.draw({
        uniforms: {
          u_opacity: opacity || 1,
          segmentNumber: 30,
          u_blur: blur,
        },
      }),
    );
    return this;
  }

  protected buildModels() {
    this.registerBuiltinAttributes(this);
    this.models = [
      this.buildLayerModel({
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

  private registerBuiltinAttributes(layer: ILayer) {
    // point layer size;
    layer.styleAttributeService.registerStyleAttribute({
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

    layer.styleAttributeService.registerStyleAttribute({
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
