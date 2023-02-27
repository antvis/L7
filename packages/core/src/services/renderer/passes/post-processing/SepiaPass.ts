import { injectable } from 'inversify';
import 'reflect-metadata';
import quad from '../../../../shaders/post-processing/quad.glsl';
import sepia from '../../../../shaders/post-processing/sepia.glsl';
import BasePostProcessingPass from '../BasePostProcessingPass';

export interface ISepiaPassConfig {
  amount: number;
}

@injectable()
export default class SepiaPass extends BasePostProcessingPass<ISepiaPassConfig> {
  public setupShaders() {
    this.shaderModuleService.registerModule('sepia-pass', {
      vs: quad,
      fs: sepia,
    });

    return this.shaderModuleService.getModule('sepia-pass');
  }
}
