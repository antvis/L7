import type { IRenderbuffer, IRenderbufferInitializationOptions } from '@antv/l7-core';
import type regl from 'regl';
import { formatMap } from './constants';

/**
 * adaptor for regl.Renderbuffer
 * @see https://github.com/regl-project/regl/blob/gh-pages/API.md#renderbuffers
 */
export default class ReglRenderbuffer implements IRenderbuffer {
  private renderbuffer: regl.Renderbuffer;

  constructor(reGl: regl.Regl, options: IRenderbufferInitializationOptions) {
    const { width, height, format } = options;
    this.renderbuffer = reGl.renderbuffer({
      width,
      height,
      format: formatMap[format] as regl.RenderbufferFormat,
    });
  }

  public get() {
    return this.renderbuffer;
  }

  public destroy() {
    this.renderbuffer.destroy();
  }

  public resize({ width, height }: { width: number; height: number }) {
    this.renderbuffer.resize(width, height);
  }
}
