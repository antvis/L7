/**
 * render w/ regl
 * @see https://github.com/regl-project/regl/blob/gh-pages/API.md
 */
import {
  IAttribute,
  IAttributeInitializationOptions,
  IBuffer,
  IBufferInitializationOptions,
  IClearOptions,
  IElements,
  IElementsInitializationOptions,
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
import { injectable } from 'inversify';
import regl from 'regl';
import ReglAttribute from './ReglAttribute';
import ReglBuffer from './ReglBuffer';
import ReglElements from './ReglElements';
import ReglFramebuffer from './ReglFramebuffer';
import ReglModel from './ReglModel';
import ReglTexture2D from './ReglTexture2D';

/**
 * regl renderer
 */
@injectable()
export default class ReglRendererService implements IRendererService {
  private gl: regl.Regl;
  private $container: HTMLDivElement | null;
  private canvas: HTMLCanvasElement;
  private width: number;
  private height: number;
  private isDirty: boolean;

  public async init(
    canvas: HTMLCanvasElement,
    cfg: IRenderConfig,
  ): Promise<void> {
    // this.$container = $container;
    this.canvas = canvas;
    // tslint:disable-next-line:typedef
    this.gl = await new Promise((resolve, reject) => {
      regl({
        canvas: this.canvas,
        attributes: {
          alpha: true,
          // use TAA instead of MSAA
          // @see https://www.khronos.org/registry/webgl/specs/1.0/#5.2.1
          antialias: cfg.antialias,
          premultipliedAlpha: true,
          preserveDrawingBuffer: cfg.preserveDrawingBuffer,
        },
        // TODO: use extensions
        extensions: [
          'OES_element_index_uint',
          'OES_standard_derivatives', // wireframe
          'angle_instanced_arrays', // VSM shadow map
        ],
        optionalExtensions: [
          'oes_texture_float_linear',
          'OES_texture_float',
          'EXT_texture_filter_anisotropic',
          'EXT_blend_minmax',
          'WEBGL_depth_texture',
        ],
        profile: true,
        onDone: (err: Error | null, r?: regl.Regl | undefined): void => {
          if (err || !r) {
            reject(err);
          }
          resolve(r);
        },
      });
    });
  }

  public createModel = (options: IModelInitializationOptions): IModel =>
    new ReglModel(this.gl, options);

  public createAttribute = (
    options: IAttributeInitializationOptions,
  ): IAttribute => new ReglAttribute(this.gl, options);

  public createBuffer = (options: IBufferInitializationOptions): IBuffer =>
    new ReglBuffer(this.gl, options);

  public createElements = (
    options: IElementsInitializationOptions,
  ): IElements => new ReglElements(this.gl, options);

  public createTexture2D = (
    options: ITexture2DInitializationOptions,
  ): ITexture2D => new ReglTexture2D(this.gl, options);

  public createFramebuffer = (options: IFramebufferInitializationOptions) =>
    new ReglFramebuffer(this.gl, options);

  public useFramebuffer = (
    framebuffer: IFramebuffer | null,
    drawCommands: () => void,
  ) => {
    this.gl({
      framebuffer: framebuffer ? (framebuffer as ReglFramebuffer).get() : null,
    })(drawCommands);
  };

  public clear = (options: IClearOptions) => {
    // @see https://github.com/regl-project/regl/blob/gh-pages/API.md#clear-the-draw-buffer
    const { color, depth, stencil, framebuffer = null } = options;
    const reglClearOptions: regl.ClearOptions = {
      color,
      depth,
      stencil,
    };

    reglClearOptions.framebuffer =
      framebuffer === null
        ? framebuffer
        : (framebuffer as ReglFramebuffer).get();

    this.gl.clear(reglClearOptions);
  };

  public viewport = ({
    x,
    y,
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
    this.gl._gl.viewport(x, y, width, height);
    this.width = width;
    this.height = height;
    this.gl._refresh();
  };

  public readPixels = (options: IReadPixelsOptions) => {
    const { framebuffer, x, y, width, height } = options;
    const readPixelsOptions: regl.ReadOptions = {
      x,
      y,
      width,
      height,
    };
    if (framebuffer) {
      readPixelsOptions.framebuffer = (framebuffer as ReglFramebuffer).get();
    }
    return this.gl.read(readPixelsOptions);
  };

  public getViewportSize = () => {
    return {
      width: this.gl._gl.drawingBufferWidth,
      height: this.gl._gl.drawingBufferHeight,
    };
  };

  public getContainer = () => {
    return this.canvas?.parentElement;
  };

  public getCanvas = () => {
    // return this.$container?.getElementsByTagName('canvas')[0] || null;
    return this.canvas;
  };

  public getGLContext = () => {
    return this.gl._gl;
  };

  public setBaseState() {
    this.gl({
      cull: {
        enable: false,
        face: 'back',
      },
      viewport: {
        x: 0,
        y: 0,
        height: this.width,
        width: this.height,
      },
      blend: {
        enable: false,
        equation: 'add',
      },
      framebuffer: null,
    });
    this.gl._refresh();
  }
  public setCustomLayerDefaults() {
    const gl = this.getGLContext();
    gl.disable(gl.CULL_FACE);
  }

  public setDirty(flag: boolean): void {
    this.isDirty = flag;
  }

  public getDirty(): boolean {
    return this.isDirty;
  }

  public destroy = () => {
    // @see https://github.com/regl-project/regl/blob/gh-pages/API.md#clean-up
    this.gl.destroy();
  };
}
