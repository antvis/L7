import {
  AttributeType,
  BlendType,
  gl,
  IEncodeFeature,
  ILayerConfig,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';

import BaseModel, { styleOffset, styleSingle } from '../../core/BaseModel';
import { earthTriangulation } from '../../core/triangulation';

import baseFrag from '../shaders/base_frag.glsl';
import baseVert from '../shaders/base_vert.glsl';

export default class BaseEarthModel extends BaseModel {
  protected texture: ITexture2D;
  public getUninforms(): IModelUniform {
    const {} = this.layer.getLayerConfig();

    return {
      u_ambientRatio: 0.5, // 环境光
      u_diffuseRatio: 0.3, // 漫反射
      u_specularRatio: 0.2, // 高光反射

      u_texture: this.texture,
    };
  }

  public initModels(): IModel[] {
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
      this.layerService.renderLayers();
    });

    return this.buildModels();
  }

  public clearModels() {
    return '';
  }

  public buildModels(): IModel[] {
    return [
      this.layer.buildLayerModel({
        moduleName: 'baseEarth',
        vertexShader: baseVert,
        fragmentShader: baseFrag,
        triangulation: earthTriangulation,
        depth: { enable: true },
        //   primitive: gl.POINTS,
        blend: this.getBlend(),
      }),
    ];
  }

  protected registerBuiltinAttributes() {
    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const { size = 1 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'normal',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Normal',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
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
