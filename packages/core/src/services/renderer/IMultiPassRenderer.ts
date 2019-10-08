import { ILayer } from '../layer/ILayerService';
import { IFramebuffer } from './IFramebuffer';

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
export interface IPass {
  getType(): PassType;
  init(layer: ILayer): void;
  render(layer: ILayer): void;
}

/**
 * PostProcessing，自动切换 renderTarget
 * 例如最后一个 PostProcessingPass 自动切换 renderTarget 为屏幕
 */
export interface IPostProcessingPass extends IPass {
  setRenderToScreen(renderToScreen: boolean): void;
  isEnabled(): boolean;
  setEnabled(enabled: boolean): void;
}

export interface IPostProcessor {
  getReadFBO(): IFramebuffer;
  getWriteFBO(): IFramebuffer;
  useScreenRenderTarget(renderCommand: () => void): void;
  useOffscreenRenderTarget(renderCommand: () => void): void;
  renderToPostProcessor(renderCommand: () => void): void;
  resize(viewportWidth: number, viewportHeight: number): void;
  add(pass: IPostProcessingPass, layer: ILayer): void;
  render(layer: ILayer): Promise<unknown>;
}

export interface IMultiPassRenderer {
  getPostProcessor(): IPostProcessor;
  resize(viewportWidth: number, viewportHeight: number): void;
  add(pass: IPass): void;
  render(): void;
  getRenderFlag(): boolean;
  setRenderFlag(enabled: boolean): void;
}
