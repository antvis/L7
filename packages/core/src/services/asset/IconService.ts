import { $window } from '@antv/l7-utils';
import { EventEmitter } from 'eventemitter3';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { buildIconMaping } from '../../utils/font_util';
import { ITexture2D } from '../renderer/ITexture2D';
import { ISceneService } from '../scene/ISceneService';
import { IIcon, IICONMap, IIconService, IImage } from './IIconService';
const BUFFER = 3;
const MAX_CANVAS_WIDTH = 1024;
const imageSize = 64;
@injectable()
export default class IconService extends EventEmitter implements IIconService {
  public canvasHeight: number = 128;
  private texture: ITexture2D;
  private canvas: HTMLCanvasElement;
  private iconData: IIcon[];
  private iconMap: IICONMap;
  private ctx: CanvasRenderingContext2D;
  private loadingImageCount = 0;

  public isLoading() {
    return this.loadingImageCount === 0;
  }
  public init() {
    this.iconData = [];
    this.iconMap = {};
    this.canvas = $window.document.createElement('canvas');
    this.canvas.width = 128;
    this.canvas.height = 128;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  public async addImage(id: string, image: IImage) {
    let imagedata = new Image();
    this.loadingImageCount++;
    if (this.hasImage(id)) {
      console.warn('Image Id already exists');
    } else {
      this.iconData.push({
        id,
        size: imageSize,
      });
    }
    this.updateIconMap(); // 先存储 ID，
    imagedata = (await this.loadImage(image)) as HTMLImageElement;
    const iconImage = this.iconData.find((icon: IIcon) => {
      return icon.id === id;
    });
    if (iconImage) {
      iconImage.image = imagedata;
      iconImage.width = imagedata.width;
      iconImage.height = imagedata.height;
    }
    this.update();
  }

  /**
   * 适配小程序
   * @param id
   * @param image
   * @param sceneService
   */
  public addImageMini(id: string, image: IImage, sceneService: ISceneService) {
    const canvas = sceneService.getSceneConfig().canvas;
    // @ts-ignore
    let imagedata = canvas.createImage();
    this.loadingImageCount++;
    if (this.hasImage(id)) {
      throw new Error('Image Id already exists');
    }
    this.iconData.push({
      id,
      size: imageSize,
    });
    this.updateIconMap();
    this.loadImageMini(image, canvas as HTMLCanvasElement).then((img) => {
      imagedata = img as HTMLImageElement;
      const iconImage = this.iconData.find((icon: IIcon) => {
        return icon.id === id;
      });
      if (iconImage) {
        iconImage.image = imagedata;
        iconImage.width = imagedata.width;
        iconImage.height = imagedata.height;
      }
      this.update();
    });
  }

  public getTexture(): ITexture2D {
    return this.texture;
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
    // 在销毁的时候清除所有注册的监听
    this.removeAllListeners('imageUpdate');
    this.iconData = [];
    this.iconMap = {};
  }

  public loadImage(url: IImage) {
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
  private update() {
    this.updateIconMap();
    this.updateIconAtlas();
    this.loadingImageCount--;
    if (this.loadingImageCount === 0) {
      this.emit('imageUpdate');
    }
  }

  /**
   * 将新增的 icon 图像存储到画布上（正方形）
   */
  private updateIconAtlas() {
    this.canvas.width = MAX_CANVAS_WIDTH;
    this.canvas.height = this.canvasHeight;
    Object.keys(this.iconMap).forEach((item: string) => {
      const { x, y, image, width = 64, height = 64 } = this.iconMap[item];
      const max = Math.max(width as number, height as number);
      const ratio = max / imageSize;
      const drawHeight = height / ratio;
      const drawWidth = width / ratio;
      if (image) {
        this.ctx.drawImage(
          image,
          x + (imageSize - drawWidth) / 2,
          y + (imageSize - drawHeight) / 2,
          drawWidth,
          drawHeight,
        );
      }
    });
  }

  /**
   * 计算 icon 在画布上的排布（是否需要换行）
   */
  private updateIconMap() {
    const { mapping, canvasHeight } = buildIconMaping(
      this.iconData,
      BUFFER,
      MAX_CANVAS_WIDTH,
    );
    this.iconMap = mapping;
    this.canvasHeight = canvasHeight;
  }

  /**
   * 适配小程序
   * @param url
   * @returns
   */
  private loadImageMini(url: IImage, canvas: HTMLCanvasElement) {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      const image = canvas.createImage();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        resolve(image);
      };
      image.onerror = () => {
        reject(new Error('Could not load image at ' + url));
      };
      image.src = url as string;
    });
  }
}
