import { lodashUtil } from '@antv/l7-utils';
import blur from '../../../../shaders/post-processing/bloom.glsl';
import quad from '../../../../shaders/post-processing/quad.glsl';
import type { IUniform } from '../../IUniform';
import BasePostProcessingPass from '../BasePostProcessingPass';
const { isNil } = lodashUtil;
export interface IBloomPassConfig {
  bloomBaseRadio: number;
  bloomRadius: number;
  bloomIntensity: number;
}

export default class BloomPass extends BasePostProcessingPass<IBloomPassConfig> {
  protected setupShaders() {
    this.shaderModuleService.registerModule('blur-pass', {
      vs: quad,
      fs: blur,
    });

    const { vs, fs, uniforms } = this.shaderModuleService.getModule('blur-pass');
    const { width, height } = this.rendererService.getViewportSize();

    return {
      vs,
      fs,
      uniforms: {
        ...uniforms,
        u_ViewportSize: [width, height],
      },
    };
  }

  protected convertOptionsToUniforms(options: Partial<IBloomPassConfig>): {
    [uniformName: string]: IUniform;
  } | void {
    const uniforms: {
      [key: string]: IUniform;
    } = {};

    if (!isNil(options.bloomRadius)) {
      uniforms.u_radius = options.bloomRadius;
    }
    if (!isNil(options.bloomIntensity)) {
      uniforms.u_intensity = options.bloomIntensity;
    }
    if (!isNil(options.bloomBaseRadio)) {
      uniforms.u_baseRadio = options.bloomBaseRadio;
    }

    return uniforms;
  }
}
