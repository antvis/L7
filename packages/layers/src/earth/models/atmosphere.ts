import type { IEncodeFeature, IModel } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import { lodashUtil } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { earthTriangulation } from '../../core/triangulation';
import atmoSphereFrag from '../shaders/atmosphere/atmosphere_frag.glsl';
import atmoSphereVert from '../shaders/atmosphere/atmosphere_vert.glsl';

interface IAtmoSphereLayerStyleOptions {
  opacity: number;
}
const { isNumber } = lodashUtil;

export default class EarthAtomSphereModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      NORMAL: 9,
      UV: 10,
    });
  }

  protected getCommonUniformsInfo(): {
    uniformsArray: number[];
    uniformsLength: number;
    uniformsOption: { [key: string]: any };
  } {
    const { opacity = 1 } = this.layer.getLayerConfig() as IAtmoSphereLayerStyleOptions;
    const commonOptions = {
      u_opacity: isNumber(opacity) ? opacity : 1.0,
    };
    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
  }

  public async initModels(): Promise<IModel[]> {
    this.initUniformsBuffer();
    return this.buildModels();
  }

  public clearModels() {
    return '';
  }

  public async buildModels(): Promise<IModel[]> {
    // TODO: 调整图层的绘制顺序 地球大气层
    this.layer.zIndex = -997;
    const model = await this.layer.buildLayerModel({
      moduleName: 'earthAtmoSphere',
      vertexShader: atmoSphereVert,
      fragmentShader: atmoSphereFrag,
      defines: this.getDefines(),
      triangulation: earthTriangulation,
      depth: { enable: false },
      blend: this.getBlend(),
    });
    return [model];
  }

  protected registerBuiltinAttributes() {
    // point layer size;
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
