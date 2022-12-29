import {
  ILayer,
  IRendererService,
  ITexture2D,
  ITextureService,
  TYPES,
} from '@antv/l7-core';

import {
  generateCatRamp,
  generateColorRamp,
  generateCustomRamp,
  generateLinearRamp,
  generateQuantizeRamp,
  IColorRamp,
} from '@antv/l7-utils';

export default class TextureService implements ITextureService {
  private layer: ILayer;
  private rendererService: IRendererService;
  private colorTexture: ITexture2D;
  private key: string;
  constructor(layer: ILayer) {
    this.layer = layer;
    const container = this.layer.getContainer();
    this.rendererService = container.get<IRendererService>(
      TYPES.IRendererService,
    );
  }
  public getColorTexture(colorRamp: IColorRamp, domain?: [number, number]) {
    // TODO 支持传入图片
    const currentkey = this.getTextureKey(colorRamp, domain);
    if (this.key === currentkey) {
      return this.colorTexture;
    } else {
      this.createColorTexture(colorRamp, domain);
    }
    this.key = currentkey;
    return this.colorTexture;
  }

  public createColorTexture(colorRamp: IColorRamp, domain?: [number, number]) {
    const { createTexture2D } = this.rendererService;
    const imageData = this.getColorRampBar(colorRamp, domain) as ImageData;
    const texture = createTexture2D({
      data: imageData.data,
      width: imageData.width,
      height: imageData.height,
      flipY: false,
    });
    this.colorTexture = texture;
    return texture;
  }

  public setColorTexture(
    texture: ITexture2D,
    colorRamp: IColorRamp,
    domain: [number, number],
  ) {
    this.key = this.getTextureKey(colorRamp, domain);
    this.colorTexture = texture;
  }

  public destroy() {
    this.colorTexture?.destroy();
  }

  private getColorRampBar(colorRamp: IColorRamp, domain?: [number, number]) {
    switch (colorRamp.type) {
      case 'cat':
        return generateCatRamp(colorRamp);
      case 'quantize':
        return generateQuantizeRamp(colorRamp);
      case 'custom':
        return generateCustomRamp(colorRamp, domain as [number, number]);
      case 'linear':
        return generateLinearRamp(colorRamp, domain as [number, number]);
      default:
        return generateColorRamp(colorRamp) as ImageData;
    }
  }

  private getTextureKey(
    colorRamp: IColorRamp,
    domain?: [number, number],
  ): string {
    return `${colorRamp.colors.join('_')}_${colorRamp?.positions?.join('_')}_${
      colorRamp.type
    }_${domain?.join('_')}`;
  }
}
