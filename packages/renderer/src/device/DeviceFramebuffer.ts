import {
  IFramebuffer,
  IFramebufferInitializationOptions,
  IRenderbuffer,
  ITexture2D,
} from '@antv/l7-core';
import DeviceTexture2D, { isTexture2D } from './DeviceTexture2D';
import {
  Device,
  Format,
  RenderTarget,
  Texture,
} from '@strawberry-vis/g-device-api';

export default class DeviceFramebuffer implements IFramebuffer {
  private renderTarget: RenderTarget;

  constructor(device: Device, options: IFramebufferInitializationOptions) {
    // TODO: depth
    const { width, height, depth, color, colors } = options;

    if (isTexture2D(color)) {
      this.renderTarget = device.createRenderTargetFromTexture(
        color.get() as Texture,
      );
    } else if (width && height) {
      this.renderTarget = device.createRenderTarget({
        format: Format.U8_RGBA_RT,
        width,
        height,
      });
    }
  }

  public get() {
    return this.renderTarget;
  }

  public destroy() {
    this.renderTarget.destroy();
  }

  public resize({ width, height }: { width: number; height: number }) {
    // this.framebuffer.resize(width, height);
  }
}
