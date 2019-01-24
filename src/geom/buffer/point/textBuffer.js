

import { getJSON } from '../../../util/ajax';
import EventEmitter from 'wolfy87-eventemitter';
import Global from '../../../global';
// const Space = 1;
const metrics = {
  buffer: 3,
  family: 'ios9',
  size: 24
};
export default function TextBuffer(coordinates, properties, style) {
  EventEmitter.call(this);
  const attributes = {
    originPoints: [],
    textSizes: [],
    textOffsets: [],
    colors: [],
    textureElements: []
  };
  const { textOffset = [ 0, 0 ] } = style;
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
  loadTextInfo(chars, (chars, texture) => {
    properties.forEach((element, index) => {
      const size = element.size;
      const pos = coordinates[index];
      const pen = { x: textOffset[0], y: textOffset[1] };
      let text = element.shape || '';
      text = text.toString();
      for (let i = 0; i < text.length; i++) {
        const color = element.color;
        drawGlyph(chars, pos, text[i], pen, size, attributes.colors, attributes.textureElements, attributes.originPoints, attributes.textSizes, attributes.textOffsets, color);
      }
      this.emit('completed', { attributes, texture });
    });
  });
}

function loadTextInfo(chars, done) {
  getJSON({
    url: `${Global.sdfHomeUrl}/getsdfdata?chars=${chars.join('|')}`
  }, (e, info) => {
    loadTextTexture(info.url, texture => {
      done(info.info, texture);
    });
  });
}
function loadTextTexture(url, cb) {


  const img = new Image();
  img.crossOrigin = 'anonymous';

  img.onload = () => {
    const textTexture = this._creatTexture(img);
    cb(textTexture);
  };
  img.src = url;

}
  /**
   * 计算每个标注词语的位置
   * @param {*} chars 文本信息
   * @param {*} pos 文字三维空间坐标
   * @param {*} text 字符
   * @param {*} pen 字符在词语的偏移量
   * @param {*} size 字体大小
   * @param {*} colors 颜色
   * @param {*} textureElements  纹理坐标
   * @param {*} originPoints 初始位置数据
   * @param {*} textSizes 文字大小数组
   * @param {*} textOffsets 字体偏移量数据
   * @param {*} color 文字颜色
   */
function drawGlyph(chars, pos, text, pen, size, colors, textureElements, originPoints, textSizes, textOffsets, color) {
  const chr = text.charCodeAt(0);
  const metric = chars[chr];
  if (!metric) return;
  const scale = size / metrics.size;

  let width = metric[0];
  let height = metric[1];
  const posX = metric[5];
  const posY = metric[6];
  const buffer = metrics.buffer;
  if (width > 0 && height > 0) {
    width += buffer * 2;
    height += buffer * 2;
    const originX = 0;
    const originY = 0;
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
  pen.x = pen.x + size * 1.8;

}


// function measureText(text, size) {
//   const dimensions = {
//     advance: 0
//   };
//   const metrics = this.metrics;
//   const scale = size / metrics.size;
//   for (let i = 0; i < text.length; i++) {
//     const code = text.charCodeAt(i);
//     const horiAdvance = metrics.chars[code][4];

//     dimensions.advance += (horiAdvance + Space) * scale;
//   }

//   return dimensions;
// }
// function creatTexture(image) {
//   this.bufferStruct.textSize = [ image.width, image.height ];
//   const texture = new THREE.Texture(image);
//   texture.minFilter = THREE.LinearFilter;
//   texture.magFilter = THREE.ClampToEdgeWrapping;
//   texture.needsUpdate = true;
//   return texture;
// }
