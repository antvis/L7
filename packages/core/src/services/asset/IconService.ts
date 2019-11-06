import { EventEmitter } from 'eventemitter3';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { buildIconMaping } from '../../utils/font_util';
import { ITexture2D } from '../renderer/ITexture2D';
import {
  IIcon,
  IICONMap,
  IIconService,
  IIconValue,
  IImage,
} from './IIconService';
const BUFFER = 3;
const MAX_CANVAS_WIDTH = 1024;
const imageSize = 64;
@injectable()
export default class IconService extends EventEmitter implements IIconService {
  public canvasHeight: number;
  private textrure: ITexture2D;
  private canvas: HTMLCanvasElement;
  private iconData: IIcon[];
  private iconMap: IICONMap;
  private ctx: CanvasRenderingContext2D;
  public init() {
    this.iconData = [];
    this.iconMap = {};
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  public addImage(id: string, image: IImage) {
    let imagedata = new Image();
    if (this.hasImage(id)) {
      throw new Error('Image Id already exists');
    }
    this.iconData.push({
      id,
      width: imageSize,
      height: imageSize,
    });
    this.updateIconMap();
    this.loadImage(image).then((img) => {
      imagedata = img as HTMLImageElement;
      const iconImage = this.iconData.find((icon: IIcon) => {
        return icon.id === id;
      });
      if (iconImage) {
        iconImage.image = imagedata;
      }
      // this.iconData.push({
      //   id,
      //   image: imagedata,
      //   width: imageSize,
      //   height: imageSize,
      // });
      this.update();
    });
  }

  public getTexture(): ITexture2D {
    return this.textrure;
  }

  public getIconMap() {
    return this.iconMap;
  }

  public getCanvas() {
    return this.canvas;
  }

  public hasImage(id: string): boolean {
    return this.iconMap.hasOwnProperty(id);
  }

  public removeImage(id: string): void {
    if (this.hasImage(id)) {
      this.iconData = this.iconData.filter((icon) => {
        return icon.id !== id;
      });
      delete this.iconMap[id];
      this.update();
    }
  }
  public destroy(): void {
    this.iconData = [];
    this.iconMap = {};
  }
  private update() {
    this.updateIconMap();
    this.updateIconAtlas();
    this.emit('imageUpdate');
  }

  private updateIconAtlas() {
    this.canvas.width = MAX_CANVAS_WIDTH;
    this.canvas.height = this.canvasHeight;
    Object.keys(this.iconMap).forEach((item: string) => {
      const { x, y, image } = this.iconMap[item];
      if (image) {
        this.ctx.drawImage(image, x, y, imageSize, imageSize);
      }
    });
  }

  private updateIconMap() {
    const { mapping, canvasHeight } = buildIconMaping(
      this.iconData,
      BUFFER,
      MAX_CANVAS_WIDTH,
    );
    this.iconMap = mapping;
    this.canvasHeight = canvasHeight;
  }

  private loadImage(url: IImage) {
    return new Promise((resolve, reject) => {
      if (url instanceof HTMLImageElement) {
        resolve(url);
        return;
      }
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        resolve(image);
      };
      image.onerror = () => {
        reject(new Error('Could not load image at ' + url));
      };
      image.src = url instanceof File ? URL.createObjectURL(url) : url;
    });
  }
}
