import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import { getMask } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { IImageLayerStyleOptions } from '../../core/interface';
import { RasterImageTriangulation } from '../../core/triangulation';
import ImageFrag from '../shaders/dataImage_frag.glsl';
import ImageVert from '../shaders/image_vert.glsl';

export default class ImageDataModel extends BaseModel {
  protected texture: ITexture2D;
  public getUninforms(): IModelUniform {
    const { createTexture2D } = this.rendererService;
    const {
      opacity,
      clampLow = true,
      clampHigh = true,
      noDataValue = -9999999,
      domain = [0, 1],
      colorTexture = createTexture2D({
        height: 0,
        width: 0,
      }),
    } = this.layer.getLayerConfig() as IImageLayerStyleOptions;

    return {
      u_opacity: opacity || 1,
      u_texture: this.texture,
      u_domain: domain,
      u_clampLow: clampLow,
      u_clampHigh: typeof clampHigh !== 'undefined' ? clampHigh : clampLow,
      u_noDataValue: noDataValue,
      u_colorTexture: colorTexture,
    };
  }
  public async initModels(): Promise<IModel[]> {
    const {
      mask = false,
      maskInside = true,
    } = this.layer.getLayerConfig() as IImageLayerStyleOptions;

    const source = this.layer.getSource();
    const { createTexture2D } = this.rendererService;
    const imageData = await source.data.images;
    this.texture = createTexture2D({
      data: imageData[0],
      width: imageData[0].width,
      height: imageData[0].height,
    });

    const model = await this.layer
      .buildLayerModel({
        moduleName: 'RasterTileDataImage',
        vertexShader: ImageVert,
        fragmentShader: ImageFrag,
        triangulation: RasterImageTriangulation,
        primitive: gl.TRIANGLES,
        depth: { enable: false },
        blend: this.getBlend(),
        stencil: getMask(mask, maskInside),
      })
    return [model]
  }

  public clearModels(): void {
    this.texture?.destroy();
  }

  public async buildModels(): Promise<IModel[]> {
    return await this.initModels();
  }

  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
        ) => {
          return [vertex[3], vertex[4]];
        },
      },
    });
  }
}
