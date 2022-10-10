import { ILayer } from '../layer/ILayerService';
import { IFramebuffer } from './IFramebuffer';
import { ITexture2D } from './ITexture2D';

export enum PassType {
  Normal = 'normal',
  PostProcessing = 'post-processing',
}

/**
 * Pass 分两类：
 * 1. 渲染相关 eg. ClearPass、RenderPass、PickingPass、ShadowPass
 * 2. PostProcessing eg. CopyPass、BlurPass
 * 另外考虑到 Pass 之间严格的执行顺序，render 方法必须是异步的
 */
export interface IPass<InitializationOptions> {
  getName(): string;
  getType(): PassType;
  init(layer: ILayer, config?: Partial<InitializationOptions>): void;
  render(layer: ILayer, tex?: ITexture2D): void;
}

/**
 * PostProcessing，自动切换 renderTarget
 * 例如最后一个 PostProcessingPass 自动切换 renderTarget 为屏幕
 */
export interface IPostProcessingPass<InitializationOptions>
  extends IPass<InitializationOptions> {
  setRenderToScreen(renderToScreen: boolean): void;
  setName(name: string): void;
  isEnabled(): boolean;
  setEnabled(enabled: boolean): void;
  updateOptions(config: Partial<InitializationOptions>): void;
}

export interface IPostProcessor {
  getReadFBO(): IFramebuffer;
  getWriteFBO(): IFramebuffer;
  resize(viewportWidth: number, viewportHeight: number): void;
  add<InitializationOptions>(
    pass: IPostProcessingPass<InitializationOptions>,
    layer: ILayer,
    config?: Partial<InitializationOptions>,
  ): void;
  render(layer: ILayer): Promise<unknown>;
  getPostProcessingPassByName(
    name: string,
  ): IPostProcessingPass<unknown> | undefined;
}

export interface IMultiPassRenderer {
  getPostProcessor(): IPostProcessor;
  resize(viewportWidth: number, viewportHeight: number): void;
  add<InitializationOptions>(
    pass: IPass<InitializationOptions>,
    config?: Partial<InitializationOptions>,
  ): void;
  render(): void;
  getRenderFlag(): boolean;
  setRenderFlag(enabled: boolean): void;
  setLayer(layer: ILayer): void;
  destroy(): void;
}
