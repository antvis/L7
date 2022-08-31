import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import { getMask } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { ILineLayerStyleOptions } from '../../core/interface';
import { LineTriangulation } from '../../core/triangulation';

import line_tile_frag from '../shaders/tile/line_tile_frag.glsl';
import line_tile_vert from '../shaders/tile/line_tile_vert.glsl';

export default class LineModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      coord = 'lnglat',
      tileOrigin,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;

    return {
      u_tileOrigin: tileOrigin || [0, 0],
      u_coord: coord === 'lnglat' ? 1.0 : 0.0,
      u_opacity: Number(opacity),
    };
  }

  public initModels(callbackModel: (models: IModel[]) => void) {
    this.buildModels(callbackModel);
  }

  public async buildModels(callbackModel: (models: IModel[]) => void) {
    const {
      mask = false,
      maskInside = true,
      depth = false,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;

    this.layer.triangulation = LineTriangulation;

    this.layer
      .buildLayerModel({
        moduleName: 'lineTile',
        vertexShader: line_tile_vert,
        fragmentShader: line_tile_frag,
        triangulation: LineTriangulation,
        blend: this.getBlend(),
        depth: { enable: depth },
        stencil: getMask(mask, maskInside),
      })
      .then((model) => {
        callbackModel([model]);
      })
      .catch((err) => {
        console.warn(err);
        callbackModel([]);
      });
  }

  protected registerBuiltinAttributes() {
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
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const { size = 1 } = feature;
          return Array.isArray(size) ? [size[0], size[1]] : [size as number, 0];
        },
      },
    });

    // point layer size;
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
      name: 'miter',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Miter',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.STATIC_DRAW,
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
          return [vertex[4]];
        },
      },
    });

  }
}
