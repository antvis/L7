import type { Device, RenderPass, RenderTarget, SwapChain } from '@antv/g-device-api';
import {
  Format,
  TextureUsage,
  TransparentBlack,
  ViewportOrigin,
  WebGLDeviceContribution,
  WebGPUDeviceContribution,
  colorNewFromRGBA,
} from '@antv/g-device-api';
import type {
  IAttribute,
  IAttributeInitializationOptions,
  IBuffer,
  IBufferInitializationOptions,
  IClearOptions,
  IElements,
  IElementsInitializationOptions,
  IExtensions,
  IFramebuffer,
  IFramebufferInitializationOptions,
  IModel,
  IModelInitializationOptions,
  IReadPixelsOptions,
  IRenderConfig,
  IRendererService,
  ITexture2D,
  ITexture2DInitializationOptions,
} from '@antv/l7-core';
import { lodashUtil } from '@antv/l7-utils';
import DeviceAttribute from './DeviceAttribute';
import DeviceBuffer from './DeviceBuffer';
import { RenderCache } from './DeviceCache';
import DeviceElements from './DeviceElements';
import DeviceFramebuffer from './DeviceFramebuffer';
import DeviceModel from './DeviceModel';
import DeviceTexture2D from './DeviceTexture2D';
import { isWebGL2 } from './utils/webgl';
const { isUndefined } = lodashUtil;

/**
 * Device API renderer
 */
export default class DeviceRendererService implements IRendererService {
  uniformBuffers: IBuffer[] = [];
  extensionObject: IExtensions;
  private device: Device;
  swapChain: SwapChain;
  private $container: HTMLDivElement | null;
  private canvas: HTMLCanvasElement;
  width: number;
  height: number;
  private isDirty: boolean;
  /**
   * Current render pass.
   */
  renderPass: RenderPass;
  preRenderPass: RenderPass;
  mainColorRT: RenderTarget;
  mainDepthRT: RenderTarget;

  renderCache: RenderCache;

  /**
   * Current FBO.
   */
  currentFramebuffer: DeviceFramebuffer | null;

  queryVerdorInfo = () => {
    return this.device.queryVendorInfo().platformString;
  };

  private viewportOrigin: ViewportOrigin;

