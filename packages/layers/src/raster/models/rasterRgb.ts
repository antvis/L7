import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  ITexture2D,
} from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { IRasterLayerStyleOptions } from '../../core/interface';
import { RasterImageTriangulation } from '../../core/triangulation';
import rasterVert from '../shaders/raster_2d_vert.glsl';
import rasterFrag from '../shaders/raster_rgb_frag.glsl';
export default class RasterModel extends BaseModel {
  protected texture: ITexture2D;
  protected dataOption: any = {};

  public getUninforms() {
    const { opacity = 1, noDataValue = 0 } =
      this.layer.getLayerConfig() as IRasterLayerStyleOptions;
    const { rMinMax, gMinMax, bMinMax } = this.dataOption;
    return {
      u_opacity: opacity || 1,
      u_texture: this.texture,
      u_noDataValue: noDataValue,
      u_rminmax: rMinMax,
      u_gminmax: gMinMax,
      u_bminmax: bMinMax,
    };
  }

  private async getRasterData(parserDataItem: any) {
    if (Array.isArray(parserDataItem.data)) {
      const { data, ...rescfg } = parserDataItem;
      this.dataOption = rescfg;
      return {
        data,
        ...rescfg,
      };
    }

    const { rasterData, ...rest } = await parserDataItem.data;
    this.dataOption = rest;
    if (Array.isArray(rasterData)) {
      // 直接传入波段数据
      return {
        data: rasterData,
        ...rest,
      };
    } else {
      // 多波段形式、需要进行处理
      // 支持彩色栅格（多通道）
      return {
        data: Array.from(rasterData),
        ...rest,
      };
    }
  }

  public async initModels(): Promise<IModel[]> {
    const source = this.layer.getSource();
    const { createTexture2D } = this.rendererService;
    const parserDataItem = source.data.dataArray[0];
    const { data, width, height } = await this.getRasterData(parserDataItem);
    this.texture = createTexture2D({
      // @ts-ignore
      data,
      width,
      height,
      format: gl.RGB,
      type: gl.FLOAT,
    });

    const model = await this.layer.buildLayerModel({
      moduleName: 'rasterImageDataRGBA',
      vertexShader: rasterVert,
      fragmentShader: rasterFrag,
      triangulation: RasterImageTriangulation,
      primitive: gl.TRIANGLES,
      depth: { enable: false },
    });
    return [model];
  }

  public async buildModels(): Promise<IModel[]> {
    return this.initModels();
  }

  public clearModels(): void {
    this.texture?.destroy();
  }

  protected registerBuiltinAttributes() {
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
        ) => {
          return [vertex[3], vertex[4]];
        },
      },
    });
  }
}
