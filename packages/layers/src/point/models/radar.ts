import type {
  IAnimateOption,
  IAttribute,
  IElements,
  IEncodeFeature,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import type { IPointLayerStyleOptions } from '../../core/interface';
import { SizeUnitType } from '../../core/interface';
import { PointFillTriangulation } from '../../core/triangulation';
import pointFillFrag from '../shaders/radar/radar_frag.glsl';
import pointFillVert from '../shaders/radar/radar_vert.glsl';

export default class RadarModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      SIZE: 9,
      EXTRUDE: 10,
    });
  }

  protected getCommonUniformsInfo(): {
    uniformsArray: number[];
    uniformsLength: number;
    uniformsOption: { [key: string]: any };
  } {
    const {
      blend,
      speed = 1,
      unit = 'pixel',
    } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    const commonOptions = {
      u_additive: blend === 'additive' ? 1.0 : 0.0,
      u_size_unit: SizeUnitType[unit] as SizeUnitType,
      u_speed: speed,
      u_time: this.layer.getLayerAnimateTime(),
    }; //1+1+1+1
    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);

    return commonBufferInfo;
  }
  public getAnimateUniforms(): IModelUniform {
    return {};
  }

  public getAttribute(): {
    attributes: {
      [attributeName: string]: IAttribute;
    };
    elements: IElements;
  } {
    return this.styleAttributeService.createAttributesAndIndices(
      this.layer.getEncodedData(),
      PointFillTriangulation,
    );
  }

  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    this.initUniformsBuffer();
    const model = await this.layer.buildLayerModel({
      moduleName: 'pointRadar',
      vertexShader: pointFillVert,
      fragmentShader: pointFillFrag,
      triangulation: PointFillTriangulation,
      defines: this.getDefines(),
      inject: this.getInject(),
      depth: { enable: false },
    });
    return [model];
  }

  // overwrite baseModel func
  protected animateOption2Array(option: Partial<IAnimateOption>): number[] {
    return [option.enable ? 0 : 1.0, option.speed || 1, option.rings || 3, 0];
  }
  protected registerBuiltinAttributes() {
    // 注册 Position 属性 64 位地位部分，经纬度数据开启双精度，避免大于 20层级以上出现数据偏移
    this.registerPosition64LowAttribute();

    this.styleAttributeService.registerStyleAttribute({
      name: 'extrude',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Extrude',
        shaderLocation: this.attributeLocation.EXTRUDE,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const extrude = [1, 1, 0, -1, 1, 0, -1, -1, 0, 1, -1, 0];
          const extrudeIndex = (attributeIdx % 4) * 3;
          return [extrude[extrudeIndex], extrude[extrudeIndex + 1], extrude[extrudeIndex + 2]];
        },
      },
    });

    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        shaderLocation: this.attributeLocation.SIZE,
        name: 'a_Size',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (feature: IEncodeFeature) => {
          const { size = 5 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });
  }
}
