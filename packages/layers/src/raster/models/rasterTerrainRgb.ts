import type { IEncodeFeature, IModel, ITexture2D } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import { getDefaultDomain } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import type { IRasterTerrainLayerStyleOptions } from '../../core/interface';
import { RasterImageTriangulation } from '../../core/triangulation';
import Raster_terrainFrag from '../shaders/terrain/terrain_rgb_frag.glsl';
import Raster_terrainVert from '../shaders/terrain/terrain_rgb_vert.glsl';

export default class RasterTerrainRGB extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      UV: 9,
    });
  }

  protected texture: ITexture2D;
  protected getCommonUniformsInfo(): {
    uniformsArray: number[];
    uniformsLength: number;
    uniformsOption: { [key: string]: any };
  } {
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
      texture = this.layer.textureService.getColorTexture(rampColors, newdomain) as ITexture2D;
    } else {
      this.layer.textureService.setColorTexture(colorTexture, rampColors, newdomain);
    }
    const commonOptions = {
      u_unpack: [rScaler, gScaler, bScaler, offset],
      u_domain: newdomain,
      u_opacity: opacity || 1,
      u_noDataValue: noDataValue,
      u_clampLow: clampLow,
      u_clampHigh: typeof clampHigh !== 'undefined' ? clampHigh : clampLow,
      u_texture: this.texture,
      u_colorTexture: texture,
    };
    this.textures = [this.texture, texture!];
    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
  }
  public async initModels(): Promise<IModel[]> {
    this.initUniformsBuffer();
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
      defines: this.getDefines(),
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
    // 注册 Position 属性 64 位地位部分，经纬度数据开启双精度，避免大于 22 层级以上出现数据偏移
    this.registerPosition64LowAttribute();

    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
        shaderLocation: this.attributeLocation.UV,
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
          return [vertex[3], vertex[4]];
        },
      },
    });
  }
}
