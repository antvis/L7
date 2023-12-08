import {
  Device,
  Format,
  RenderTarget,
  Texture,
  TextureUsage,
} from '@antv/g-device-api';
import { IFramebuffer, IFramebufferInitializationOptions } from '@antv/l7-core';
import DeviceTexture2D, { isTexture2D } from './DeviceTexture2D';

/**
 * Contains 2 render targets: color and depth.
 */
export default class DeviceFramebuffer implements IFramebuffer {
  private colorRenderTarget: RenderTarget;
  public colorTexture: Texture;
  private depthRenderTarget: RenderTarget;
  private depthTexture: Texture;
  private width: number;
  private height: number;

  constructor(
    private device: Device,
    private options: IFramebufferInitializationOptions,
  ) {
    this.createColorRenderTarget();
    this.createDepthRenderTarget();
  }

  private createColorRenderTarget() {
    const { width, height, color } = this.options;
    if (color) {
      if (isTexture2D(color)) {
        this.colorTexture = color.get() as Texture;
        this.colorRenderTarget = this.device.createRenderTargetFromTexture(
          this.colorTexture,
        );
        this.width = (color as DeviceTexture2D)['width'];
        this.height = (color as DeviceTexture2D)['height'];
      } else if (width && height) {
        this.colorTexture = this.device.createTexture({
          format: Format.U8_RGBA_RT,
          usage: TextureUsage.RENDER_TARGET,
          width,
          height,
        });
        this.colorRenderTarget = this.device.createRenderTargetFromTexture(
          this.colorTexture,
        );
        this.width = width;
        this.height = height;
      }
    }
  }

  private createDepthRenderTarget() {
    const { width, height, depth } = this.options;
    // TODO: avoid creating depth texture if not needed
    if (depth) {
      if (isTexture2D(depth)) {
        this.depthTexture = depth.get() as Texture;
        this.depthRenderTarget = this.device.createRenderTargetFromTexture(
          this.depthTexture,
        );
        this.width = (depth as DeviceTexture2D)['width'];
        this.height = (depth as DeviceTexture2D)['height'];
      } else if (width && height) {
        this.depthTexture = this.device.createTexture({
          format: Format.D24_S8,
          usage: TextureUsage.RENDER_TARGET,
          width,
          height,
        });
        this.depthRenderTarget = this.device.createRenderTargetFromTexture(
          this.depthTexture,
        );
        this.width = width;
        this.height = height;
      }
    }
  }

  public get() {
    return this.colorRenderTarget;
  }

  public destroy() {
    this.colorRenderTarget?.destroy();
    this.depthRenderTarget?.destroy();
  }

  public resize({ width, height }: { width: number; height: number }) {
    if (this.width !== width || this.height !== height) {
      this.destroy();

      this.options.width = width;
      this.options.height = height;
      this.createColorRenderTarget();
      this.createDepthRenderTarget();
    }
  }
}
