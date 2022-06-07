import {
  AttributeType,
  gl,
  IAnimateOption,
  IEncodeFeature,
  ILayerConfig,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import { rgb2arr } from '@antv/l7-utils';
import { isNumber } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { ILineLayerStyleOptions } from '../../core/interface';
import { LineArcTriangulation } from '../../core/triangulation';
import line_arcmini_frag from '../shaders/line_arcmini_frag.glsl';
import line_arcmini_vert from '../shaders/line_arcmini_vert.glsl';

export default class ArcMiniModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      sourceColor,
      targetColor,
      forward = true,
      segmentNumber = 30,
      thetaOffset = 0.314,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;

    // 转化渐变色
    let useLinearColor = 0; // 默认不生效
    let sourceColorArr = [0, 0, 0, 0];
    let targetColorArr = [0, 0, 0, 0];
    if (sourceColor && targetColor) {
      sourceColorArr = rgb2arr(sourceColor);
      targetColorArr = rgb2arr(targetColor);
      useLinearColor = 1;
    }

    return {
      u_thetaOffset: thetaOffset,

      u_opacity: isNumber(opacity) ? opacity : 1.0,

      segmentNumber,
      u_blur: 0.9,
      u_lineDir: forward ? 1 : -1,

      // 渐变色支持参数
      u_linearColor: useLinearColor,
      u_sourceColor: sourceColorArr,
      u_targetColor: targetColorArr,
    };
  }

  public getAnimateUniforms(): IModelUniform {
    const { animateOption } = this.layer.getLayerConfig() as ILayerConfig;
    return {
      u_aimate: this.animateOption2Array(animateOption as IAnimateOption),
      u_time: this.layer.getLayerAnimateTime(),
    };
  }

  public initModels(): IModel[] {
    return this.buildModels();
  }

  public buildModels(): IModel[] {
    const {
      segmentNumber = 30,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;

    return [
      this.layer.buildLayerModel({
        moduleName: 'arc2dminiline',
        vertexShader: line_arcmini_vert,
        fragmentShader: line_arcmini_frag,
        triangulation: LineArcTriangulation,
        depth: { enable: false },
        blend: this.getBlend(),
        segmentNumber,
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
          attributeIdx: number,
        ) => {
          return [vertex[3], vertex[4], vertex[5], vertex[6]];
        },
      },
    });
  }
}
