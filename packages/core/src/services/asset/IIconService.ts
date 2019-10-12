import { ITexture2D } from '../renderer/ITexture2D';
export type IImage = HTMLImageElement | File | string;
export interface IIconValue {
  x: number;
  y: number;
  image: HTMLImageElement;
}
export interface IIcon {
  id: string;
  image: HTMLImageElement;
  height: number;
  width: number;
}
export interface IICONMap {
  [key: string]: IIconValue;
}
export interface IIconService {
  addImage(id: string, image: IImage): void;
  getTexture(): ITexture2D;
  getIconMap(): IICONMap;
}
