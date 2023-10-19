import { Device, Format, RenderTarget, Texture } from '@antv/g-device-api';
import { IFramebuffer, IFramebufferInitializationOptions } from '@antv/l7-core';
import DeviceTexture2D, { isTexture2D } from './DeviceTexture2D';

export default class DeviceFramebuffer implements IFramebuffer {
  private renderTarget: RenderTarget;
  private width: number;
  private height: number;

  constructor(
    private device: Device,
    options: IFramebufferInitializationOptions,
  ) {
    // TODO: depth
    const { width, height, depth, color, colors } = options;

    if (isTexture2D(color)) {
      this.renderTarget = device.createRenderTargetFromTexture(
        color.get() as Texture,
      );
      this.width = (color as DeviceTexture2D)['width'];
      this.height = (color as DeviceTexture2D)['height'];
    } else if (width && height) {
      this.renderTarget = device.createRenderTarget({
        format: Format.U8_RGBA_RT,
        width,
        height,
      });
      this.width = width;
      this.height = height;
    }
  }

  public get() {
    return this.renderTarget;
  }

  public destroy() {
    this.renderTarget.destroy();
  }

  public resize({ width, height }: { width: number; height: number }) {
    if (this.width !== width || this.height !== height) {
      if (this.renderTarget) {
        this.renderTarget.destroy();
      }
      this.renderTarget = this.device.createRenderTarget({
        format: Format.U8_RGBA_RT,
        width,
        height,
      });
      this.width = width;
      this.height = height;
    }
  }
}
