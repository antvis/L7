import { injectable } from 'inversify';
import { isNil } from 'lodash';
import quad from '../../../../shaders/post-processing/quad.glsl';
import sepia from '../../../../shaders/post-processing/sepia.glsl';
import { IUniform } from '../../IUniform';
import BasePostProcessingPass from '../BasePostProcessingPass';

export interface ISepiaPassConfig {
  amount: number;
}

@injectable()
export default class SepiaPass extends BasePostProcessingPass<
  ISepiaPassConfig
> {
  public getName() {
    return 'sepia';
  }

  public setupShaders() {
    this.shaderModule.registerModule('sepia-pass', {
      vs: quad,
      fs: sepia,
    });

    return this.shaderModule.getModule('sepia-pass');
  }

  protected convertOptionsToUniforms(
    options: Partial<ISepiaPassConfig>,
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
