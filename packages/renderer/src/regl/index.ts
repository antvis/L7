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
  IRendererService,
  ITexture2D,
  ITexture2DInitializationOptions,
} from '@l7/core';
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

  public async init($container: HTMLDivElement): Promise<void> {
    this.$container = $container;
    // tslint:disable-next-line:typedef
    this.gl = await new Promise((resolve, reject) => {
      regl({
        container: $container,
        attributes: {
          alpha: true,
          // use TAA instead of MSAA
          // @see https://www.khronos.org/registry/webgl/specs/1.0/#5.2.1
          antialias: false,
          premultipliedAlpha: true,
        },
        // TODO: use extensions
        extensions: [
          'OES_element_index_uint',
          'EXT_shader_texture_lod', // IBL
          'OES_standard_derivatives', // wireframe
          'EXT_SRGB', // baseColor emmisive
          'OES_texture_float', // shadow map
          'WEBGL_depth_texture',
          'EXT_texture_filter_anisotropic', // VSM shadow map
        ],
        optionalExtensions: ['oes_texture_float_linear'],
        // profile: true,
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

  public renderToFramebuffer = (
    framebuffer: IFramebuffer | null,
    drawCommands: () => void,
  ) => {
    const useFramebuffer = this.gl({
      // since post-processor will swap read/write fbos, we must retrieve it dynamically
      framebuffer: framebuffer
        ? () => (framebuffer as ReglFramebuffer).get()
        : null,
    });

    // TODO: pass other options
    useFramebuffer({}, drawCommands);
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
    this.gl._refresh();
  };

  public getViewportSize = () => {
    return {
      width: this.gl._gl.drawingBufferWidth,
      height: this.gl._gl.drawingBufferHeight,
    };
  };

  public getContainer = () => {
    return this.$container;
  };
}
