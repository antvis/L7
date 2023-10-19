import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';

import BaseModel from '../../core/BaseModel';
import { earthTriangulation } from '../../core/triangulation';

import baseFrag from '../shaders/base_frag.glsl';
import baseVert from '../shaders/base_vert.glsl';

export default class BaseEarthModel extends BaseModel {
  protected texture: ITexture2D;
  // T: 当前的地球时间 - 控制太阳的方位
  private earthTime: number = 3.4;
  private sunX = 1000;
  private sunY = 1000;
  private sunZ = 1000;
  private sunRadius = Math.sqrt(
    this.sunX * this.sunX + this.sunY * this.sunY + this.sunZ * this.sunZ,
  );

  public getUninforms(): IModelUniform {
    const { animateOption, globalOptions } = this.layer.getLayerConfig();
    if (animateOption?.enable) {
      // @ts-ignore
      // T: rotateY 方法只有在地球模式下存在
      this.mapService.rotateY({
        reg: 0.002,
      });
      this.earthTime += 0.02;

      this.sunY = 10;
      this.sunX = Math.cos(this.earthTime) * (this.sunRadius - this.sunY);
      this.sunZ = Math.sin(this.earthTime) * (this.sunRadius - this.sunY);
    }

    const u_ambientRatio = globalOptions?.ambientRatio || 0.6; // 环境光
    const u_diffuseRatio = globalOptions?.diffuseRatio || 0.4; // 漫反射
    const u_specularRatio = globalOptions?.specularRatio || 0.1; // 高光反射
    const u_sunLight = [this.sunX, this.sunY, this.sunZ];

    this.uniformBuffers[0].subData({
      offset: 0,
      data: new Uint8Array(
        new Float32Array([
          ...u_sunLight,
          u_ambientRatio,
          u_diffuseRatio,
          u_specularRatio,
        ]).buffer,
      ),
    });

    return {
      u_ambientRatio,
      u_diffuseRatio,
      u_specularRatio,
      u_sunLight,
    };
  }

  public setEarthTime(time: number) {
    this.earthTime = time;

    this.sunY = 10;
    this.sunX = Math.cos(this.earthTime) * (this.sunRadius - this.sunY);
    this.sunZ = Math.sin(this.earthTime) * (this.sunRadius - this.sunY);

    this.layerService.throttleRenderLayers();
  }

  public async initModels(): Promise<IModel[]> {
    const { globalOptions } = this.layer.getLayerConfig();
    if (globalOptions?.earthTime !== undefined) {
      this.setEarthTime(globalOptions.earthTime);
    }

    const source = this.layer.getSource();
    const { createTexture2D } = this.rendererService;
    this.texture = createTexture2D({
      height: 0,
      width: 0,
    });
    this.textures[0] = this.texture;
    source.data.images.then((imageData: HTMLImageElement[]) => {
      this.texture = createTexture2D({
        data: imageData[0],
        width: imageData[0].width,
        height: imageData[0].height,
      });
      this.textures[0] = this.texture;
      this.layerService.reRender();
    });

    return this.buildModels();
  }

  public clearModels() {
    return '';
  }

  public async buildModels(): Promise<IModel[]> {
    // Tip: 调整图层的绘制顺序 地球大气层
    this.layer.zIndex = -998;

    this.uniformBuffers.push(
      this.rendererService.createBuffer({
        data: new Float32Array(3 + 1 * 3),
        isUBO: true,
      }),
    );

    const model = await this.layer.buildLayerModel({
      moduleName: 'earthBase',
      vertexShader: baseVert,
      fragmentShader: baseFrag,
      triangulation: earthTriangulation,
      depth: { enable: true },
      blend: this.getBlend(),
    });
    return [model];
  }

  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'normal',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Normal',
        shaderLocation: 7,
        buffer: {
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
          normal: number[],
        ) => {
          return normal;
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
        shaderLocation: 8,
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
