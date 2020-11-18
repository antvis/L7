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
interface IImageLayerStyleOptions {
  opacity: number;
  offsets: [number, number];
}

export default class ImageModel extends BaseModel {
  private texture: ITexture2D;

  public getUninforms(): IModelUniform {
    const {
      opacity,
      offsets = [0, 0],
    } = this.layer.getLayerConfig() as IImageLayerStyleOptions;
    if (this.rendererService.getDirty()) {
      this.texture.bind();
    }
    return {
      u_opacity: opacity || 1.0,
      u_texture: this.texture,
      u_textSize: [1024, this.iconService.canvasHeight || 128],
      u_offsets: [-offsets[0], offsets[1]],
    };
  }

  public initModels(): IModel[] {
    this.registerBuiltinAttributes();
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
        moduleName: 'pointImage',
        vertexShader: pointImageVert,
        fragmentShader: pointImageFrag,
        triangulation: PointImageTriangulation,
        primitive: gl.POINTS,
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
          const { size = 5 } = feature;
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
      mag: gl.LINEAR,
      min: gl.LINEAR,
      width: 1024,
      height: this.iconService.canvasHeight || 128,
    });
  };
}
