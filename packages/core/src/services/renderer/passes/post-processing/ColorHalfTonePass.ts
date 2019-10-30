import { inject, injectable } from 'inversify';
import { isNil } from 'lodash';
import colorHalftone from '../../../../shaders/post-processing/colorhalftone.glsl';
import quad from '../../../../shaders/post-processing/quad.glsl';
import { TYPES } from '../../../../types';
import { IRendererService } from '../../IRendererService';
import { IUniform } from '../../IUniform';
import BasePostProcessingPass from '../BasePostProcessingPass';

export interface IColorHalftonePassConfig {
  center: [number, number];
  angle: number;
  size: number;
}

@injectable()
export default class ColorHalftonePass extends BasePostProcessingPass<
  IColorHalftonePassConfig
> {
  @inject(TYPES.IRendererService)
  protected readonly rendererService: IRendererService;

  public getName() {
    return 'colorHalftone';
  }

  protected setupShaders() {
    this.shaderModule.registerModule('colorhalftone-pass', {
      vs: quad,
      fs: colorHalftone,
    });

    const { vs, fs, uniforms } = this.shaderModule.getModule(
      'colorhalftone-pass',
    );
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

  protected convertOptionsToUniforms(
    options: Partial<IColorHalftonePassConfig>,
  ): {
    [uniformName: string]: IUniform;
  } | void {
    const uniforms: {
      [key: string]: IUniform;
    } = {};

    if (!isNil(options.center)) {
      uniforms.u_Center = options.center;
    }

    if (!isNil(options.angle)) {
      uniforms.u_Angle = options.angle;
    }

    if (!isNil(options.size)) {
      uniforms.u_Size = options.size;
    }

    return uniforms;
  }
}