  async init(canvas: HTMLCanvasElement, cfg: IRenderConfig): Promise<void> {
    const { enableWebGPU, shaderCompilerPath, antialias } = cfg;

    // this.$container = $container;
    this.canvas = canvas;

    const deviceContribution = enableWebGPU
      ? new WebGPUDeviceContribution({
          shaderCompilerPath,
        })
      : new WebGLDeviceContribution({
          // Use WebGL2 first and downgrade to WebGL1 if WebGL2 is not supported.
          targets: ['webgl2', 'webgl1'],
          antialias,
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

    this.renderCache = new RenderCache(this.device);

    // Create default RT
    this.currentFramebuffer = null;

    this.viewportOrigin = this.device.queryVendorInfo().viewportOrigin;

    // @ts-ignore
    const gl = this.device['gl'];
    this.extensionObject = {
      // @ts-ignore
      OES_texture_float: !isWebGL2(gl) && this.device['OES_texture_float'],
    };

    this.createMainColorDepthRT(canvas.width, canvas.height);
  }

  private createMainColorDepthRT(width: number, height: number) {
    if (this.mainColorRT) {
      this.mainColorRT.destroy();
    }
    if (this.mainDepthRT) {
      this.mainDepthRT.destroy();
    }

    this.mainColorRT = this.device.createRenderTargetFromTexture(
      this.device.createTexture({
        format: Format.U8_RGBA_RT,
        width,
        height,
        usage: TextureUsage.RENDER_TARGET,
      }),
    );

    this.mainDepthRT = this.device.createRenderTargetFromTexture(
      this.device.createTexture({
        format: Format.D24_S8,
        width,
        height,
        usage: TextureUsage.RENDER_TARGET,
      }),
    );
  }

  beginFrame(): void {
    this.device.beginFrame();

    const { currentFramebuffer, swapChain, mainColorRT, mainDepthRT } = this;

    const colorAttachment = currentFramebuffer
      ? currentFramebuffer['colorRenderTarget']
      : mainColorRT;
    const colorResolveTo = currentFramebuffer ? null : swapChain.getOnscreenTexture();
    const depthStencilAttachment = currentFramebuffer
      ? currentFramebuffer['depthRenderTarget']
      : mainDepthRT;

    const { color = [0, 0, 0, 0], depth = 1, stencil = 0 } =
      // @ts-ignore
      currentFramebuffer?.clearOptions || {};

    const colorClearColor = colorAttachment
      ? colorNewFromRGBA(color[0] * 255, color[1] * 255, color[2] * 255, color[3])
      : TransparentBlack;
    const depthClearValue = depthStencilAttachment ? depth : undefined;
    const stencilClearValue = depthStencilAttachment ? stencil : undefined;

    const renderPass = this.device.createRenderPass({
      colorAttachment: [colorAttachment],
      colorResolveTo: [colorResolveTo],
      colorClearColor: [colorClearColor],
      // colorStore: [!!currentFramebuffer],
      colorStore: [true],
      depthStencilAttachment,
      depthClearValue,
      stencilClearValue,
    });
    this.renderPass = renderPass;
  }

  endFrame(): void {
    this.device.submitPass(this.renderPass);
    this.device.endFrame();
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
    new DeviceModel(this.device, options, this);

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

  useFramebuffer = (framebuffer: IFramebuffer | null, drawCommands: () => void) => {
    this.currentFramebuffer = framebuffer as DeviceFramebuffer;
    this.beginFrame();
    drawCommands();
    this.endFrame();
    this.currentFramebuffer = null;
  };

  useFramebufferAsync = async (
    framebuffer: IFramebuffer | null,
    drawCommands: () => Promise<void>,
  ) => {
    this.currentFramebuffer = framebuffer as DeviceFramebuffer;
    this.preRenderPass = this.renderPass;
    this.beginFrame();
    await drawCommands();
    this.endFrame();
    this.currentFramebuffer = null;
    this.renderPass = this.preRenderPass;
  };

  clear = (options: IClearOptions) => {
    // @see https://github.com/regl-project/regl/blob/gh-pages/API.md#clear-the-draw-buffer
    const { color, depth, stencil, framebuffer = null } = options;
    if (framebuffer) {
      // @ts-ignore
      framebuffer.clearOptions = { color, depth, stencil };
    } else {
      const platformString = this.queryVerdorInfo();
      if (platformString === 'WebGL1') {
        const gl = this.getGLContext();
        if (!isUndefined(stencil)) {
          gl.clearStencil(stencil);
          gl.clear(gl.STENCIL_BUFFER_BIT);
        } else if (!isUndefined(depth)) {
          gl.clearDepth(depth);
          gl.clear(gl.DEPTH_BUFFER_BIT);
        }
      } else if (platformString === 'WebGL2') {
        const gl = this.getGLContext() as WebGL2RenderingContext;
        if (!isUndefined(stencil)) {
          gl.clearBufferiv(gl.STENCIL, 0, [stencil]);
        } else if (!isUndefined(depth)) {
          gl.clearBufferfv(gl.DEPTH, 0, [depth]);
        }
      }
    }
    // Recreate render pass
    // this.beginFrame();
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
    // @see https://observablehq.com/@antv/g-device-api#cell-267
    this.swapChain.configureSwapChain(width, height);
    this.createMainColorDepthRT(width, height);
    this.width = width;
    this.height = height;
  };

  readPixels = (options: IReadPixelsOptions) => {
    const { framebuffer, x, y, width, height } = options;
    const readback = this.device.createReadback();
    const texture = (framebuffer as DeviceFramebuffer)['colorTexture'];
    const result = readback.readTextureSync(
      texture,
      x,
      /**
       * Origin is at lower-left corner. Width / height is already multiplied by dpr.
       * WebGPU needs flipY
       */
      this.viewportOrigin === ViewportOrigin.LOWER_LEFT ? y : this.height - y,
      width,
      height,
      new Uint8Array(width * height * 4),
    ) as Uint8Array;

    // Since we use U8_RGBA_RT format in render target, need to change bgranorm -> rgba here.
    if (this.viewportOrigin !== ViewportOrigin.LOWER_LEFT) {
      for (let j = 0; j < result.length; j += 4) {
        // Switch b and r components.
        const t = result[j];
        result[j] = result[j + 2];
        result[j + 2] = t;
      }
    }

    readback.destroy();

    return result;
  };

  readPixelsAsync = async (options: IReadPixelsOptions) => {
    const { framebuffer, x, y, width, height } = options;

    const readback = this.device.createReadback();
    const texture = (framebuffer as DeviceFramebuffer)['colorTexture'];
    const result = (await readback.readTexture(
      texture,
      x,
      /**
       * Origin is at lower-left corner. Width / height is already multiplied by dpr.
       * WebGPU needs flipY
       */
      this.viewportOrigin === ViewportOrigin.LOWER_LEFT ? y : this.height - y,
      width,
      height,
      new Uint8Array(width * height * 4),
    )) as Uint8Array;

    // Since we use U8_RGBA_RT format in render target, need to change bgranorm -> rgba here.
    if (this.viewportOrigin !== ViewportOrigin.LOWER_LEFT) {
      for (let j = 0; j < result.length; j += 4) {
        // Switch b and r components.
        const t = result[j];
        result[j] = result[j + 2];
        result[j + 2] = t;
      }
    }

    readback.destroy();

    return result;
  };

  getViewportSize = () => {
    // FIXME: add viewport size in Device API.
    return {
      width: this.width,
      height: this.height,
    };
  };

  getContainer = () => {
    return this.canvas?.parentElement;
  };

  getCanvas = () => {
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

    this.renderCache.destroy();

    // make sure release webgl context
    // this.gl?._gl?.getExtension('WEBGL_lose_context')?.loseContext();

    // @see https://github.com/regl-project/regl/blob/gh-pages/API.md#clean-up
    // this.gl.destroy();

    // @ts-ignore
    // this.gl = null;
  };
}
