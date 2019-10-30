import { inject, injectable } from 'inversify';
import { isNil } from 'lodash';
import hexagonalPixelate from '../../../../shaders/post-processing/hexagonalpixelate.glsl';
import quad from '../../../../shaders/post-processing/quad.glsl';
import { TYPES } from '../../../../types';
import { IRendererService } from '../../IRendererService';
import { IUniform } from '../../IUniform';
import BasePostProcessingPass from '../BasePostProcessingPass';

export interface IHexagonalPixelatePassConfig {
  center: [number, number];
  scale: number;
}

@injectable()
export default class HexagonalPixelatePass extends BasePostProcessingPass<
  IHexagonalPixelatePassConfig
> {
  @inject(TYPES.IRendererService)
  protected readonly rendererService: IRendererService;

  public getName() {
    return 'hexagonalPixelate';
  }

  protected setupShaders() {
    this.shaderModule.registerModule('hexagonalpixelate-pass', {
      vs: quad,
      fs: hexagonalPixelate,
    });

    const { vs, fs, uniforms } = this.shaderModule.getModule(
      'hexagonalpixelate-pass',
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
    options: Partial<IHexagonalPixelatePassConfig>,
  ): {
    [uniformName: string]: IUniform;
  } | void {
    const uniforms: {
      [key: string]: IUniform;
    } = {};

    if (!isNil(options.center)) {
      uniforms.u_Center = options.center;
    }

    if (!isNil(options.scale)) {
      uniforms.u_Scale = options.scale;
    }

    return uniforms;
  }
}
