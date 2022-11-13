import { IColorRamp } from '@antv/l7-utils';
import { ITexture2D } from '../renderer/ITexture2D';
export interface ITextureService {
    setColorTexture(texture: ITexture2D,colorRamp: IColorRamp):void;
    getColorTexture(colorRamp: IColorRamp): ITexture2D
    destroy():void;

}