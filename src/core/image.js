import * as THREE from './three';
import EventEmitter from 'wolfy87-eventemitter';
import { getImage } from '../util/ajax';
// 将图片标注绘制在512*512的画布上，每个大小 64*64 支持 64种图片
export default class LoadImage extends EventEmitter {
  constructor() {
    super();
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle="#FF0000";
    this.ctx.fillRect(0,0,512,512);
    this.imageWidth = 64;
    this.canvas.width = this.imageWidth * 8;
    this.canvas.height = this.imageWidth * 8;
    this.images = [];
    this.imagesCount = 0;
    this.imagePos = {};
  }
  addImage(id, opt) {
    this.imagesCount ++;
    const imageCount = this.imagesCount;
    const x = imageCount % 8 * 64;
    const y = parseInt(imageCount / 8) * 64;
    this.imagePos[id] = { x: x / 512, y: y / 512 };
    if (typeof opt === 'string') {
      getImage({ url: opt }, (err, img) => {
        img.id = id;
        this.images.push(img);
        this.ctx.drawImage(img, x, y, 64, 64);
        const texture = new THREE.Texture(this.canvas);
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
        this.texture = texture;
        if (this.images.length === this.imagesCount) {
          this.emit('imageLoaded');
        }
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
      this.ctx.drawImage(image, x, y, 64, 64);
      this.texture = new THREE.CanvasTexture(this.canvas);
      this.imagePos[id] = { x: x >> 9, y: y >> 9 };
      if (this.images.length === this.imagesCount) {
        this.emit('imageLoaded');
      }
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
