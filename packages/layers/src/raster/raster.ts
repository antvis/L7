import {
  AttributeType,
  gl,
  IEncodeFeature,
  ILayer,
  ILayerPlugin,
  IModelUniform,
  IRasterParserDataItem,
  IStyleAttributeService,
  ITexture2D,
  lazyInject,
  TYPES,
} from '@antv/l7-core';

import { generateColorRamp, IColorRamp } from '@antv/l7-utils';
import BaseLayer from '../core/BaseLayer';
import { RasterTriangulation } from './buffers/triangulation';
import rasterFrag from './shaders/raster_frag.glsl';
import rasterVert from './shaders/raster_vert.glsl';
interface IRasterLayerStyleOptions {
  opacity: number;
  min: number;
  max: number;
  extent: [number, number, number, number];
  rampColors: IColorRamp;
  heightRatio: number;
}

export default class RasterLayer extends BaseLayer<IRasterLayerStyleOptions> {
  public type: string = 'RasterLayer';
  protected rasterTexture: ITexture2D;
  protected colorTexture: ITexture2D;

  public getAnimateUniforms(): IModelUniform {
    return {};
  }

  public buildModels() {
    const parserDataItem = this.getSource().data.dataArray[0];
    const { createTexture2D } = this.rendererService;
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
    this.models = [this.buildRasterModel()];
  }
  public renderModels() {
    const { opacity, heightRatio = 10 } = this.getLayerConfig();
    const parserDataItem = this.getSource().data.dataArray[0];
    const { coordinates, width, height, min, max } = parserDataItem;
    this.models.forEach((model) =>
      model.draw({
        uniforms: {
          u_opacity: opacity || 1,
          u_texture: this.rasterTexture,
          u_min: min,
          u_width: width,
          u_height: height,
          u_max: max,
          u_heightRatio: heightRatio,
          u_colorTexture: this.colorTexture,
          u_extent: [...coordinates[0], ...coordinates[1]],
        },
      }),
    );

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

  private buildRasterModel() {
    const source = this.getSource();
    const sourceFeature = source.data.dataArray[0];
    const triangulation = RasterTriangulation(sourceFeature);
    this.shaderModuleService.registerModule('raster', {
      vs: rasterVert,
      fs: rasterFrag,
    });

    const { vs, fs, uniforms } = this.shaderModuleService.getModule('raster');
    const {
      createAttribute,
      createElements,
      createBuffer,
      createModel,
    } = this.rendererService;
    return createModel({
      vs,
      fs,
      attributes: {
        a_Position: createAttribute({
          buffer: createBuffer({
            data: triangulation.vertices,
            type: gl.FLOAT,
          }),
          size: 2,
        }),
      },
      primitive: gl.TRIANGLES,
      uniforms: {
        ...uniforms,
      },
      depth: {
        enable: true,
      },
      elements: createElements({
        data: triangulation.indices,
        type: gl.UNSIGNED_INT,
        count: triangulation.indices.length,
      }),
    });
  }
}
