import { ILayer } from '../layer/ILayerService';
import { IAttribute, IAttributeInitializationOptions } from './IAttribute';
import { IBuffer, IBufferInitializationOptions } from './IBuffer';
import { IElements, IElementsInitializationOptions } from './IElements';
import { IFramebuffer } from './IFramebuffer';
import { IModel, IModelInitializationOptions } from './IModel';
import { IMultiPassRenderer, IPass } from './IMultiPassRenderer';

export interface IRenderConfig {
  /**
   * 是否开启 multi pass
   */
  enableMultiPassRenderer?: boolean;
  passes?: IPass[];
}

export interface IClearOptions {
  // gl.clearColor
  color?: [number, number, number, number];
  // gl.clearDepth 默认值为 1
  depth?: number;
  // gl.clearStencil 默认值为 0
  stencil?: number;
  // gl.bindFrameBuffer
  framebuffer?: IFramebuffer | null;
}

export interface IRendererService {
  init($container: HTMLDivElement): Promise<void>;
  clear(options: IClearOptions): void;
  createModel(options: IModelInitializationOptions): IModel;
  createAttribute(options: IAttributeInitializationOptions): IAttribute;
  createBuffer(options: IBufferInitializationOptions): IBuffer;
  createElements(options: IElementsInitializationOptions): IElements;
  createMultiPassRenderer(layer: ILayer): IMultiPassRenderer;
  getViewportSize(): { width: number; height: number };
  viewport(size: { x: number; y: number; width: number; height: number }): void;
}
