import { buildIconMaping } from '../../util/font-util';
import * as THREE from '../../../../core/three';
const BUFFER = 3;
const MAX_CANVAS_WIDTH = 1024;
export default class IconManager {
  constructor() {
    this._getIcon = null;
    this._mapping = {};
    this._autoPacking = false;
    this.iconData = {};
    this._canvas = document.createElement('canvas');
    this._texture = new THREE.Texture(this._canvas);
    this.ctx = this._canvas.getContext('2d');
  }
  getTexture() {
    return this._texture;
  }

  _updateIconAtlas() {
    this._canvas.width = MAX_CANVAS_WIDTH;
    this._canvas.height = this._canvasHeigth;
    for (const key in this.mapping) {
      const icon = this.mapping[key];
      const { x, y, image } = icon;
      this.ctx.drawImage(image, x, y, this.imageWidth, this.imageWidth);
    }
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.needsUpdate = true;
  }

  addImage(id, opt) {
    this._loadImage(opt).then(image => {
      this.iconData.push({ id, image });
      const { mapping, canvasHeight } = buildIconMaping(this.iconData, BUFFER, MAX_CANVAS_WIDTH);
      this._mapping = mapping;
      this._canvasHeigth = canvasHeight;
    });
  }
  _loadImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        resolve(image);
      };
      image.onerror = function() {
        reject(new Error('Could not load image at ' + url));
      };
      image.src = url;
    });
  }
}
