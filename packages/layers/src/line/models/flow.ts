import type { IEncodeFeature, IModel } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import { fp64LowPart } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import type { IFlowLineStyleOptions } from '../../core/interface';
import { FlowLineTriangulation } from '../../core/line_trangluation';
import flow_line_frag from '../shaders/flow/flow_line_frag.glsl';
import flow_line_vert from '../shaders/flow/flow_line_vert.glsl';

export default class FlowLineModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      SIZE: 9,
      INSTANCE: 10,
      INSTANCE_64LOW: 11,
      NORMAL: 12,
    });
  }
  protected getCommonUniformsInfo(): {
    uniformsArray: number[];
    uniformsLength: number;
    uniformsOption: { [key: string]: any };
  } {
    const {
      gapWidth = 2,
      strokeWidth = 1,
      strokeOpacity = 1,
    } = this.layer.getLayerConfig() as IFlowLineStyleOptions;

    const commonOptions = {
      u_gap_width: gapWidth,
      u_stroke_width: strokeWidth,
      u_stroke_opacity: strokeOpacity,
    };
    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
  }

  public async initModels(): Promise<IModel[]> {
    this.initUniformsBuffer();
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    const modelFill = await this.layer.buildLayerModel({
      moduleName: 'flow_line',
      vertexShader: flow_line_vert,
      fragmentShader: flow_line_frag,
      defines: this.getDefines(),
      inject: this.getInject(),
      triangulation: FlowLineTriangulation,
      styleOption: (this.layer.getLayerConfig() as IFlowLineStyleOptions).symbol,
      primitive: gl.TRIANGLES,
      depth: { enable: false },
      pick: false,
    });
    return [modelFill];
  }
  protected registerBuiltinAttributes() {
    // 注册 Style 参与数据映射的内置属性
    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size', // 宽度
        shaderLocation: this.attributeLocation.SIZE,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (feature: IEncodeFeature) => {
          const { size = 1 } = feature;
          return Array.isArray(size) ? [size[0], size[1]] : [size as number, 0];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'instance', // 弧线起始点信息
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Instance',
        shaderLocation: this.attributeLocation.INSTANCE,
        buffer: {
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 4,
        update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
          return [vertex[3], vertex[4], vertex[5], vertex[6]];
        },
      },
    });

    // save low part for enabled double precision INSTANCE attribute
    this.styleAttributeService.registerStyleAttribute({
      name: 'instance64Low',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Instance64Low',
        shaderLocation: this.attributeLocation.INSTANCE_64LOW,
        buffer: {
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 4,
        update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
          return [
            fp64LowPart(vertex[3]),
            fp64LowPart(vertex[4]),
            fp64LowPart(vertex[5]),
            fp64LowPart(vertex[6]),
          ];
        },
      },
    });

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
  }
}
