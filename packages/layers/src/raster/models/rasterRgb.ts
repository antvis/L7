import type { IEncodeFeature, IModel, ITexture2D } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import type { IRasterLayerStyleOptions } from '../../core/interface';
import { RasterImageTriangulation } from '../../core/triangulation';
import rasterFrag from '../shaders/rgb/raster_rgb_frag.glsl';
import rasterVert from '../shaders/rgb/raster_rgb_vert.glsl';
export default class RasterModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      UV: 9,
    });
  }

  protected texture: ITexture2D;
  protected dataOption: any = {};

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
    const { opacity = 1, noDataValue = 0 } =
      this.layer.getLayerConfig() as IRasterLayerStyleOptions;
    const { rMinMax = [0, 255], gMinMax = [0, 255], bMinMax = [0, 255] } = this.dataOption;
    const commonOptions = {
      u_rminmax: rMinMax,
      u_gminmax: gMinMax,
      u_bminmax: bMinMax,
      u_opacity: opacity || 1,
      u_noDataValue: noDataValue,
      u_texture: this.texture,
    };
    this.textures = [this.texture];

    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
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
    this.initUniformsBuffer();
    const source = this.layer.getSource();
    const { createTexture2D } = this.rendererService;
    const parserDataItem = source.data.dataArray[0];
    const { data, width, height } = await this.getRasterData(parserDataItem);
    this.texture = createTexture2D({
      // @ts-ignore
      data: new Float32Array(data),
      width,
      height,
      format: gl.RGB,
      type: gl.FLOAT,
    });

    const model = await this.layer.buildLayerModel({
      moduleName: 'rasterImageDataRGBA',
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

  public async buildModels(): Promise<IModel[]> {
    return this.initModels();
  }

  public clearModels(): void {
    this.texture?.destroy();
  }

  protected registerBuiltinAttributes() {
    // 注册 Position 属性 64 位地位部分，经纬度数据开启双精度，避免大于 22 层级以上出现数据偏移
    this.registerPosition64LowAttribute();

    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
        shaderLocation: this.attributeLocation.UV,
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
