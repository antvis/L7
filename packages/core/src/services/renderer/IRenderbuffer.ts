import type { gl } from './gl';

export interface IRenderbufferInitializationOptions {
  width: number;
  height: number;

  /**
   * gl.RGBA4 | gl.DEPTH_COMPONENT16...
   */
  format:
    | gl.RGBA4
    | gl.RGB565
    | gl.RGB5_A1
    | gl.DEPTH_COMPONENT16
    | gl.STENCIL_INDEX8
    | gl.DEPTH_STENCIL;
}

export interface IRenderbuffer {
  resize(options: { width: number; height: number }): void;

  /**
   * gl.deleteRenderbuffer
   */
  destroy(): void;
}
