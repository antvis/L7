import { AttributeType, gl, IEncodeFeature, ITexture2D } from '@antv/l7-core';
import { generateColorRamp, IColorRamp } from '@antv/l7-utils';
import BaseLayer from '../core/BaseLayer';
import { RasterImageTriangulation } from '../core/triangulation';
import rasterImageFrag from './shaders/raster_2d_frag.glsl';
import rasterImageVert from './shaders/raster_2d_vert.glsl';
interface IRasterLayerStyleOptions {
  opacity: number;
  min: number;
  max: number;
  rampColors: IColorRamp;
}

export default class Raster2dLayer extends BaseLayer<IRasterLayerStyleOptions> {
  public type: string = 'RasterLayer';
  protected rasterTexture: ITexture2D;
  protected colorTexture: ITexture2D;

  public buildModels() {
    this.registerBuiltinAttributes();
    const source = this.getSource();
    const { createTexture2D } = this.rendererService;
    const parserDataItem = this.getSource().data.dataArray[0];
    this.rasterTexture = createTexture2D({
      data: parserDataItem.data,
      width: parserDataItem.width,
      height: parserDataItem.height,
      format: gl.LUMINANCE,
      type: gl.FLOAT,
      aniso: 4,
    });
    const { rampColors } = this.getLayerConfig();
    const imageData = generateColorRamp(rampColors as IColorRamp);
    this.colorTexture = createTexture2D({
      data: imageData.data,
      width: imageData.width,
      height: imageData.height,
      flipY: false,
    });
    this.models = [
      this.buildLayerModel({
        moduleName: 'Raster3DImage',
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
  public renderModels() {
    const { opacity } = this.getLayerConfig();
    const parserDataItem = this.getSource().data.dataArray[0];
    const { min, max } = parserDataItem;
    if (this.rasterTexture) {
      this.models.forEach((model) =>
        model.draw({
          uniforms: {
            u_opacity: opacity || 1,
            u_texture: this.rasterTexture,
            u_min: min,
            u_max: max,
            u_colorTexture: this.colorTexture,
          },
        }),
      );
    }

    return this;
  }

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
