import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayer,
  ILayerPlugin,
  ILogService,
  IModel,
  IModelUniform,
  IRasterParserDataItem,
  IStyleAttributeService,
  ITexture2D,
  lazyInject,
  TYPES,
} from '@antv/l7-core';
import { generateColorRamp, IColorRamp } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { RasterImageTriangulation } from '../../core/triangulation';
import rasterFrag from '../shaders/raster_2d_frag.glsl';
import rasterVert from '../shaders/raster_2d_vert.glsl';

interface IRasterLayerStyleOptions {
  opacity: number;
  domain: [number, number];
  noDataValue: number;
  clampLow: boolean;
  clampHigh: boolean;
  rampColors: IColorRamp;
}
export default class RasterModel extends BaseModel {
  protected texture: ITexture2D;
  protected colorTexture: ITexture2D;
  public getUninforms() {
    const {
      opacity = 1,
      clampLow = true,
      clampHigh = true,
      noDataValue = -9999999,
      domain = [0, 1],
    } = this.layer.getLayerConfig() as IRasterLayerStyleOptions;
    this.updateColorTexure();
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

  public initModels() {
    const source = this.layer.getSource();
    const { createTexture2D } = this.rendererService;
    const parserDataItem = source.data.dataArray[0];
    this.texture = createTexture2D({
      data: parserDataItem.data,
      width: parserDataItem.width,
      height: parserDataItem.height,
      format: gl.LUMINANCE,
      type: gl.FLOAT,
      // aniso: 4,
    });
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
    return [
      this.layer.buildLayerModel({
        moduleName: 'RasterImageData',
        vertexShader: rasterVert,
        fragmentShader: rasterFrag,
        triangulation: RasterImageTriangulation,
        primitive: gl.TRIANGLES,
        depth: { enable: false },
        blend: this.getBlend(),
      }),
    ];
  }

  public buildModels() {
    return this.initModels();
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
          attributeIdx: number,
        ) => {
          return [vertex[3], vertex[4]];
        },
      },
    });
  }

  private updateColorTexure() {
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
