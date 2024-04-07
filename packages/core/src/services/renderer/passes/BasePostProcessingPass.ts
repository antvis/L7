// lodashUtil
import { lodashUtil } from '@antv/l7-utils';
import quad from '../../../shaders/post-processing/quad.glsl';
import type { ILayer } from '../../layer/ILayerService';
import type { IShaderModuleService } from '../../shader/IShaderModuleService';
import type { IModel } from '../IModel';
import type { IPostProcessingPass } from '../IMultiPassRenderer';
import { PassType } from '../IMultiPassRenderer';
import type { IRendererService } from '../IRendererService';
import type { ITexture2D } from '../ITexture2D';
import type { IUniform } from '../IUniform';
import { gl } from '../gl';
const { camelCase, isNil, upperFirst } = lodashUtil;

/**
 * 后处理 Pass 基类，通过 PostProcessor 驱动。
 *
 * 约定使用 u_Texture 传递渲染纹理。
 */
export default class BasePostProcessingPass<InitializationOptions = {}>
  implements IPostProcessingPass<InitializationOptions>
{
  protected shaderModuleService: IShaderModuleService;
  protected rendererService: IRendererService;

  protected config: Partial<InitializationOptions> | undefined;

  protected quad: string = quad;

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
    this.config = config;
    this.rendererService = layer.getContainer().rendererService;
    this.shaderModuleService = layer.getContainer().shaderModuleService;

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
        // @ts-ignore
        u_Texture: null,
        ...uniforms,
        ...(this.config && this.convertOptionsToUniforms(this.config)),
      },
      depth: {
        enable: false,
      },
      count: 3,
      blend: {
        // copy pass 需要混合
        enable: this.getName() === 'copy',
      },
    });
  }

  public render(layer: ILayer, tex?: ITexture2D) {
    const postProcessor = layer.multiPassRenderer.getPostProcessor();
    const { useFramebuffer, getViewportSize, clear } = this.rendererService;
    const { width, height } = getViewportSize();
    useFramebuffer(this.renderToScreen ? null : postProcessor.getWriteFBO(), () => {
      clear({
        framebuffer: postProcessor.getWriteFBO(),
        color: [0, 0, 0, 0],
        depth: 1,
        stencil: 0,
      });

      const uniformOptions: { [key: string]: any } = {
        u_BloomFinal: 0.0,
        u_Texture: postProcessor.getReadFBO(),
        // u_Texture: tex ? tex : postProcessor.getReadFBO(),
        u_ViewportSize: [width, height],
        ...this.convertOptionsToUniforms(this.optionsToUpdate),
      };
      if (tex) {
        uniformOptions.u_BloomFinal = 1.0;
        uniformOptions.u_Texture2 = tex;
      }
      this.model.draw({
        uniforms: uniformOptions,
      });
    });
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

  protected convertOptionsToUniforms(options: Partial<InitializationOptions>): {
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
