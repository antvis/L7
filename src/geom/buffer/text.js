import BufferBase from './bufferBase';
import { getJSON, getImage } from '../../util/ajax';
import * as THREE from '../../core/three';
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
    const chars = [];
    properties.forEach(element => {
      const text = element.shape;

      for (let j = 0; j < text.length; j++) {
        const code = text.charCodeAt(j);
        if (chars.indexOf(code) === -1) {
          chars.push(text.charCodeAt(j));
        }
      }
    });
    this.on('SourceLoaded', () => {
      const textureElements = [];
      const colors = [];
      const originPoints = [];
      const textSizes = [];
      const textOffsets = [];
      properties.forEach((element, index) => {
        const text = element.shape;
        const size = element.size;
        const pos = coordinates[index];
        // const pen = { x: pos[0] - dimensions.advance / 2, y: pos[1] };
        const pen = { x: 0, y: 0 };
        for (let i = 0; i < text.length; i++) {
          const chr = text.charCodeAt(i);

          const color = element.color;
          this._drawGlyph(pos, chr, pen, size, colors, textureElements, originPoints, textSizes, textOffsets, color);
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
    this._loadTextInfo(chars);
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
    getImage({
      url: `${Global.sdfHomeUrl}${url}`
    }, (e, image) => {
      this.bufferStruct.textTexture = this._creatTexture(image);
      this.emit('SourceLoaded');
    });
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
  _drawGlyph(pos, chr, pen, size, colors, textureElements, originPoints, textSizes, textOffsets, color) {
    const metrics = this.metrics;
    const metric = metrics.chars[chr];
    if (!metric) return;

    const scale = size / metrics.size;

    let width = metric[0];
    let height = metric[1];

    const horiBearingX = metric[2];
    const horiBearingY = metric[3];

    const horiAdvance = metric[4];
    const posX = metric[5];
    const posY = metric[6];

    const buffer = metrics.buffer;

    if (width > 0 && height > 0) {
      width += buffer * 2;
      height += buffer * 2;

    // Add a quad (= two triangles) per glyph.
      const originX = (horiBearingX - buffer + width / 2) * scale;
      // const originY = -(height / 2  - horiBearingY) * scale;
      const originY = (height / 2 - horiBearingY) * scale;
      // const originY = 0;
      const offsetWidth = width / 2 * scale / (1.0 - horiBearingX * 1.5 / horiAdvance);
      const offsetHeight = (horiAdvance / 2) * scale;

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

      textSizes.push(
      offsetWidth, offsetHeight,
      -offsetWidth, offsetHeight,
      -offsetWidth, -offsetHeight,
      offsetWidth, offsetHeight,
      -offsetWidth, -offsetHeight,
      offsetWidth, -offsetHeight,
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

    pen.x = pen.x + (horiAdvance + Space) * scale;

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
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }
}
