import type { IEncodeFeature, IModel, ITexture2D } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';

import BaseModel from '../../core/BaseModel';
import { earthTriangulation } from '../../core/triangulation';

import baseFrag from '../shaders/base/base_frag.glsl';
import baseVert from '../shaders/base/base_vert.glsl';

export default class BaseEarthModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      NORMAL: 9,
      UV: 10,
    });
  }

  protected texture: ITexture2D;
  // T: 当前的地球时间 - 控制太阳的方位
  private earthTime: number = 3.4;
  private sunX = 1000;
  private sunY = 1000;
  private sunZ = 1000;
  private sunRadius = Math.sqrt(
    this.sunX * this.sunX + this.sunY * this.sunY + this.sunZ * this.sunZ,
  );
  protected getCommonUniformsInfo(): {
    uniformsArray: number[];
    uniformsLength: number;
    uniformsOption: { [key: string]: any };
  } {
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

    const commonOptions = {
      u_sunLight: [this.sunX, this.sunY, this.sunZ, 0.0],
      u_ambientRatio: globalOptions?.ambientRatio || 0.6, // 环境光
      u_diffuseRatio: globalOptions?.diffuseRatio || 0.4, // 漫反射
      u_specularRatio: globalOptions?.specularRatio || 0.1, // 高光反射
      // u_texture: this.texture,
    };
    this.textures = [this.texture];
    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
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
    source.data.images.then((imageData: HTMLImageElement[]) => {
      this.texture = createTexture2D({
        data: imageData[0],
        width: imageData[0].width,
        height: imageData[0].height,
      });
      this.textures = [this.texture];
      this.layerService.reRender();
    });
    this.initUniformsBuffer();
    return this.buildModels();
  }

  public clearModels() {
    return '';
  }

  public async buildModels(): Promise<IModel[]> {
    // Tip: 调整图层的绘制顺序 地球大气层
    this.layer.zIndex = -998;

    const model = await this.layer.buildLayerModel({
      moduleName: 'earthBase',
      vertexShader: baseVert,
      fragmentShader: baseFrag,
      defines: this.getDefines(),
      triangulation: earthTriangulation,
      depth: { enable: true },
      blend: this.getBlend(),
    });
    return [model];
  }

  protected registerBuiltinAttributes() {
    // this.styleAttributeService.registerStyleAttribute({
    //   name: 'size',
    //   type: AttributeType.Attribute,
    //   descriptor: {
    //     name: 'a_Size',
    //     shaderLocation: this.attributeLocation.SIZE,
    //     buffer: {
    //       usage: gl.DYNAMIC_DRAW,
    //       data: [],
    //       type: gl.FLOAT,
    //     },
    //     size: 1,
    //     update: (feature: IEncodeFeature) => {
    //       const { size = 1 } = feature;
    //       return Array.isArray(size) ? [size[0]] : [size as number];
    //     },
    //   },
    // });

    this.styleAttributeService.registerStyleAttribute({
      name: 'normal',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Normal',
        shaderLocation: this.attributeLocation.NORMAL,
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
