import type { IAttribute, IAttributeInitializationOptions } from './IAttribute';
import type { IBuffer, IBufferInitializationOptions } from './IBuffer';
import type { IElements, IElementsInitializationOptions } from './IElements';
import type { IFramebuffer, IFramebufferInitializationOptions } from './IFramebuffer';
import type { IModel, IModelInitializationOptions } from './IModel';
import type { IPass } from './IMultiPassRenderer';
import type { ITexture2D, ITexture2DInitializationOptions } from './ITexture2D';

export interface IRenderConfig {
  /**
   * 是否开启 multi pass
   */
  enableMultiPassRenderer?: boolean;
  passes?: Array<IPass<unknown>>;
  antialias?: boolean;
  preserveDrawingBuffer?: boolean;
  // Tip: 场景是否支持 stencil mask
  stencil?: boolean;
  /**
   * Whether to use WebGPU Device.
   */
  enableWebGPU?: boolean;
  /**
   * Path of WASM shader compiler.
   */
  shaderCompilerPath?: string;
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

export interface IReadPixelsOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  // gl.bindFrameBuffer
  framebuffer?: IFramebuffer;
  data?: Uint8Array;
}

export interface IExtensions {
  OES_texture_float: boolean;
}

export interface IRendererService {
  uniformBuffers: IBuffer[];
  extensionObject: IExtensions;
  init(canvas: HTMLCanvasElement, cfg: IRenderConfig, gl: any): Promise<void>;
  testExtension(name: string): boolean;
  clear(options: IClearOptions): void;
  createModel(options: IModelInitializationOptions): IModel;
  createAttribute(options: IAttributeInitializationOptions): IAttribute;
  createBuffer(options: IBufferInitializationOptions): IBuffer;
  createElements(options: IElementsInitializationOptions): IElements;
  createTexture2D(options: ITexture2DInitializationOptions): ITexture2D;
  createFramebuffer(options: IFramebufferInitializationOptions): IFramebuffer;
  useFramebuffer(framebuffer: IFramebuffer | null, drawCommands: () => void): void;
  useFramebufferAsync(
    framebuffer: IFramebuffer | null,
    drawCommands: () => Promise<void>,
  ): Promise<void>;
  getViewportSize(): { width: number; height: number };
  getContainer(): HTMLElement | null;
  getCanvas(): HTMLCanvasElement | null;
  getGLContext(): WebGLRenderingContext;
  getPointSizeRange(): Float32Array;
  viewport(size: { x: number; y: number; width: number; height: number }): void;
  readPixels(options: IReadPixelsOptions): Uint8Array;
  readPixelsAsync(options: IReadPixelsOptions): Promise<Uint8Array>;
  setState(): void;
  setBaseState(): void;
  setCustomLayerDefaults(): void;
  setDirty(flag: boolean): void;
  getDirty(): boolean;
  destroy(): void;
  beginFrame(): void;
  endFrame(): void;
  queryVerdorInfo(): string;
}
