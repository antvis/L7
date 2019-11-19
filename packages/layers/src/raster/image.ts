import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayer,
  ITexture2D,
} from '@l7/core';
import BaseLayer from '../core/BaseLayer';
import { RasterImageTriangulation } from '../core/triangulation';
import rasterImageFrag from './shaders/image_frag.glsl';
import rasterImageVert from './shaders/image_vert.glsl';
interface IPointLayerStyleOptions {
  opacity: number;
}

export default class ImageLayer extends BaseLayer<IPointLayerStyleOptions> {
  public name: string = 'ImageLayer';
  protected texture: ITexture2D;

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
    const { opacity } = this.getStyleOptions();
    if (this.texture) {
      this.models.forEach((model) =>
        model.draw({
          uniforms: {
            u_opacity: opacity || 1,
            u_texture: this.texture,
          },
        }),
      );
    }

    return this;
  }

  protected buildModels() {
    this.registerBuiltinAttributes();
    const source = this.getSource();
    const { createTexture2D } = this.rendererService;
    source.data.images.then((imageData: HTMLImageElement[]) => {
      this.texture = createTexture2D({
        data: imageData[0],
        width: imageData[0].width,
        height: imageData[0].height,
      });
      this.renderModels();
    });
    this.models = [
      this.buildLayerModel({
        moduleName: 'RasterImage',
        vertexShader: rasterImageVert,
        fragmentShader: rasterImageFrag,
        triangulation: RasterImageTriangulation,
        primitive: gl.TRIANGLES,
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

  private registerBuiltinAttributes() {
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
          return [vertex[3], vertex[4]];
        },
      },
    });
  }
}
