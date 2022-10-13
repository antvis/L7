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
import rasterFrag from '../shaders/raster_rgb_frag.glsl';
import rasterVert from '../shaders/raster_2d_vert.glsl';
export default class RasterModel extends BaseModel {
  protected texture: ITexture2D;
  protected channelRMax: number = 256;
  protected channelGMax: number = 256;
  protected channelBMax: number = 256;

  public getUninforms() {
    const {
      opacity = 1,
      channelRMax,
      channelGMax,
      channelBMax
    } = this.layer.getLayerConfig() as IRasterLayerStyleOptions;
    return {
      u_opacity: opacity || 1,
      u_texture: this.texture,
      u_channelRMax: channelRMax !== undefined ? channelRMax : this.channelRMax,
      u_channelGMax: channelGMax !== undefined ? channelGMax : this.channelGMax,
      u_channelBMax: channelBMax !== undefined ? channelBMax : this.channelBMax,
    };
  }

  private async getRasterData(parserDataItem: any) {
    if(Array.isArray(parserDataItem.data)) {
      // 直接传入波段数据
      return {
        data: parserDataItem.data,
        width: parserDataItem.width,
        height: parserDataItem.height,
      }
    } else {
      // 多波段形式、需要进行处理
      // 支持彩色栅格（多通道）
      const { rasterData, width, height, channelR, channelG, channelB } = await parserDataItem.data;
      this.channelRMax = channelR;
      this.channelGMax = channelG;
      this.channelBMax = channelB;
      return {
        data: Array.from(rasterData),
        width,
        height
      }
    }
  }

  public async initModels(callbackModel: (models: IModel[]) => void) {
    const {
      mask = false,
      maskInside = true,
    } = this.layer.getLayerConfig() as IRasterLayerStyleOptions;
    const source = this.layer.getSource();
    const { createTexture2D } = this.rendererService;
    const parserDataItem = source.data.dataArray[0];

    const {data, width, height} = await this.getRasterData(parserDataItem);
    this.texture = createTexture2D({
      // @ts-ignore
      data,
      width,
      height,
      format: gl.RGB,
      type: gl.FLOAT,
    });

    this.layer
      .buildLayerModel({
        moduleName: 'rasterImageDataRGBA',
        vertexShader: rasterVert,
        fragmentShader: rasterFrag,
        triangulation: RasterImageTriangulation,
        primitive: gl.TRIANGLES,
        depth: { enable: false },
        stencil: getMask(mask, maskInside),
      })
      .then((model) => {
        callbackModel([model]);
      })
      .catch((err) => {
        console.warn(err);
        callbackModel([]);
      });
  }

  public buildModels(callbackModel: (models: IModel[]) => void) {
    this.initModels(callbackModel);
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
