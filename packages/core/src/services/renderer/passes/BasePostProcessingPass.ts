import { inject, injectable } from 'inversify';
import { camelCase, isNil, upperFirst } from 'lodash';
import 'reflect-metadata';
import { IShaderModuleService } from '../../shader/IShaderModuleService';

import { IModel } from '../IModel';
import { IRendererService } from '../IRendererService';

import quad from '../../../shaders/post-processing/quad.glsl';
import { TYPES } from '../../../types';
import { ILayer } from '../../layer/ILayerService';
import { ITexture2D } from '../ITexture2D';
import { IUniform } from '../IUniform';

/**
 * 后处理 Pass 基类，通过 PostProcessor 驱动。
 *
 * 约定使用 u_Texture 传递渲染纹理。
 */
@injectable()
export default class BasePostProcessingPass<InitializationOptions = {}>
  implements IPostProcessingPass<InitializationOptions> {
  @inject(TYPES.IShaderModuleService)
  protected shaderModuleService: IShaderModuleService;

  protected rendererService: IRendererService;

  protected config: Partial<InitializationOptions> | undefined;

  protected quad: string = quad;

  /**
   * 启用开关
   */
  private enabled: boolean = true;



  /**
   * 效果名，便于在图层中引用
   */
  private name: string;

  private optionsToUpdate: Partial<InitializationOptions> = {};

  public getName() {
    return this.name;
  }

  public setName(name: string) {
    this.name = name;
  }

  public getType() {
    return PassType.PostProcessing;
  }

  public init(layer: ILayer, config?: Partial<InitializationOptions>) {

  }

  public render(layer: ILayer, tex?: ITexture2D) {
   
  }

  public isEnabled() {
    return this.enabled;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public setRenderToScreen(renderToScreen: boolean) {
    this.renderToScreen = renderToScreen;
  }

  public updateOptions(config: Partial<InitializationOptions>) {
    this.optionsToUpdate = {
      ...this.optionsToUpdate,
      ...config,
    };
  }

  protected setupShaders(): {
    vs: string;
    fs: string;
    uniforms?: { [key: string]: IUniform };
  } {
    throw new Error('Method not implemented.');
  }

  protected convertOptionsToUniforms(
    options: Partial<InitializationOptions>,
  ): {
    [uniformName: string]: IUniform;
  } | void {
    const uniforms: {
      [key: string]: IUniform;
    } = {};

    Object.keys(options).forEach((optionName) => {
      // @ts-ignore
      if (!isNil(options[optionName])) {
        uniforms[`u_${upperFirst(camelCase(optionName))}`] =
          // @ts-ignore
          options[optionName];
      }
    });

    return uniforms;
  }
}
