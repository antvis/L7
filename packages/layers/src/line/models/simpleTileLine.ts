import {
  gl,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import { getMask } from '@antv/l7-utils';
import { isNumber } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { ILineLayerStyleOptions } from '../../core/interface';
import { TileSimpleLineTriangulation } from '../../core/triangulation';
import simple_line_frag from '../shaders/tile/simpleline_frag.glsl';
import simple_line_vert from '../shaders/tile/simpleline_vert.glsl';
export default class SimpleLineModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;
    return {
      u_opacity: isNumber(opacity) ? opacity : 1.0,
    };
  }

  public initModels(callbackModel: (models: IModel[]) => void) {
    this.buildModels(callbackModel);
  }

  public clearModels() {
  }

  public buildModels(callbackModel: (models: IModel[]) => void) {
    const {
      mask = false,
      maskInside = true,
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;

    this.layer
      .buildLayerModel({
        moduleName: 'lineTileSimpleNormal',
        vertexShader: simple_line_vert,
        fragmentShader: simple_line_frag,
        triangulation: TileSimpleLineTriangulation,
        primitive: gl.LINES,
        depth: { enable: false },
        blend: this.getBlend(),
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
  }
}
