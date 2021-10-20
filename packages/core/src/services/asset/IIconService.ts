import EventEmitter from 'eventemitter3';
import { ITexture2D } from '../renderer/ITexture2D';
import { ISceneService } from '../scene/ISceneService';
export type IImage = HTMLImageElement | File | string;
export type Listener = (...args: any[]) => void;
export interface IIconValue {
  x: number;
  y: number;
  height?: number;
  width?: number;
  image?: HTMLImageElement;
}
export interface IIcon {
  id: string;
  image?: HTMLImageElement;
  size: number;
  height?: number;
  width?: number;
}
export interface IICONMap {
  [key: string]: IIconValue;
}
export interface IIconService {
  canvasHeight: number;
  on(event: string, fn: EventEmitter.ListenerFn, context?: any): this;
  off(event: string, fn: EventEmitter.ListenerFn, context?: any): this;
  init(): void;
  addImage(id: string, image: IImage): void;
  addImageMini(id: string, image: IImage, sceneService?: ISceneService): void;
  hasImage(id: string): boolean;
  removeImage(id: string): void;
  getTexture(): ITexture2D;
  getIconMap(): IICONMap;
  getCanvas(): HTMLCanvasElement;
  destroy(): void;
}
