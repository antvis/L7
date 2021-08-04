import { injectable } from 'inversify';
import 'reflect-metadata';
import copy from '../../../../shaders/post-processing/copy.glsl';
import quad from '../../../../shaders/post-processing/quad.glsl';
import BasePostProcessingPass from '../BasePostProcessingPass';

@injectable()
export default class CopyPass extends BasePostProcessingPass {
  public setupShaders() {
    this.shaderModuleService.registerModule('copy-pass', {
      vs: quad,
      fs: copy,
    });

    return this.shaderModuleService.getModule('copy-pass');
  }
}
