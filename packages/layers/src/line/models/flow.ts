import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import { rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { IFlowLineStyleOptions } from '../../core/interface';
import { FlowLineFillTriangulation } from '../../core/triangulation';
import flow_line_frag from '../shaders/flow/flow_line_frag.glsl';

// linear simple line shader

import flow_line_vert from '../shaders/flow/flow_line_vert.glsl';
export default class FlowLineModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      gapWidth = 2,
      strokeWidth = 1,
      stroke = '#000',
      strokeOpacity = 1,
    } = this.layer.getLayerConfig() as IFlowLineStyleOptions;

    return {
      // u_opacity: opacity,
      // u_offsets: offsets,
      u_gap_width: gapWidth,
      u_stroke_width: strokeWidth,
      u_stroke: rgb2arr(stroke),
      u_stroke_opacity: strokeOpacity,
      ...this.getStyleAttribute(),
    };
  }

  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    const modelFill = await this.layer.buildLayerModel({
      moduleName: 'flow_line',
      vertexShader: flow_line_vert,
      fragmentShader: flow_line_frag,
      inject: this.getInject(),
      triangulation: FlowLineFillTriangulation,
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
        buffer: {
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 4,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
        ) => {
          return [vertex[3], vertex[4], vertex[5], vertex[6]];
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
  }
}
