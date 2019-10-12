import { inject, injectable } from 'inversify';
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
export default class IconService implements IIconService {
  private canvas: HTMLCanvasElement;
  private iconData: IIcon[];
  private iconMap: IICONMap;
  private canvasHeigth: number;
  private textrure: ITexture2D;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.iconData = [];
    this.iconMap = {};
    this.canvas = document.createElement('canvas');
    // this.texture =
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  public async addImage(id: string, image: IImage) {
    const imagedata = (await this.loadImage(image)) as HTMLImageElement;
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
    this.canvasHeigth = canvasHeight;
    this.updateIconAtlas();
  }

  public getTexture(): ITexture2D {
    throw new Error('Method not implemented.');
  }

  public getIconMap() {
    return this.iconMap;
  }

  private updateIconAtlas() {
    this.canvas.width = MAX_CANVAS_WIDTH;
    this.canvas.height = this.canvasHeigth;
    Object.keys(this.iconMap).forEach((item: string) => {
      const { x, y, image } = this.iconMap[item];
      this.ctx.drawImage(image, x, y, imageSize, imageSize);
    });
    // this.texture.magFilter = THREE.LinearFilter;
    // this.texture.minFilter = THREE.LinearFilter;
    // this.texture.needsUpdate = true;
  }

  private loadImage(url: IImage) {
    return new Promise((resolve, reject) => {
      if (url instanceof HTMLImageElement) {
        resolve(url);
        return;
      }
      const image = new Image();
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
