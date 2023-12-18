import type {
  IEncodeFeature,
  IModel,
  IModelUniform,
  ITexture2D} from '@antv/l7-core';
import {
  AttributeType,
  gl
} from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import type { IImageLayerStyleOptions } from '../../core/interface';
import { RasterImageTriangulation } from '../../core/triangulation';
import ImageFrag from '../shaders/image_frag.glsl';
import ImageVert from '../shaders/image_vert.glsl';
import { ShaderLocation } from '../../core/CommonStyleAttribute';

export default class ImageModel extends BaseModel {
  protected texture: ITexture2D;
  public getUninforms(): IModelUniform {
    const commoninfo = this.getCommonUniformsInfo();
    const attributeInfo = this.getUniformsBufferInfo(this.getStyleAttribute());
    this.updateStyleUnifoms();
    return {
      ...commoninfo.uniformsOption,
      ...attributeInfo.uniformsOption,
    }
  }

  protected getCommonUniformsInfo(): { uniformsArray: number[]; uniformsLength: number; uniformsOption: { [key: string]: any; }; } {
    const { opacity } = this.layer.getLayerConfig() as IImageLayerStyleOptions;
    const commonOptions = {
      u_opacity: opacity || 1,
      u_texture: this.texture,
    };
    this.textures = [this.texture]
    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
  }

  public async initModels(): Promise<IModel[]> {
    await this.loadTexture();
    return this.buildModels();
  }

  public clearModels(): void {
    this.texture?.destroy();
  }

  private async loadTexture() {
    const { createTexture2D } = this.rendererService;
    this.texture = createTexture2D({
      height: 0,
      width: 0,
    });
    const source = this.layer.getSource();
    const imageData = await source.data.images;
    this.texture = createTexture2D({
      data: imageData[0],
      width: imageData[0].width,
      height: imageData[0].height,
      mag: gl.LINEAR,
      min: gl.LINEAR,
    });

  }

  public async buildModels(): Promise<IModel[]> {
    this.initUniformsBuffer();
    const model = await this.layer.buildLayerModel({
      moduleName: 'rasterImage',
      vertexShader: ImageVert,
      fragmentShader: ImageFrag,
      triangulation: RasterImageTriangulation,
      primitive: gl.TRIANGLES,
      blend: {
        // Tip: 优化显示效果
        enable: true,
      },
      depth: { enable: false },
    });
    return [model];
  }

  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
        shaderLocation: ShaderLocation.UV,
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
