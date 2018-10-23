import BufferBase from './bufferBase';
import { Texture2D } from '../../core/three';
import { TextureFilter, TextureWrapMode } from '@ali/r3-base';
import { getJSON, getImage } from '../../util/ajax';
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
    const style = this.get('style');
    const { size = 24 } = style;
    const chars = [];
    const positions = [];
    const uvs = [];
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
      let indexCount = 0;
      properties.forEach((element, index) => {
        const text = element.shape;

        const pos = coordinates[index];
        const dimensions = this._measureText(text, size);
        // const pen = { x: pos[0] - dimensions.advance / 2, y: pos[1] };
        const pen = { x: pos[0], y: pos[1] };
        const vertexElements = [];
        const textureElements = [];
        for (let i = 0; i < text.length; i++) {
          const chr = text.charCodeAt(i);
          const offset = dimensions.advance / text.length * i;
          this._drawGlyph(chr, pen, size, vertexElements, textureElements, offset);
        }

        uvs.push(textureElements);
        indexCount += vertexElements.length;
        positions.push(vertexElements);
      });
      this.bufferStruct.uv = uvs;
      this.bufferStruct.position = positions;
      this.bufferStruct.style = properties;
      this.bufferStruct.indexCount = indexCount;
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
  _drawGlyph(chr, pen, size, vertexElements, textureElements, offset) {
    const metrics = this.metrics;
    const metric = metrics.chars[chr];
    if (!metric) return;

    const scale = size / metrics.size;

    const factor = 1;

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
      const w1 = (horiBearingX - buffer) * scale + offset;
      const w2 = (horiBearingX - buffer + width) * scale + offset;
      const h1 = -horiBearingY * scale;
      const h2 = (height - horiBearingY) * scale;
      vertexElements.push(
                [ (factor * (pen.x + w1)), (factor * (pen.y + h1)), w1, h1 ],
                [ (factor * (pen.x + w2)), (factor * (pen.y + h1)), w2, h1 ],
                [ (factor * (pen.x + w1)), (factor * (pen.y + h2)), w1, h2 ],

                [ (factor * (pen.x + w2)), (factor * (pen.y + h1)), w2, h1 ],
                [ (factor * (pen.x + w1)), (factor * (pen.y + h2)), w1, h2 ],
                [ (factor * (pen.x + w2)), (factor * (pen.y + h2)), w2, h2 ]
            );

      textureElements.push(
                [ posX, posY + height ],
                [ posX + width, posY + height ],
                [ posX, posY ],

                [ posX + width, posY + height ],
                [ posX, posY ],
                [ posX + width, posY ]
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
    const texture = new Texture2D('textTexure', image, {
      magFilter: TextureFilter.LINEAR,
      minFilter: TextureFilter.LINEAR,
      wrapS: TextureWrapMode.CLAMP_TO_EDGE,
      wrapT: TextureWrapMode.CLAMP_TO_EDGE
    });
    return texture;
  }

}
