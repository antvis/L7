import {
  gl,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import { getMask, rgb2arr } from '@antv/l7-utils';
import { isNumber } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { ILineLayerStyleOptions } from '../../core/interface';
import { TileSimpleLineTriangulation } from '../../core/triangulation';
import simple_line_frag from '../../tile/shader/minify_frag.glsl';
import simple_line_vert from '../shaders/tile/simpleline_vert.glsl';

import simple_line_map_frag from '../../tile/shader/minify_frag.glsl';
import simple_line_map_vert from '../shaders/tile/simpleline_map_vert.glsl';
export default class SimpleTileLineModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
      usage,
      color = '#fff'
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;
    return {
      u_opacity: isNumber(opacity) ? opacity : 1.0,
      u_color: usage === 'basemap' ? rgb2arr(color): [0, 0, 0, 0]
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
      usage
    } = this.layer.getLayerConfig() as ILineLayerStyleOptions;
    this.layer
      .buildLayerModel({
        moduleName: 'lineTileSimpleNormal_' + usage,
        vertexShader: usage === 'basemap' ? simple_line_map_vert : simple_line_vert,
        fragmentShader: usage === 'basemap' ? simple_line_map_frag : simple_line_frag,
        triangulation: TileSimpleLineTriangulation,
        primitive: gl.LINES,
        depth: { enable: false },
        blend: this.getBlend(),
        stencil: getMask(mask, maskInside),
        pick: false,
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
