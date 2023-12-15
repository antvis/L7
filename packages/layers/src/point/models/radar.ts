import {
  AttributeType,
  gl,
  IAnimateOption,
  IAttribute,
  IElements,
  IEncodeFeature,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { IPointLayerStyleOptions, SizeUnitType } from '../../core/interface';
import { PointFillTriangulation } from '../../core/triangulation';

import pointFillFrag from '../shaders/radar/radar_frag.glsl';
import pointFillVert from '../shaders/radar/radar_vert.glsl';
import { ShaderLocation } from '../../core/CommonStyleAttribute';

export default class RadarModel extends BaseModel {

  protected getCommonUniformsInfo(): { uniformsArray: number[]; uniformsLength: number; uniformsOption:{[key: string]: any}  } {
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
     };//1+1+1+1
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
      inject:this.getInject(),
      depth: { enable: false },
    });
    return [model];
  }

  // overwrite baseModel func
  protected animateOption2Array(option: Partial<IAnimateOption>): number[] {
    return [option.enable ? 0 : 1.0, option.speed || 1, option.rings || 3, 0];
  }
  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'extrudeAndSize',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_ExtrudeAndSize',
        shaderLocation: ShaderLocation.EXTRUDE,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 4,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const extrude = [1, 1, 0, -1, 1, 0, -1, -1, 0, 1, -1, 0];
          const extrudeIndex = (attributeIdx % 4) * 3;
          const { size = 5 } = feature;
          const a_Size =  Array.isArray(size) ? size[0] : size as number;
          return [
            extrude[extrudeIndex],
            extrude[extrudeIndex + 1],
            extrude[extrudeIndex + 2],
            a_Size
          ];
        },
      },
    });
  }
}
