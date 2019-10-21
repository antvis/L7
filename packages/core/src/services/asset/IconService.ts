import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { buildIconMaping } from '../../utils/font_util';
import { gl } from '../renderer/gl';
import { IRendererService } from '../renderer/IRendererService';
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
export default class IconService implements IIconService {
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
    this.loadImage(image).then((img) => {
      imagedata = img as HTMLImageElement;
    });
    this.iconData.push({
      id,
      image: imagedata,
      width: imageSize,
      height: imageSize,
    });
    const { mapping, canvasHeight } = buildIconMaping(
      this.iconData,
      BUFFER,
      MAX_CANVAS_WIDTH,
    );
    this.iconMap = mapping;
    this.canvasHeight = canvasHeight;
    this.updateIconAtlas();
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
    throw new Error('Method not implemented.');
  }
  public removeImage(id: string): void {
    throw new Error('Method not implemented.');
  }

  private updateIconAtlas() {
    this.canvas.width = MAX_CANVAS_WIDTH;
    this.canvas.height = this.canvasHeight;
    Object.keys(this.iconMap).forEach((item: string) => {
      const { x, y, image } = this.iconMap[item];
      this.ctx.drawImage(image, x, y, imageSize, imageSize);
    });
    // const { createTexture2D } = this.rendererService;
    // this.textrure = createTexture2D({
    //   data: this.canvas,
    //   width: this.canvas.width,
    //   height: this.canvasHeight,
    //   mag: gl.LINEAR,
    // });
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
