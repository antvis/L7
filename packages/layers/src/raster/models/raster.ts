import type { IEncodeFeature, IModel, ITexture2D } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import { getDefaultDomain } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import type { IRasterLayerStyleOptions } from '../../core/interface';
import { RasterImageTriangulation } from '../../core/triangulation';
import rasterFrag from '../shaders/raster/raster_2d_frag.glsl';
import rasterVert from '../shaders/raster/raster_2d_vert.glsl';
export default class RasterModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      UV: 9,
    });
  }

  protected texture: ITexture2D;
  protected colorTexture: ITexture2D;
  public getUninforms() {
    const commoninfo = this.getCommonUniformsInfo();
    const attributeInfo = this.getUniformsBufferInfo(this.getStyleAttribute());
    this.updateStyleUnifoms();
    return {
      ...commoninfo.uniformsOption,
      ...attributeInfo.uniformsOption,
    };
  }

  protected getCommonUniformsInfo(): {
    uniformsArray: number[];
    uniformsLength: number;
    uniformsOption: { [key: string]: any };
  } {
    const {
      opacity = 1,
      clampLow = true,
      clampHigh = true,
      noDataValue = -9999999,
      domain,
      rampColors,
    } = this.layer.getLayerConfig() as IRasterLayerStyleOptions;
    const newdomain = domain || getDefaultDomain(rampColors);
    this.colorTexture = this.layer.textureService.getColorTexture(rampColors, newdomain);
    const commonOptions = {
      u_domain: newdomain,
      u_opacity: opacity || 1,
      u_noDataValue: noDataValue,
      u_clampLow: clampLow ? 1 : 0,
      u_clampHigh: (typeof clampHigh !== 'undefined' ? clampHigh : clampLow) ? 1 : 0,
      u_rasterTexture: this.texture,
      u_colorTexture: this.colorTexture,
    };
    this.textures = [this.texture, this.colorTexture];
    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
  }

  private async getRasterData(parserDataItem: any) {
    if (Array.isArray(parserDataItem.data)) {
      // 直接传入波段数据
      return {
        data: parserDataItem.data,
        width: parserDataItem.width,
        height: parserDataItem.height,
      };
    } else {
      // 多波段形式、需要进行处理
      const { rasterData, width, height } = await parserDataItem.data;
      return {
        data: Array.from(rasterData),
        width,
        height,
      };
    }
  }

  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    this.initUniformsBuffer();
    const source = this.layer.getSource();
    const { createTexture2D, queryVerdorInfo } = this.rendererService;
    const parserDataItem = source.data.dataArray[0];

    const { data, width, height } = await this.getRasterData(parserDataItem);

    this.texture = createTexture2D({
      // @ts-ignore
      data: new Float32Array(data),
      width,
      height,
      /**
       * WebGL1 allow the combination of gl.LUMINANCE & gl.FLOAT with OES_texture_float
       * TODO: https://github.com/antvis/g-device-api/issues/188
       */
      format: queryVerdorInfo() === 'WebGL1' ? gl.LUMINANCE : gl.RED,
      type: gl.FLOAT,
      alignment: 1,
    });

    const model = await this.layer.buildLayerModel({
      moduleName: 'rasterImageData',
      vertexShader: rasterVert,
      fragmentShader: rasterFrag,
      defines: this.getDefines(),
      triangulation: RasterImageTriangulation,
      primitive: gl.TRIANGLES,
      depth: { enable: false },
      pickingEnabled: false,
    });
    return [model];
  }

  public clearModels(): void {
    this.texture?.destroy();
    this.colorTexture?.destroy();
  }

  protected registerBuiltinAttributes() {
    // 注册 Position 属性 64 位地位部分，经纬度数据开启双精度，避免大于 22 层级以上出现数据偏移
    this.registerPosition64LowAttribute();

    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        shaderLocation: this.attributeLocation.UV,
        name: 'a_Uv',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
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
