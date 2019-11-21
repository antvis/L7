import { injectable } from 'inversify';
import { isNil } from 'lodash';
import noise from '../../../../shaders/post-processing/noise.glsl';
import quad from '../../../../shaders/post-processing/quad.glsl';
import { IUniform } from '../../IUniform';
import BasePostProcessingPass from '../BasePostProcessingPass';

export interface INoisePassConfig {
  amount: number;
}

@injectable()
export default class NoisePass extends BasePostProcessingPass<
  INoisePassConfig
> {
  public getName() {
    return 'noise';
  }

  public setupShaders() {
    this.shaderModule.registerModule('noise-pass', {
      vs: quad,
      fs: noise,
    });

    return this.shaderModule.getModule('noise-pass');
  }

  protected convertOptionsToUniforms(
    options: Partial<INoisePassConfig>,
  ): {
    [uniformName: string]: IUniform;
  } | void {
    const uniforms: {
      [key: string]: IUniform;
    } = {};

    if (!isNil(options.amount)) {
      uniforms.u_Amount = options.amount;
    }

    return uniforms;
  }
}
