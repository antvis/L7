import { gl } from './gl';

export interface ITexture2DInitializationOptions {
  /**
   * 纹理尺寸
   */
  width: number;
  height: number;

  /**
   * 纹理格式
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
   */
  format?:
    | gl.ALPHA
    | gl.LUMINANCE
    | gl.LUMINANCE_ALPHA
    | gl.RGB
    | gl.RGBA
    | gl.RGBA4
    | gl.RGB5_A1
    | gl.RGB565
    | gl.DEPTH_COMPONENT
    | gl.DEPTH_STENCIL;

  /**
   * 纹理数据类型，可能需要引入扩展，例如 ext.HALF_FLOAT_OES
   */
  type?: gl.UNSIGNED_BYTE | gl.UNSIGNED_SHORT | gl.UNSIGNED_INT | gl.FLOAT;

  /**
   * 纹理 pixel source
   */
  data?:
    | undefined
    | HTMLCanvasElement
    | HTMLImageElement
    | ImageBitmap
    | number[]
    | number[][]
    | Uint8Array
    | Uint16Array
    | Uint32Array
    | Uint8ClampedArray;

  /**
   * 纹理参数
   * @see https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/texParameter
   */
  /* Sets magnification filter. Default: 'nearest' */
  mag?: gl.NEAREST | gl.LINEAR;
  /* Sets minification filter. Default: 'nearest' */
  min?:
    | gl.NEAREST
    | gl.LINEAR
    | gl.LINEAR_MIPMAP_LINEAR
    | gl.NEAREST_MIPMAP_LINEAR
    | gl.LINEAR_MIPMAP_NEAREST
    | gl.NEAREST_MIPMAP_NEAREST;
  /* Sets wrap mode on S axis. Default: 'clamp' */
  wrapS?: gl.REPEAT | gl.CLAMP_TO_EDGE | gl.MIRRORED_REPEAT;
  /* Sets wrap mode on T axis. Default: 'clamp' */
  wrapT?: gl.REPEAT | gl.CLAMP_TO_EDGE | gl.MIRRORED_REPEAT;
  aniso?: number;

  /**
   * 以下为 gl.pixelStorei 参数
   * @see https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/pixelStorei
   */
  /* Flips textures vertically when uploading. Default: false */
  flipY?: boolean;
  /* Sets unpack alignment per row. 1, 2, 4, 8 Default: 1 */
  alignment?: 1 | 2 | 4 | 8;
  /* Premultiply alpha when unpacking. Default: false */
  premultiplyAlpha?: boolean;
  /* color space flag for pixel unpacking. gl.BROWSER_DEFAULT_WEBGL | gl.NONE */
  colorSpace?: gl.NONE | gl.BROWSER_DEFAULT_WEBGL;

  mipmap?: boolean | gl.DONT_CARE | gl.NICEST | gl.FASTEST;

  /* 是否复制当前的 framebuffer */
  x?: number;
  y?: number;
  copy?: boolean;
  // From the pixels in the current frame buffer
  // var copyPixels = regl.texture({
  //   x: 5,
  //   y: 1,
  //   width: 10,
  //   height: 10,
  //   copy: true
  // })
}

export interface ITexture2D {
  get(): unknown;
  update(options: any): void;
  bind(): void;
  resize(options: { width: number; height: number }): void;

  /**
   * 写入 subimage
   * gl.texSubImage2D gl.copyTexSubImage2D
   */
  // subImageData(options: {
  //   pixels,
  //   x,
  //   y,
  //   width,
  //   height,
  //   level,
  //   type,
  //   format
  // });

  /**
   * gl.deleteTexture
   */
  destroy(): void;
}
