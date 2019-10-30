import { injectable } from 'inversify';
import copy from '../../../../shaders/post-processing/copy.glsl';
import quad from '../../../../shaders/post-processing/quad.glsl';
import { IUniform } from '../../IUniform';
import BasePostProcessingPass from '../BasePostProcessingPass';

@injectable()
export default class CopyPass extends BasePostProcessingPass {
  public getName() {
    return 'copy';
  }

  public setupShaders() {
    this.shaderModule.registerModule('copy-pass', {
      vs: quad,
      fs: copy,
    });

    return this.shaderModule.getModule('copy-pass');
  }

  protected convertOptionsToUniforms(
    options: Partial<{}>,
  ): {
    [uniformName: string]: IUniform;
  } | void {
    return {};
  }
}
