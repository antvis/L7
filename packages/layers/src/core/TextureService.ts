import {
  ILayer,
  IRendererService,
  ITexture2D,
  ITextureService,
  TYPES,
} from '@antv/l7-core';

import { generateColorRamp, IColorRamp } from '@antv/l7-utils';

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
  public getColorTexture(colorRamp: IColorRamp) {
    // TODO 支持传入图片
    const currentkey = this.getTextureKey(colorRamp);
    if (this.key === currentkey) {
      return this.colorTexture;
    } else {
      this.createColorTexture(colorRamp);
    }
    this.key = currentkey;
    return this.colorTexture;
  }

  public createColorTexture(colorRamp: IColorRamp) {
    const { createTexture2D } = this.rendererService;
    const imageData = generateColorRamp(colorRamp) as ImageData;
    const texture = createTexture2D({
      data: imageData.data,
      width: imageData.width,
      height: imageData.height,
      flipY: false,
    });
    this.colorTexture = texture;
    return texture;
  }

  public setColorTexture(texture: ITexture2D, colorRamp: IColorRamp) {
    this.key = this.getTextureKey(colorRamp);
    this.colorTexture = texture;
  }

  public destroy() {
    this.colorTexture?.destroy();
  }

  private getTextureKey(colorRamp: IColorRamp): string {
    return `${colorRamp.colors.join('_')}_${colorRamp.positions.join('_')}`;
  }
}
