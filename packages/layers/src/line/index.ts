import { AttributeType, gl, IEncodeFeature, ILayer } from '@l7/core';
import BaseLayer from '../core/BaseLayer';
import { LineTriangulation } from '../core/triangulation';
import line_frag from './shaders/line_frag.glsl';
import line_vert from './shaders/line_vert.glsl';
interface IPointLayerStyleOptions {
  opacity: number;
}
export default class LineLayer extends BaseLayer<IPointLayerStyleOptions> {
  public name: string = 'LineLayer';

  private animateStartTime: number = 0;

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
    const {
      enable,
      interval = 0.2,
      trailLength = 0.2,
      duration = 2,
    } = this.animateOptions;
    const animate = enable ? 1 : 0;
    const { opacity } = this.getStyleOptions();
    this.models.forEach((model) =>
      model.draw({
        uniforms: {
          u_opacity: opacity || 1.0,
          u_time:
            this.layerService.clock.getElapsedTime() - this.animateStartTime,
          u_animate: [animate, duration, interval, trailLength],
        },
      }),
    );
    return this;
  }

  protected buildModels() {
    this.registerBuiltinAttributes();
    this.models = [
      this.buildLayerModel({
        moduleName: 'line',
        vertexShader: line_vert,
        fragmentShader: line_frag,
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
    // this.initAnimate();
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
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const { size } = feature;
          return Array.isArray(size) ? [size[0], size[1]] : [size as number, 0];
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
  }
  // 拆分的动画插件
  private initAnimate() {
    const { enable } = this.animateOptions;
    if (enable) {
      this.layerService.startAnimate();
      this.animateStartTime = this.layerService.clock.getElapsedTime();
    }
  }
}
