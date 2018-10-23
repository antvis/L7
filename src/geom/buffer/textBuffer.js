import Base from '../../core/base';
import TinySDF from '@mapbox/tiny-sdf';
import { Texture } from '../../core/three';
export default class textBuffer extends Base {
  constructor(cfg) {
    super(cfg);
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.fontSize = 24;
    this.fontWeight = 400;
    this.sdfs = {};
    this.bufferStruct = {};
    this.chars = this.makeChars();
    this.updateSDF();
    this.geometryBuffer();
  }

  geometryBuffer() {
    const coordinates = this.get('coordinates');
    const properties = this.get('properties');
    const uvs = [];
    const texture = new Texture2D('charts', this.canvas);
    this.bufferStruct.style = properties;
    // this.bufferStruct.utexture = this.canvas;
    this.bufferStruct.utexture = texture;
    const positions = [];
    const textIndex = [];
    const index = 0;
    coordinates.forEach((coor, index) => {
      positions.push([[ coor[0], coor[1] ], [ coor[0], coor[1] ]]);
      textIndex.push([ 0, 1 ]);
      index++;
      const posX = this.sdfs[this.chars[index]].x; // pos in sprite x
      const posY = this.sdfs[this.chars[index]].y; // pos in sprite y
      uvs.push([[ posX / 2048, posY / 2048 ], [ posX / 2048, posY / 2048 ]]);
    });
    this.bufferStruct.position = positions;
    this.bufferStruct.uv = uvs;
    this.bufferStruct.textIndex = textIndex;
    this.bufferStruct.indexCount = this.bufferStruct.position.length * 2;
  }
  makeChars() {
    const properties = this.get('properties');
    const chars = [];
    properties.forEach(item => {
      const text = item.shape;
      text.forEach(char => {
        chars.push(char);
      });
    });
    return chars;
  }
  updateSDF() {
    this.canvas.width = 2048;
    this.canvas.height = 2048;
    const buffer = this.fontSize / 8;
    const radius = this.fontSize / 3;
    const sdf = new TinySDF(this.fontSize, buffer, radius, null, null, this.fontWeight);
    for (let y = 0, i = 0; y + sdf.size <= this.canvas.height && i < this.chars.length; y += sdf.size) {
      for (let x = 0; x + sdf.size <= this.canvas.width && i < this.chars.length; x += sdf.size) {
        this.ctx.putImageData(this.makeRGBAImageData(sdf.draw(this.chars[i]), sdf.size), x, y);
        this.sdfs[this.chars[i]] = { x, y };
        i++;
      }
    }
  }
  makeRGBAImageData(alphaChannel, size) {
    const imageData = this.ctx.createImageData(size, size);
    const data = imageData.data;
    for (let i = 0; i < alphaChannel.length; i++) {
      data[4 * i + 0] = alphaChannel[i];
      data[4 * i + 1] = alphaChannel[i];
      data[4 * i + 2] = alphaChannel[i];
      data[4 * i + 3] = 255;
    }
    return imageData;
  }
}
