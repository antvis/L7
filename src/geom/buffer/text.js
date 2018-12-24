import BufferBase from './bufferBase';
import { getJSON } from '../../util/ajax';
import * as THREE from '../../core/three';
import TinySDF from '@mapbox/tiny-sdf';

import Global from '../../global';
const Space = 1;
export default class TextBuffer extends BufferBase {

  geometryBuffer() {
    this.metrics = {
      buffer: 3,
      family: 'ios9',
      size: 24
    };
    const coordinates = this.get('coordinates');
    const properties = this.get('properties');
    const { textOffset = [ 0, 0 ] } = this.get('style');
    const chars = [];
    const textChars = {};
    properties.forEach(element => {
      let text = element.shape || '';
      text = text.toString();
      for (let j = 0; j < text.length; j++) {
        const code = text.charCodeAt(j);
        textChars[text] = 0;
        if (chars.indexOf(code) === -1) {
          chars.push(text.charCodeAt(j));
        }
      }
    });
    const sdfTexture = this._updateSdf(Object.keys(textChars).join(''));
    this.sdfTexture = sdfTexture;

    this._loadTextInfo(chars);
    this.on('SourceLoaded', () => {
      const textureElements = [];
      const colors = [];
      const originPoints = [];
      const textSizes = [];
      const textOffsets = [];
      properties.forEach((element, index) => {
        const size = element.size;
        const pos = coordinates[index];
        // const pen = { x: pos[0] - dimensions.advance / 2, y: pos[1] };
        const pen = { x: textOffset[0], y: textOffset[1] };
        let text = element.shape || '';
        text = text.toString();
        for (let i = 0; i < text.length; i++) {


          const color = element.color;
          this._drawGlyph(pos, text[i], pen, size, colors, textureElements, originPoints, textSizes, textOffsets, color);
        }
      });
      this.bufferStruct.style = properties;
      this.attributes = {
        originPoints,
        textSizes,
        textOffsets,
        colors,
        textureElements
      };
      this.emit('completed');
    });

  }

  _loadTextInfo(chars) {
    getJSON({
      url: `${Global.sdfHomeUrl}/getsdfdata?chars=${chars.join('|')}`
    }, (e, info) => {
      this.metrics.chars = info.info;

      this._loadTextTexture(info.url);
    });
  }
  _loadTextTexture(url) {


    const img = new Image();
    img.crossOrigin = 'anonymous';


    img.onload = () => {
      this.bufferStruct.textTexture = this._creatTexture(this.sdfTexture.texure);
      this.emit('SourceLoaded');
    };
    img.src = url;

  }
  /**
   * 计算每个标注词语的位置
   * @param {*} pos 文字三维空间坐标
   * @param {*} chr 字符
   * @param {*} pen 字符在词语的偏移量
   * @param {*} size 字体大小
   * @param {*} colors 颜色
   * @param {*} textureElements  纹理坐标
   * @param {*} originPoints 初始位置数据
   * @param {*} textSizes 文字大小数组
   * @param {*} textOffsets 字体偏移量数据
   * @param {*} color 文字颜色
   */
  _drawGlyph(pos, text, pen, size, colors, textureElements, originPoints, textSizes, textOffsets, color) {
    const metrics = this.metrics;
    const chr = text.charCodeAt(0);
    const metric = metrics.chars[chr];
    if (!metric) return;
    const info = this.sdfTexture.info;
    const { x, y } = info[text];
    const scale = size / metrics.size;

    let width = 24; // metric[0];
    let height = 24;// metric[1];

    const horiBearingX = metric[2];
    // const horiBearingY = metric[3];

    const horiAdvance = metric[4];
    // const posX = metric[5];
    // const posY = metric[6];
    const posX = x;
    const posY = y;

    const buffer = metrics.buffer;

    if (width > 0 && height > 0) {
      width += buffer * 2;
      height += buffer * 2;

    // Add a quad (= two triangles) per glyph.
      // const originX = (horiBearingX - buffer + width / 2) * scale;
      // const originY = -(height - horiBearingY) * scale;
      const originX = 0;
      const originY = 0;

      // const offsetWidth = width / 2 * scale / (1.0 - horiBearingX * 1.5 / horiAdvance);
      // const offsetHeight = (horiAdvance / 2) * scale;

      // const offsetWidth = width/2 * scale;
      // const offsetHeight = height / 2 * scale;
      //  const offsetHeight = height * scale;

      const offsetX = pen.x;
      const offsetY = pen.y;
      originPoints.push(
      pos[0] + originX, pos[1] + originY, 0,
      pos[0] + originX, pos[1] + originY, 0,
      pos[0] + originX, pos[1] + originY, 0,
      pos[0] + originX, pos[1] + originY, 0,
      pos[0] + originX, pos[1] + originY, 0,
      pos[0] + originX, pos[1] + originY, 0,
   );

      // textSizes.push(
      // offsetWidth, offsetHeight,
      // -offsetWidth, offsetHeight,
      // -offsetWidth, -offsetHeight,
      // offsetWidth, offsetHeight,
      // -offsetWidth, -offsetHeight,
      // offsetWidth, -offsetHeight,
      // );
      const bx = 0;
      const by = metrics.size / 2 + buffer;
      textSizes.push(


        ((bx - buffer + width) * scale), (height - by) * scale,
        ((bx - buffer) * scale), (height - by) * scale,
        ((bx - buffer) * scale), -by * scale,

         ((bx - buffer + width) * scale), (height - by) * scale,
         ((bx - buffer) * scale), -by * scale,
         ((bx - buffer + width) * scale), -by * scale,


      );


      textOffsets.push(
      offsetX, offsetY,
      offsetX, offsetY,
      offsetX, offsetY,
      offsetX, offsetY,
      offsetX, offsetY,
      offsetX, offsetY,
    );

      colors.push(
      ...color,
      ...color,
      ...color,
      ...color,
      ...color,
      ...color,
    );
      textureElements.push(

        posX + width, posY,
        posX, posY,
        posX, posY + height,

        posX + width, posY,
        posX, posY + height,
        posX + width, posY + height
      );
    }

    // pen.x = pen.x + (horiAdvance + Space) * scale;
    pen.x = pen.x + size * 1.8;

  }


  _measureText(text, size) {
    const dimensions = {
      advance: 0
    };
    const metrics = this.metrics;
    const scale = size / metrics.size;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      const horiAdvance = metrics.chars[code][4];

      dimensions.advance += (horiAdvance + Space) * scale;
    }

    return dimensions;
  }
  _creatTexture(image) {
    this.bufferStruct.textSize = [ image.width, image.height ];
    const texture = new THREE.Texture(image);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
  }
  _updateSdf(chars) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const sdfs = {};


    const fontSize = 24;
    const fontWeight = 100;
    const buffer = fontSize / 8;
    const radius = fontSize / 3;
    const canvasSize = Math.floor(Math.pow(chars.length, 0.5)) * (fontSize + buffer + radius);
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const sdf = new TinySDF(fontSize, buffer, radius, null, null, fontWeight);
    for (let y = 0, i = 0; y + sdf.size <= canvas.height && i < chars.length; y += sdf.size) {
      for (let x = 0; x + sdf.size <= canvas.width && i < chars.length; x += sdf.size) {
        ctx.putImageData(this._makeRGBAImageData(ctx, sdf.draw(chars[i]), sdf.size), x, y);
        sdfs[chars[i]] = { x, y };
        i++;
      }
    }
    return {
      info: sdfs,
      texure: canvas
    };
  }
  _makeRGBAImageData(ctx, alphaChannel, size) {
    const imageData = ctx.createImageData(size, size);
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
