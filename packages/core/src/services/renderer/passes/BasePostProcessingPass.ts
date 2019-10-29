import { inject, injectable } from 'inversify';
import {
  gl,
  IModel,
  IRendererService,
  IShaderModuleService,
  lazyInject,
} from '../../../index';
import { TYPES } from '../../../types';
import { ILayer } from '../../layer/ILayerService';
import { IPostProcessingPass, PassType } from '../IMultiPassRenderer';
import { IUniform } from '../IUniform';

/**
 * 后处理 Pass 基类，通过 PostProcessor 驱动。
 *
 * 约定使用 u_Texture 传递渲染纹理。
 */
@injectable()
export default class BasePostProcessingPass<InitializationOptions = {}>
  implements IPostProcessingPass {
  @lazyInject(TYPES.IShaderModuleService)
  protected readonly shaderModule: IShaderModuleService;

  @lazyInject(TYPES.IRendererService)
  protected readonly rendererService: IRendererService;

  protected config: Partial<InitializationOptions> | undefined;

  /**
   * 启用开关
   */
  private enabled: boolean = true;

  /**
   * 是否渲染到屏幕
   */
  private renderToScreen: boolean = false;

  /**
   * 渲染命令
   */
  private model: IModel;

  constructor(config?: Partial<InitializationOptions>) {
    this.config = config;
  }

  public getType() {
    return PassType.PostProcessing;
  }

  public init() {
    const { createAttribute, createBuffer, createModel } = this.rendererService;
    const { vs, fs, uniforms } = this.setupShaders();

    this.model = createModel({
      vs,
      fs,
      attributes: {
        // 使用一个全屏三角形，相比 Quad 顶点数目更少
        a_Position: createAttribute({
          buffer: createBuffer({
            data: [-4, -4, 4, -4, 0, 4],
            type: gl.FLOAT,
          }),
          size: 2,
        }),
      },
      // @ts-ignore
      uniforms: {
        u_Texture: null,
        ...uniforms,
      },
      depth: {
        enable: false,
      },
      count: 3,
    });
  }

  public render(layer: ILayer) {
    const postProcessor = layer.multiPassRenderer.getPostProcessor();
    const { useFramebuffer } = this.rendererService;

    useFramebuffer(
      this.renderToScreen ? null : postProcessor.getWriteFBO(),
      () => {
        this.model.draw({
          uniforms: {
            u_Texture: postProcessor.getReadFBO(),
          },
        });
      },
    );
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

  protected setupShaders(): {
    vs: string;
    fs: string;
    uniforms?: { [key: string]: IUniform };
  } {
    throw new Error('Method not implemented.');
  }
}
