import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';

import BaseModel from '../../core/BaseModel';
import { PointImageTriangulation } from '../../core/triangulation';
import pointImageFrag from '../shaders/image_frag.glsl';
import pointImageVert from '../shaders/image_vert.glsl';
interface IPointLayerStyleOptions {
  opacity: number;
}

export default class ImageModel extends BaseModel {
  private texture: ITexture2D;

  public getUninforms(): IModelUniform {
    const { opacity } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    return {
      u_opacity: opacity || 1.0,
      u_texture: this.texture,
      u_textSize: [1024, this.iconService.canvasHeight || 128],
    };
  }

  public buildModels(): IModel[] {
    this.registerBuiltinAttributes();
    this.updateTexture();
    this.iconService.on('imageUpdate', () => {
      this.updateTexture();
      this.layer.render(); // TODO 调用全局render
    });
    return [
      this.layer.buildLayerModel({
        moduleName: 'pointImage',
        vertexShader: pointImageVert,
        fragmentShader: pointImageFrag,
        triangulation: PointImageTriangulation,
        primitive: gl.POINTS,
        depth: { enable: false },
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

    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
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

          const { shape } = feature;
          const { x, y } = iconMap[shape as string] || { x: 0, y: 0 };
          return [x, y];
        },
      },
    });
  }

  private updateTexture() {
    const { createTexture2D } = this.rendererService;
    this.texture = createTexture2D({
      data: this.iconService.getCanvas(),
      width: 1024,
      height: this.iconService.canvasHeight || 128,
    });
  }
}
