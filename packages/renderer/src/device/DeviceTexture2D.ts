import type { Device, Sampler, Texture } from '@antv/g-device-api';
import {
  TextureUsage as DeviceTextureUsage,
  FilterMode,
  Format,
  MipmapFilterMode,
} from '@antv/g-device-api';
import type { ITexture2D, ITexture2DInitializationOptions } from '@antv/l7-core';
import { TextureUsage, gl } from '@antv/l7-core';
import { wrapModeMap } from './constants';
import { extend3ChannelsTo4 } from './utils/typedarray';

export function isTexture2D(t: any): t is ITexture2D {
  return !!(t && t['texture']);
}

export default class DeviceTexture2D implements ITexture2D {
  private texture: Texture;
  private sampler: Sampler;
  private width: number;
  private height: number;
  private isDestroy: boolean = false;

  constructor(
    private device: Device,
    private options: ITexture2DInitializationOptions,
  ) {
    const {
      wrapS = gl.CLAMP_TO_EDGE,
      wrapT = gl.CLAMP_TO_EDGE,
      aniso,
      mag = gl.NEAREST,
      min = gl.NEAREST,
    } = options;

    this.createTexture(options);

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

  private createTexture(options: ITexture2DInitializationOptions) {
    const {
      type = gl.UNSIGNED_BYTE,
      width,
      height,
      flipY = false,
      format = gl.RGBA,
      alignment = 1,
      usage = TextureUsage.SAMPLED,
      // premultiplyAlpha = false,
      unorm = false,
      // colorSpace = gl.BROWSER_DEFAULT_WEBGL,
      // x = 0,
      // y = 0,
      // copy = false,
      label,
    } = options;
    let { data } = options;

    this.width = width;
    this.height = height;

    let pixelFormat: Format = Format.U8_RGBA_RT;
    if (type === gl.UNSIGNED_BYTE && format === gl.RGBA) {
      pixelFormat = unorm ? Format.U8_RGBA_NORM : Format.U8_RGBA_RT;
    } else if (type === gl.UNSIGNED_BYTE && format === gl.LUMINANCE) {
      pixelFormat = Format.U8_LUMINANCE;
    } else if (type === gl.FLOAT && format === gl.LUMINANCE) {
      pixelFormat = Format.F32_LUMINANCE;
    } else if (type === gl.FLOAT && format === gl.RGB) {
      // @see https://github.com/antvis/L7/pull/2262
      if (this.device.queryVendorInfo().platformString === 'WebGPU') {
        if (data) {
          // @ts-ignore
          data = extend3ChannelsTo4(data as unknown as Float32Array, 0);
        }
        pixelFormat = Format.F32_RGBA;
      } else {
        pixelFormat = Format.F32_RGB;
      }
    } else if (type === gl.FLOAT && format === gl.RGBA) {
      pixelFormat = Format.F32_RGBA;
    } else if (type === gl.FLOAT && format === gl.RED) {
      pixelFormat = Format.F32_R;
    } else {
      throw new Error(`create texture error, type: ${type}, format: ${format}`);
    }

    this.texture = this.device.createTexture({
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
      // mipLevelCount: usage === TextureUsage.RENDER_TARGET ? 1 : mipmap ? 1 : 0,
      mipLevelCount: 1,
    });
    if (label) {
      this.device.setResourceName(this.texture, label);
    }

    if (data) {
      // @ts-ignore
      this.texture.setImageData([data]);
    }
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
    if (this.width !== width || this.height !== height) {
      this.destroy();
    }

    this.options.width = width;
    this.options.height = height;

    this.createTexture(this.options);

    this.isDestroy = false;
  }

  getSize(): [number, number] {
    return [this.width, this.height];
  }

  destroy() {
    // @ts-ignore
    if (!this.isDestroy && !this.texture.destroyed) {
      this.texture?.destroy();
    }
    this.isDestroy = true;
  }
}
