import type { IEncodeFeature, IModel } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import { rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { ShaderLocation } from '../../core/CommonStyleAttribute';
import type { ILineLayerStyleOptions } from '../../core/interface';
import { SimpleLineTriangulation } from '../../core/triangulation';
import simple_line_frag from '../shaders/simple/simpleline_frag.glsl';
import simple_line_vert from '../shaders/simple/simpleline_vert.glsl';

export default class SimpleLineModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: 8,
      SIZE: 9,
    });
  }
  protected getCommonUniformsInfo(): {
    uniformsArray: number[];
    uniformsLength: number;
    uniformsOption: { [key: string]: any };
  } {
    const {
      sourceColor,
      targetColor,
      lineType = 'solid',
      dashArray = [10, 5, 0, 0],
      vertexHeightScale = 20.0,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;
    let u_dash_array = dashArray;
    if (lineType !== 'dash') {
      u_dash_array = [0, 0, 0, 0];
    }
    if (u_dash_array.length === 2) {
      u_dash_array.push(0, 0);
    }
    // 转化渐变色
    let useLinearColor = 0; // 默认不生效
    let sourceColorArr = [0, 0, 0, 0];
    let targetColorArr = [0, 0, 0, 0];
    if (sourceColor && targetColor) {
      sourceColorArr = rgb2arr(sourceColor);
      targetColorArr = rgb2arr(targetColor);
      useLinearColor = 1;
    }

    const commonOptions = {
      u_sourceColor: sourceColorArr,
      u_targetColor: targetColorArr,
      u_dash_array,
      // 顶点高度 scale
      u_vertexScale: vertexHeightScale,
      // 渐变色支持参数
      u_linearColor: useLinearColor,
    };
    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
  }

  public async initModels(): Promise<IModel[]> {
    return this.buildModels();
  }

  public getShaders(): { frag: string; vert: string; type: string } {
    return {
      frag: simple_line_frag,
      vert: simple_line_vert,
      type: 'lineSimpleNormal',
    };
  }

  public async buildModels(): Promise<IModel[]> {
    this.initUniformsBuffer();
    const { frag, vert, type } = this.getShaders();
    const model = await this.layer.buildLayerModel({
      moduleName: type,
      vertexShader: vert,
      fragmentShader: frag,
      triangulation: SimpleLineTriangulation,
      defines: this.getDefines(),
      inject: this.getInject(),
      primitive: gl.LINES,
      depth: { enable: false },

      pick: false,
    });
    return [model];
  }
  protected registerBuiltinAttributes() {
    // this.styleAttributeService.registerStyleAttribute({
    //   name: 'distance',
    //   type: AttributeType.Attribute,
    //   descriptor: {
    //     name: 'a_Distance',
    //     shaderLocation: 14,
    //     buffer: {
    //       // give the WebGL driver a hint that this buffer may change
    //       usage: gl.STATIC_DRAW,
    //       data: [],
    //       type: gl.FLOAT,
    //     },
    //     size: 1,
    //     update: (
    //       feature: IEncodeFeature,
    //       featureIdx: number,
    //       vertex: number[],
    //     ) => {
    //       return [vertex[3]];
    //     },
    //   },
    // });
    // this.styleAttributeService.registerStyleAttribute({
    //   name: 'total_distance',
    //   type: AttributeType.Attribute,
    //   descriptor: {
    //     name: 'a_Total_Distance',
    //     shaderLocation: 13,//枚举不够了,先固定写值吧,在shader中location也成一致的并且不与其他的重复就行了
    //     buffer: {
    //       // give the WebGL driver a hint that this buffer may change
    //       usage: gl.STATIC_DRAW,
    //       data: [],
    //       type: gl.FLOAT,
    //     },
    //     size: 1,
    //     update: (
    //       feature: IEncodeFeature,
    //       featureIdx: number,
    //       vertex: number[],
    //     ) => {
    //       return [vertex[5]];
    //     },
    //   },
    // });
    //size.x,size,y,distance,totalDistance
    this.styleAttributeService.registerStyleAttribute({
      name: 'sizeDistanceAndTotalDistance',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_SizeDistanceAndTotalDistance',
        shaderLocation: ShaderLocation.SIZE,
        buffer: {
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 4,
        update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
          const { size = 1 } = feature;
          const a_Size = Array.isArray(size) ? [size[0], size[1]] : [size as number, 0];
          return [a_Size[0], a_Size[1], vertex[3], vertex[5]];
        },
      },
    });
  }
}
