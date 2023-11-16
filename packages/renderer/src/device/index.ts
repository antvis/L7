import {
  Device,
  Format,
  RenderPass,
  RenderTarget,
  SwapChain,
  TextureUsage,
  TransparentBlack,
  WebGLDeviceContribution,
  WebGPUDeviceContribution,
} from '@antv/g-device-api';
import {
  IAttribute,
  IAttributeInitializationOptions,
  IBuffer,
  IBufferInitializationOptions,
  IElements,
  IElementsInitializationOptions,
  IExtensions,
  IFramebufferInitializationOptions,
  IModel,
  IModelInitializationOptions,
  IRenderConfig,
  IRendererService,
  ITexture2D,
  ITexture2DInitializationOptions,
} from '@antv/l7-core';
import { injectable } from 'inversify';
import 'reflect-metadata';
import DeviceAttribute from './DeviceAttribute';
import DeviceBuffer from './DeviceBuffer';
import DeviceElements from './DeviceElements';
import DeviceFramebuffer from './DeviceFramebuffer';
import DeviceModel from './DeviceModel';
import DeviceTexture2D from './DeviceTexture2D';
import { isWebGL2 } from './utils/webgl';

/**
 * Device API renderer
 */
@injectable()
export default class DeviceRendererService implements IRendererService {
  uniformBuffers: IBuffer[] = [];
  extensionObject: IExtensions;
  private device: Device;
  private swapChain: SwapChain;
  private $container: HTMLDivElement | null;
  private canvas: HTMLCanvasElement;
  private width: number;
  private height: number;
  private isDirty: boolean;
  private renderPass: RenderPass;
  private renderTarget: RenderTarget;
  private mainDepthRT: RenderTarget;

  async init(canvas: HTMLCanvasElement, cfg: IRenderConfig): Promise<void> {
    const { enableWebGPU, shaderCompilerPath } = cfg;

    // this.$container = $container;
    this.canvas = canvas;

    // TODO: use antialias from cfg
    const deviceContribution = enableWebGPU
      ? new WebGPUDeviceContribution({
          shaderCompilerPath,
        })
      : new WebGLDeviceContribution({
          // Use WebGL2 first and downgrade to WebGL1 if WebGL2 is not supported.
          targets: ['webgl2', 'webgl1'],
          onContextLost(e) {
            console.warn('context lost', e);
          },
          onContextCreationError(e) {
            console.warn('context creation error', e);
          },
          onContextRestored(e) {
            console.warn('context restored', e);
          },
        });

    const swapChain = await deviceContribution.createSwapChain(canvas);
    swapChain.configureSwapChain(canvas.width, canvas.height);
    this.device = swapChain.getDevice();
    this.swapChain = swapChain;

    // Create default RT
    // @ts-ignore
    // this.device.onscreenFramebuffer = this.createFramebuffer({
    //   width: canvas.width,
    //   height: canvas.height,
    // });
    // // @ts-ignore
    // this.device.onscreenFramebuffer.onscreen = true;
    // // @ts-ignore
    // this.device.currentFramebuffer = this.device.onscreenFramebuffer;

    // @ts-ignore
    const gl = this.device['gl'];
    this.extensionObject = {
      // @ts-ignore
      OES_texture_float: !isWebGL2(gl) && this.device['OES_texture_float'],
    };

    const renderTargetTexture = this.device.createTexture({
      format: Format.U8_RGBA_RT,
      width: canvas.width,
      height: canvas.height,
      usage: TextureUsage.RENDER_TARGET,
    });
    this.renderTarget =
      this.device.createRenderTargetFromTexture(renderTargetTexture);

    this.mainDepthRT = this.device.createRenderTargetFromTexture(
      this.device.createTexture({
        format: Format.D24_S8,
        width: canvas.width,
        height: canvas.height,
        usage: TextureUsage.RENDER_TARGET,
      }),
    );
  }

  beginFrame(): void {
    const onscreenTexture = this.swapChain.getOnscreenTexture();
    this.renderPass = this.device.createRenderPass({
      colorAttachment: [this.renderTarget],
      // colorResolveTo: [onscreen ? onscreenTexture : onscreenTexture],
      colorResolveTo: [onscreenTexture],
      colorClearColor: [TransparentBlack],
      depthStencilAttachment: this.mainDepthRT,
      depthClearValue: 1,
    });
    // @ts-ignore
    this.device.renderPass = this.renderPass;
  }

  endFrame(): void {
    this.device.submitPass(this.renderPass);
  }

