import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  ITexture2D,
} from '@antv/l7-core';
import { generateColorRamp, getMask, IColorRamp } from '@antv/l7-utils';
import { isEqual } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { IRasterLayerStyleOptions } from '../../core/interface';
import { RasterImageTriangulation } from '../../core/triangulation';
import rasterFrag from '../shaders/raster_2d_frag.glsl';
import rasterVert from '../shaders/raster_2d_vert.glsl';
export default class RasterModel extends BaseModel {
  protected texture: ITexture2D;
  protected colorTexture: ITexture2D;
  private rampColors: any;
  public getUninforms() {
    const {
      opacity = 1,
      clampLow = true,
      clampHigh = true,
      noDataValue = -9999999,
      domain = [0, 1],
      rampColors,
    } = this.layer.getLayerConfig() as IRasterLayerStyleOptions;
    if (!isEqual(this.rampColors, rampColors)) {
      this.updateColorTexture();
      this.rampColors = rampColors;
    }

    return {
      u_opacity: opacity || 1,
      u_texture: this.texture,
      u_domain: domain,
      u_clampLow: clampLow,
      u_clampHigh: typeof clampHigh !== 'undefined' ? clampHigh : clampLow,
      u_noDataValue: noDataValue,
      u_colorTexture: this.colorTexture,
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
      const { rasterData, width, height } = await parserDataItem.data;
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
      rampColorsData,
      rampColors,
    } = this.layer.getLayerConfig() as IRasterLayerStyleOptions;
    const source = this.layer.getSource();
    const { createTexture2D } = this.rendererService;
    const parserDataItem = source.data.dataArray[0];

    const {data, width, height} = await this.getRasterData(parserDataItem);
    
    this.texture = createTexture2D({
      data,
      width,
      height,
      format: gl.LUMINANCE,
      type: gl.FLOAT,
      // aniso: 4,
    });
    const imageData = rampColorsData
      ? rampColorsData
      : generateColorRamp(rampColors as IColorRamp);
    this.colorTexture = createTexture2D({
      data: imageData.data,
      width: imageData.width,
      height: imageData.height,
      flipY: false,
    });

    this.layer
      .buildLayerModel({
        moduleName: 'rasterImageData',
        vertexShader: rasterVert,
        fragmentShader: rasterFrag,
        triangulation: RasterImageTriangulation,
        primitive: gl.TRIANGLES,
        depth: { enable: false },
        stencil: getMask(mask, maskInside),
        pick: false,
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
    this.colorTexture?.destroy();
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

  private updateColorTexture() {
    const { createTexture2D } = this.rendererService;
    const {
      rampColors,
    } = this.layer.getLayerConfig() as IRasterLayerStyleOptions;
    const imageData = generateColorRamp(rampColors as IColorRamp);
    this.colorTexture = createTexture2D({
      data: imageData.data,
      width: imageData.width,
      height: imageData.height,
      flipY: false,
    });
  }
}
