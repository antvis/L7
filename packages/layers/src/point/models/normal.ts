import type { IEncodeFeature, IModel } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import type { IPointLayerStyleOptions } from '../../core/interface';
import normalFrag from '../shaders/normal/normal_frag.glsl';
import normalVert from '../shaders/normal/normal_vert.glsl';

export function PointTriangulation(feature: IEncodeFeature) {
  const coordinates = feature.coordinates as number[];
  return {
    vertices: [...coordinates],
    indices: [0],
    size: coordinates.length,
  };
}

export default class NormalModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      SIZE: 9,
    });
  }

  public getDefaultStyle(): Partial<IPointLayerStyleOptions> {
    return {
      blend: 'additive',
    };
  }
  protected getCommonUniformsInfo(): {
    uniformsArray: number[];
    uniformsLength: number;
    uniformsOption: { [key: string]: any };
  } {
    const commonOptions = {
      u_size_scale: 0.5,
    };
    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
  }

  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    this.layer.triangulation = PointTriangulation;
    this.initUniformsBuffer();
    const model = await this.layer.buildLayerModel({
      moduleName: 'pointNormal',
      vertexShader: normalVert,
      fragmentShader: normalFrag,
      triangulation: PointTriangulation,
      defines: this.getDefines(),
      inject: this.getInject(),
      depth: { enable: false },
      primitive: gl.POINTS,
      pick: false,
    });
    return [model];
  }

  public clearModels() {
    return;
  }

  protected registerBuiltinAttributes() {
    // 注册 Position 属性 64 位地位部分，经纬度数据开启双精度，避免大于 20层级以上出现数据偏移
    this.registerPosition64LowAttribute();

    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        shaderLocation: this.attributeLocation.SIZE,
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (feature: IEncodeFeature) => {
          const { size = 1 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });
  }
}
