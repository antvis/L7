import { gl, IModel } from '@antv/l7-core';
import { isNumber } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { IMaskLayerStyleOptions } from '../../core/interface';
import { polygonTriangulation } from '../../core/triangulation';
import mask_frag from '../shaders/mask_frag.glsl';
import mask_vert from '../shaders/mask_vert.glsl';

export default class MaskModel extends BaseModel {
  public getUninforms() {
    const {
      opacity = 0,
    } = this.layer.getLayerConfig() as IMaskLayerStyleOptions;
    return {
      u_opacity: isNumber(opacity) ? opacity : 0.0,
    };
  }

  public initModels(callbackModel: (models: IModel[]) => void) {
    this.buildModels(callbackModel);
  }

  public async buildModels(callbackModel: (models: IModel[]) => void) {
    this.layer
      .buildLayerModel({
        moduleName: 'mask',
        vertexShader: mask_vert,
        fragmentShader: mask_frag,
        triangulation: polygonTriangulation,
        depth: { enable: false },
        blend: this.getBlend(),
        stencil: {
          enable: true,
          mask: 0xff,
          func: {
            cmp: gl.ALWAYS,
            ref: 1,
            mask: 0xff,
          },
          opFront: {
            fail: gl.REPLACE,
            zfail: gl.REPLACE,
            zpass: gl.REPLACE,
          },
        },
      })
      .then((model) => {
        callbackModel([model]);
      })
      .catch((err) => {
        console.warn(err);
        callbackModel([]);
      });
  }

  public clearModels() {
    this.dataTexture?.destroy();
    this.layerService.clear();
  }

  protected registerBuiltinAttributes() {
    return '';
  }
}
