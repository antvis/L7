// @ts-nocheck
// tslint:disable
import { getCanvas } from './register';
import * as Mixin from './util/mixin';

export class Image {
  constructor() {
    const canvas = getCanvas();

    const image = (canvas.createImage && canvas.createImage()) || {};

    if (!('tagName' in image)) {
      image.tagName = 'IMG';
      image.__proto__ = Image.prototype;
    }

    Mixin.parentNode(image);
    Mixin.classList(image);

    Object.assign(image, {
      addEventListener(name, cb) {
        image[`on${name}`] = cb.bind(image);
      },
      removeEventListener(name) {
        image[`on${name}`] = null;
      },
    });

    return image;
  }
}
