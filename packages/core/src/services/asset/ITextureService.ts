import { IColorRamp } from '@antv/l7-utils';
import { ITexture2D } from '../renderer/ITexture2D';
export interface ITextureService {
  setColorTexture(
    texture: ITexture2D,
    colorRamp: IColorRamp,
    domain?: [number, number],
  ): void;
  getColorTexture(colorRamp: IColorRamp, domain?: [number, number]): ITexture2D;
  destroy(): void;
}
