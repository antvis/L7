import {
  Device,
  FilterMode,
  Format,
  MipmapFilterMode,
  Sampler,
  Texture,
  TextureUsage as DeviceTextureUsage,
} from '@antv/g-device-api';
import {
  gl,
  ITexture2D,
  ITexture2DInitializationOptions,
  TextureUsage,
} from '@antv/l7-core';
import { wrapModeMap } from './constants';

export function isTexture2D(t: any): t is ITexture2D {
  return !!(t && t['texture']);
}

export default class DeviceTexture2D implements ITexture2D {
  private texture: Texture;
  private sampler: Sampler;
  private width: number;
  private height: number;
  private isDestroy: boolean = false;

  constructor(device: Device, options: ITexture2DInitializationOptions) {
    const {
      data,
      type = gl.UNSIGNED_BYTE,
      width,
      height,
      flipY = false,
      format = gl.RGBA,
      wrapS = gl.CLAMP_TO_EDGE,
      wrapT = gl.CLAMP_TO_EDGE,
      // aniso = 0,
      alignment = 1,
      usage = TextureUsage.SAMPLED,
      // mipmap = false,
      // premultiplyAlpha = false,
      // mag = gl.NEAREST,
      // min = gl.NEAREST,
      // colorSpace = gl.BROWSER_DEFAULT_WEBGL,
      // x = 0,
      // y = 0,
      // copy = false,
    } = options;
    this.width = width;
    this.height = height;

    let pixelFormat: Format = Format.U8_RGBA_RT;
    if (type === gl.UNSIGNED_BYTE && format === gl.RGBA) {
      pixelFormat = Format.U8_RGBA_RT;
    } else if (format === gl.LUMINANCE && type === gl.FLOAT) {
      pixelFormat = Format.F32_LUMINANCE;
    } else if (format === gl.LUMINANCE && type === gl.UNSIGNED_BYTE) {
      pixelFormat = Format.U8_LUMINANCE;
    } else {
      throw new Error(`create texture error, type: ${type}, format: ${format}`);
    }

    //   // copy pixels from current bind framebuffer
    //   x,
    //   y,
    //   copy,
    // };

    this.texture = device.createTexture({
      format: pixelFormat!,
      width,
      height,
      usage:
        usage === TextureUsage.SAMPLED
          ? DeviceTextureUsage.SAMPLED
          : DeviceTextureUsage.RENDER_TARGET,
      pixelStore: {
        unpackFlipY: flipY,
        packAlignment: alignment,
      },
    });
    if (data) {
      // @ts-ignore
      this.texture.setImageData([data]);
    }

    // wrapS: gl.CLAMP_TO_EDGE,
    // wrapT: gl.CLAMP_TO_EDGE,
    // min: gl.LINEAR,
    // mag: gl.LINEAR,

    this.sampler = device.createSampler({
      addressModeU: wrapModeMap[wrapS],
      addressModeV: wrapModeMap[wrapT],
      minFilter: FilterMode.BILINEAR, // TODO: use mag & min
      magFilter: FilterMode.BILINEAR,
      mipmapFilter: MipmapFilterMode.NO_MIP,
      lodMinClamp: 0,
      lodMaxClamp: 0,
      // maxAnisotropy: aniso,
    });
  }

  get() {
    return this.texture;
  }

  update(props: any) {
    const { data } = props;
    this.texture.setImageData([data]);
  }

  bind() {
    // this.texture._texture.bind();
  }

  resize({ width, height }: { width: number; height: number }): void {
    // this.texture.resize(width, height);
    this.width = width;
    this.height = height;
  }

  getSize(): [number, number] {
    return [this.width, this.height];
  }

  destroy() {
    if (!this.isDestroy) {
      this.texture?.destroy();
    }
    this.isDestroy = true;
  }
}
