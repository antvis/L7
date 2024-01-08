import type { IEncodeFeature, IModel, ITexture2D } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import { defaultValue } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { ShaderLocation } from '../../core/CommonStyleAttribute';
import type { IImageLayerStyleOptions } from '../../core/interface';
import { RasterImageTriangulation } from '../../core/triangulation';
import ImageFrag from '../shaders/image_frag.glsl';
import ImageVert from '../shaders/image_vert.glsl';
export default class ImageModel extends BaseModel {
  protected texture: ITexture2D;

  protected getCommonUniformsInfo(): {
    uniformsArray: number[];
    uniformsLength: number;
    uniformsOption: { [key: string]: any };
  } {
    const { opacity, brightness, contrast, saturation, gamma } =
      this.layer.getLayerConfig() as IImageLayerStyleOptions;
    const commonOptions = {
      u_opacity: defaultValue(opacity, 1.0),
      u_brightness: defaultValue(brightness, 1.0),
      u_contrast: defaultValue(contrast, 1.0),
      u_saturation: defaultValue(saturation, 1.0),
      u_gamma: defaultValue(gamma, 1.0),
    };
    this.textures = [this.texture];
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
      height: 1,
      width: 1,
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
      pickingEnabled: false,
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
