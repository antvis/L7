import * as THREE from './three';
import EventEmitter from 'wolfy87-eventemitter';
import { getImage } from '../util/ajax';
// 将图片标注绘制在512*512的画布上，每个大小 64*64 支持 64种图片
export default class LoadImage extends EventEmitter {
  constructor() {
    super();
    const pixelRatio = window.devicePixelRatio || 1;
    this.imageWidth = 64 * pixelRatio;
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText += 'height: 512px;width: 512px;';
    this.canvas.width = this.imageWidth * 8;
    this.canvas.height = this.imageWidth * 8;
    this.ctx = this.canvas.getContext('2d');
    this.images = [];
    this.imagesCount = 0;
    this.imagePos = {};
    this.imagesIds = [];
  }
  addImage(id, opt) {
    this.imagesCount++;
    this.imagesIds.push(id);
    const imageCount = this.imagesCount;
    const x = imageCount % 8 * this.imageWidth;
    const y = parseInt(imageCount / 8) * this.imageWidth;
    this.imagePos[id] = { x: x / this.canvas.width, y: y / this.canvas.height };
    this.texture = new THREE.Texture(this.canvas);
    if (typeof opt === 'string') {
      getImage({ url: opt }, (err, img) => {
        img.id = id;
        this.images.push(img);
        this.ctx.drawImage(img, x, y, this.imageWidth, this.imageWidth);
        this.texture.magFilter = THREE.LinearFilter;
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.needsUpdate = true;
        this.emit('imageLoaded');

      });
    } else {
      const { width, height, channels } = opt;
      const data = new Uint8Array(width * height * channels);
      const image = new Image();
      image.width = width;
      image.height = height;
      image.data = data;
      image.id = id;
      this.images.push(image);
      this.ctx.drawImage(image, x, y, this.imageWidth, this.imageWidth);
      this.texture = new THREE.CanvasTexture(this.canvas);
      this.imagePos[id] = { x: x >> 9, y: y >> 9 };
      this.texture.needsUpdate = true;
      this.emit('imageLoaded');
    }

  }
  removeImage() {
  // todo

  }
  // drawAllImages() {
  //   this.images.forEach((item, index) => {
  //     const x = parseInt(index / 8) * 64;
  //     const y = index % 8 * 64;
  //     this.ctx.drawImage(item, x, y, 64, 64);
  //   });
  //   this.texture = new CanvasTexture(this.canvas);
  //   this.texture.needsUpdate=true;
  // }


}
