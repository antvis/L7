import {
  gl,
  IFramebuffer,
  IFramebufferInitializationOptions,
  IRenderbuffer,
  ITexture2D,
} from '@antv/l7-core';
import regl from 'l7regl';
import ReglTexture2D from './ReglTexture2D';

/**
 * adaptor for regl.Framebuffer
 * @see https://github.com/regl-project/regl/blob/gh-pages/API.md#framebuffers
 */
export default class ReglFramebuffer implements IFramebuffer {
  private framebuffer: regl.Framebuffer;

  constructor(reGl: regl.Regl, options: IFramebufferInitializationOptions) {
    const { width, height, color, colors, depth, stencil } = options;

    const framebufferOptions: regl.FramebufferOptions = {
      width,
      height,
    };

    if (Array.isArray(colors)) {
      framebufferOptions.colors = colors.map((c: ITexture2D | IRenderbuffer) =>
        (c as ReglTexture2D).get(),
      );
    }

    if (color && typeof color !== 'boolean') {
      framebufferOptions.color = (color as ReglTexture2D).get();
    }

    // TODO: depth & stencil

    this.framebuffer = reGl.framebuffer(framebufferOptions);
  }

  public get() {
    return this.framebuffer;
  }

  public destroy() {
    this.framebuffer.destroy();
  }

  public resize({ width, height }: { width: number; height: number }) {
    this.framebuffer.resize(width, height);
  }
}
