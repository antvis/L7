import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import { getDefaultDomain } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { IRasterTerrainLayerStyleOptions } from '../../core/interface';
import { RasterImageTriangulation } from '../../core/triangulation';
import Raster_terrainFrag from '../shaders/raster_terrain_rgb_frag.glsl';
import Raster_terrainVert from '../shaders/rater_terrain_rgb_vert.glsl';

export default class RasterTerrainRGB extends BaseModel {
  protected texture: ITexture2D;
  public getUninforms(): IModelUniform {
    const {
      opacity,
      clampLow = true,
      clampHigh = true,
      noDataValue = -9999999,
      domain,
      rampColors,
      colorTexture,
      rScaler = 6553.6,
      gScaler = 25.6,
      bScaler = 0.1,
      offset = 10000,
    } = this.layer.getLayerConfig() as IRasterTerrainLayerStyleOptions;
    const newdomain = domain || getDefaultDomain(rampColors);
    let texture: ITexture2D | undefined = colorTexture;
    if (!colorTexture) {
      texture = this.layer.textureService.getColorTexture(
        rampColors,
        newdomain,
      ) as ITexture2D;
    } else {
      this.layer.textureService.setColorTexture(
        colorTexture,
        rampColors,
        newdomain,
      );
    }
    return {
      u_opacity: opacity || 1,
      u_texture: this.texture,
      u_domain: newdomain,
      u_clampLow: clampLow,
      u_clampHigh: typeof clampHigh !== 'undefined' ? clampHigh : clampLow,
      u_noDataValue: noDataValue,
      u_unpack: [rScaler, gScaler, bScaler, offset],
      u_colorTexture: texture!,
    };
  }
  public async initModels(): Promise<IModel[]> {
    const source = this.layer.getSource();
    const { createTexture2D } = this.rendererService;
    const imageData = await source.data.images;
    this.texture = createTexture2D({
      data: imageData[0],
      width: imageData[0].width,
      height: imageData[0].height,
      min: gl.LINEAR,
      mag: gl.LINEAR,
    });

    const model = await this.layer.buildLayerModel({
      moduleName: 'RasterTileDataImage',
      vertexShader: Raster_terrainVert,
      fragmentShader: Raster_terrainFrag,
      triangulation: RasterImageTriangulation,
      primitive: gl.TRIANGLES,
      depth: { enable: false },
    });
    return [model];
  }

  public clearModels(): void {
    this.texture?.destroy();
  }

  public async buildModels(): Promise<IModel[]> {
    return this.initModels();
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
