import { injectable } from 'inversify';
import 'reflect-metadata';
import noise from '../../../../shaders/post-processing/noise.glsl';
import quad from '../../../../shaders/post-processing/quad.glsl';
import BasePostProcessingPass from '../BasePostProcessingPass';

export interface INoisePassConfig {
  amount: number;
}

@injectable()
export default class NoisePass extends BasePostProcessingPass<INoisePassConfig> {
  public setupShaders() {
    this.shaderModuleService.registerModule('noise-pass', {
      vs: quad,
      fs: noise,
    });

    return this.shaderModuleService.getModule('noise-pass');
  }
}
