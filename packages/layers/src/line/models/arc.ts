import {
  AttributeType,
  gl,
  IAnimateOption,
  IEncodeFeature,
  ILayerConfig,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';

import BaseModel from '../../core/BaseModel';
import { ILineLayerStyleOptions, lineStyleType } from '../../core/interface';
import { LineArcTriangulation } from '../../core/triangulation';
import line_arc_frag from '../shaders/line_arc_frag.glsl';
import line_arc2d_vert from '../shaders/line_arc_vert.glsl';
const lineStyleObj: { [key: string]: number } = {
  solid: 0.0,
  dash: 1.0,
};
export default class ArcModel extends BaseModel {
  protected texture: ITexture2D;
  public getUninforms(): IModelUniform {
    const {
      opacity,
      lineType = 'solid',
      dashArray = [10, 5],
      forward = true,
      lineTexture = false,
      iconStep = 100,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;

    if (dashArray.length === 2) {
      dashArray.push(0, 0);
    }

    if (this.rendererService.getDirty()) {
      this.texture.bind();
    }

    return {
      u_opacity: opacity || 1,
      segmentNumber: 30,
      u_line_type: lineStyleObj[lineType || 'solid'],
      u_dash_array: dashArray,
      u_blur: 0.9,
      u_lineDir: forward ? 1 : -1,

      u_texture: this.texture, // 贴图
      u_line_texture: lineTexture ? 1.0 : 0.0, // 传入线的标识
      u_icon_step: iconStep,
      u_textSize: [1024, this.iconService.canvasHeight || 128],
    };
  }

  public getAnimateUniforms(): IModelUniform {
    const { animateOption } = this.layer.getLayerConfig() as ILayerConfig;
    // console.log('animateOption', animateOption)
    return {
      u_aimate: this.animateOption2Array(animateOption as IAnimateOption),
      u_time: this.layer.getLayerAnimateTime(),
    };
  }

  public initModels(): IModel[] {
    this.updateTexture();
    this.iconService.on('imageUpdate', this.updateTexture);

    return this.buildModels();
  }

  public clearModels() {
    if (this.texture) {
      this.texture.destroy();
    }
    this.iconService.off('imageUpdate', this.updateTexture);
  }

  public buildModels(): IModel[] {
    return [
      this.layer.buildLayerModel({
        moduleName: 'arc2dline',
        vertexShader: line_arc2d_vert,
        fragmentShader: line_arc_frag,
        triangulation: LineArcTriangulation,
        depth: { enable: false },
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

    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_iconMapUV',
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
          const iconMap = this.iconService.getIconMap();
          const { texture } = feature;
          const { x, y } = iconMap[texture as string] || { x: 0, y: 0 };
          return [x, y];
        },
      },
    });
  }

  private updateTexture = () => {
    const { createTexture2D } = this.rendererService;
    if (this.texture) {
      this.texture.update({
        data: this.iconService.getCanvas(),
      });
      this.layer.render();
      return;
    }
    this.texture = createTexture2D({
      data: this.iconService.getCanvas(),
      mag: gl.NEAREST,
      min: gl.NEAREST,
      premultiplyAlpha: false,
      width: 1024,
      height: this.iconService.canvasHeight || 128,
    });
  };
}
