import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  ITexture2D,
} from '@antv/l7-core';
import { getMask } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { IRasterLayerStyleOptions } from '../../core/interface';
import { RasterImageTriangulation } from '../../core/triangulation';
import rasterFrag from '../shaders/raster_2d_frag.glsl';
import rasterVert from '../shaders/raster_2d_vert.glsl';
export default class RasterModel extends BaseModel {
  protected texture: ITexture2D;
  public getUninforms() {
    const { createTexture2D } = this.rendererService;
    const {
      colorTexture = createTexture2D({
        data: [],
        width: 0,
        height: 0,
        flipY: false,
      }),
      opacity = 1,
      clampLow = true,
      clampHigh = true,
      noDataValue = -9999999,
      domain = [0, 1],
    } = this.layer.getLayerConfig() as IRasterLayerStyleOptions;

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
    } = this.layer.getLayerConfig() as IRasterLayerStyleOptions;
    const source = this.layer.getSource();
    const { createTexture2D } = this.rendererService;
    const parserDataItem = source.data.dataArray[0];
    this.texture = createTexture2D({
      data: parserDataItem.data,
      width: parserDataItem.width,
      height: parserDataItem.height,
      format: gl.LUMINANCE,
      type: gl.FLOAT,
    });

   const model = await this.layer
      .buildLayerModel({
        moduleName: 'rasterTileImageData',
        vertexShader: rasterVert,
        fragmentShader: rasterFrag,
        triangulation: RasterImageTriangulation,
        depth: { enable: false },
        stencil: getMask(mask, maskInside),
      })
     return [model]
  }

 public async buildModels():Promise<IModel[]> {
    return await this.initModels();
  }

  public clearModels(): void {
    this.texture?.destroy();
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