  getPointSizeRange() {
    // @ts-ignore
    const gl = this.device['gl'];
    // FIXME: implement this method in Device API.
    return gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);
  }

  public testExtension(name: string) {
    // OES_texture_float
    return !!this.getGLContext().getExtension(name);
  }

  createModel = (options: IModelInitializationOptions): IModel =>
    new DeviceModel(this.device, options);

  createAttribute = (options: IAttributeInitializationOptions): IAttribute =>
    new DeviceAttribute(this.device, options);

  createBuffer = (options: IBufferInitializationOptions): IBuffer =>
    new DeviceBuffer(this.device, options);

  createElements = (options: IElementsInitializationOptions): IElements =>
    new DeviceElements(this.device, options);

  createTexture2D = (options: ITexture2DInitializationOptions): ITexture2D =>
    new DeviceTexture2D(this.device, options);

  createFramebuffer = (options: IFramebufferInitializationOptions) =>
    new DeviceFramebuffer(this.device, options);

  useFramebuffer = () =>
    // framebuffer: IFramebuffer | null,
    // drawCommands: () => void,
    {
      // if (framebuffer == null) {
      //   // @ts-ignore
      //   this.device.currentFramebuffer = this.device.onscreenFramebuffer;
      // } else {
      //   // @ts-ignore
      //   this.device.currentFramebuffer = framebuffer;
      // }
      // drawCommands();
    };

  clear = () =>
    // options: IClearOptions
    {
      // @see https://github.com/regl-project/regl/blob/gh-pages/API.md#clear-the-draw-buffer
      // const { color, depth, stencil, framebuffer = null } = options;
      // const reglClearOptions: regl.ClearOptions = {
      //   color,
      //   depth,
      //   stencil,
      // };
      // reglClearOptions.framebuffer =
      //   framebuffer === null
      //     ? framebuffer
      //     : (framebuffer as DeviceFramebuffer).get();
      // this.gl?.clear(reglClearOptions);
      // TODO: clear
    };

  viewport = ({
    // x,
    // y,
    width,
    height,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    // use WebGL context directly
    // @see https://github.com/regl-project/regl/blob/gh-pages/API.md#unsafe-escape-hatch
    // this.gl._gl.viewport(x, y, width, height);
    this.width = width;
    this.height = height;
    // Will be used in `setViewport` from RenderPass later.
    // @ts-ignore
    this.device.width = width;
    // @ts-ignore
    this.device.height = height;

    // this.gl._refresh();
  };

  readPixels = () =>
    // options: IReadPixelsOptions
    {
      // const { framebuffer, x, y, width, height } = options;

      // const readback = this.device.createReadback();

      // if (framebuffer) {
      //   readPixelsOptions.framebuffer = (framebuffer as DeviceFramebuffer).get();
      // }
      // return readback.readTextureSync(null, x, y, width, height, new Uint8Array()) as Uint8Array;
      return new Uint8Array();
    };

  getViewportSize = () => {
    // FIXME: add viewport size in Device API.
    return {
      // @ts-ignore
      width: this.device.width,
      // @ts-ignore
      height: this.device.height,
    };
  };

  getContainer = () => {
    return this.canvas?.parentElement;
  };

  getCanvas = () => {
    // return this.$container?.getElementsByTagName('canvas')[0] || null;
    return this.canvas;
  };

  getGLContext = () => {
    // @ts-ignore
    return this.device['gl'] as WebGLRenderingContext;
  };

  // TODO: 临时方法
  setState() {
    // this.gl({
    //   cull: {
    //     enable: false,
    //     face: 'back',
    //   },
    //   viewport: {
    //     x: 0,
    //     y: 0,
    //     height: this.width,
    //     width: this.height,
    //   },
    //   blend: {
    //     enable: true,
    //     equation: 'add',
    //   },
    //   framebuffer: null,
    // });
    // this.gl._refresh();
  }

  setBaseState() {
    // this.gl({
    //   cull: {
    //     enable: false,
    //     face: 'back',
    //   },
    //   viewport: {
    //     x: 0,
    //     y: 0,
    //     height: this.width,
    //     width: this.height,
    //   },
    //   blend: {
    //     enable: false,
    //     equation: 'add',
    //   },
    //   framebuffer: null,
    // });
    // this.gl._refresh();
  }
  setCustomLayerDefaults() {
    // const gl = this.getGLContext();
    // gl.disable(gl.CULL_FACE);
  }

  setDirty(flag: boolean): void {
    this.isDirty = flag;
  }

  getDirty(): boolean {
    return this.isDirty;
  }

  destroy = () => {
    // this.canvas = null 清除对 webgl 实例的引用
    // @ts-ignore
    this.canvas = null;

    this.uniformBuffers?.forEach((buffer) => {
      buffer.destroy();
    });

    this.device.destroy();

    // make sure release webgl context
    // this.gl?._gl?.getExtension('WEBGL_lose_context')?.loseContext();

    // @see https://github.com/regl-project/regl/blob/gh-pages/API.md#clean-up
    // this.gl.destroy();

    // @ts-ignore
    // this.gl = null;
  };
}
