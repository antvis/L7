import type {
  Device,
  Sampler,
  Texture} from '@antv/g-device-api';
import {
  TextureUsage as DeviceTextureUsage,
  FilterMode,
  Format,
  MipmapFilterMode
} from '@antv/g-device-api';
import type {
  ITexture2D,
  ITexture2DInitializationOptions} from '@antv/l7-core';
import {
  TextureUsage,
  gl,
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
      aniso = 0,
      alignment = 1,
      usage = TextureUsage.SAMPLED,
      mipmap = false,
      // premultiplyAlpha = false,
      mag = gl.NEAREST,
      min = gl.NEAREST,
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
    } else if (type === gl.UNSIGNED_BYTE && format === gl.LUMINANCE) {
      pixelFormat = Format.U8_LUMINANCE;
    } else if (type === gl.FLOAT && format === gl.RGB) {
      pixelFormat = Format.F32_RGB;
    } else {
      throw new Error(`create texture error, type: ${type}, format: ${format}`);
    }

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
      mipLevelCount: usage === TextureUsage.RENDER_TARGET ? 1 : mipmap ? 1 : 0,
    });
    if (data) {
      // @ts-ignore
      this.texture.setImageData([data]);
    }

    this.sampler = device.createSampler({
      addressModeU: wrapModeMap[wrapS],
      addressModeV: wrapModeMap[wrapT],
      minFilter: min === gl.NEAREST ? FilterMode.POINT : FilterMode.BILINEAR,
      magFilter: mag === gl.NEAREST ? FilterMode.POINT : FilterMode.BILINEAR,
      mipmapFilter: MipmapFilterMode.NO_MIP,
      // lodMinClamp: 0,
      // lodMaxClamp: 0,
      maxAnisotropy: aniso,
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
