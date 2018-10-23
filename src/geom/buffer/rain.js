import BufferBase from './bufferBase';
import * as THREE from '../../core/three';
import { colorScales } from '../../attr/colorscales';
export class RainBuffer extends BufferBase {
  geometryBuffer() {
    const defaultRampColors = {
      0.0: '#3288bd',
      0.1: '#66c2a5',
      0.2: '#abdda4',
      0.3: '#e6f598',
      0.4: '#fee08b',
      0.5: '#fdae61',
      0.6: '#f46d43',
      1.0: '#d53e4f'
    };

    const coordinates = this.get('coordinates');
    const particleImage1 = this.get('particleImage1');
    const particleImage0 = this.get('particleImage0');
    const backgroundImage = this.get('backgroundImage');
    const extent = this.get('extent');
    const imgPos = [ ...extent[0],
      extent[1][0], extent[0][1], 0,
      ...extent[1],
      ...extent[0],
      ...extent[1],
      extent[0][0], extent[1][1], 0
    ];
    const imgPosUv = [ 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0 ];
    const image = this.get('image');
    this.bufferStruct.particleStateTexture0 = this._getTexture(particleImage0, THREE.NearestFilter);
    this.bufferStruct.particleStateTexture1 = this._getTexture(particleImage1, THREE.NearestFilter);
    this.bufferStruct.backgroundTexture = this._getTexture(backgroundImage, THREE.NearestFilter);
    const texture = this._getTexture(image, THREE.NearestFilter);
    const colorImageData = this.getColorRamp('wind');
    const colorTexture = this._getTexture(colorImageData, THREE.LinearFilter);
    this.bufferStruct.position = coordinates;
    this.bufferStruct.imgPos = imgPos;
    this.bufferStruct.imgPosUv = imgPosUv;
    this.bufferStruct.u_wind = texture;// 风速 风向
    this.bufferStruct.colorTexture = colorTexture; // 颜色表‘=
    const attributes = {
      vertices: new Float32Array(imgPos),
      uvs: new Float32Array(imgPosUv)
    };
    this.attributes = attributes;

  }
  // //生成色带纹理
  // getColorRamp(colors) {
  //   const canvas = document.createElement('canvas');
  //   const ctx = canvas.getContext('2d');

  //   canvas.width = 256;
  //   canvas.height = 1;

  //   const gradient = ctx.createLinearGradient(0, 0, 256, 0);
  //   for (const stop in colors) {
  //     gradient.addColorStop(+stop, colors[stop]);
  //   }

  //   ctx.fillStyle = gradient;
  //   ctx.fillRect(0, 0, 256, 1);
  //   const data = new Uint8ClampedArray(ctx.getImageData(0, 0, 256, 1).data);
  //   return new ImageData(data, 16, 16);
  // }
  getColorRamp(name) {
    let colorscale = name;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 256;
    canvas.height = 1;
    const gradient = ctx.createLinearGradient(0, 0, 256, 0);
    let data = null;
    if (typeof (colorscale) === 'string') {
      colorscale = colorScales[name];
    }
    if (Object.prototype.toString.call(colorscale) === '[object Object]') {
      const min = colorscale.positions[0];
      const max = colorscale.positions[colorscale.positions.length - 1];

      for (let i = 0; i < colorscale.colors.length; ++i) {
        const value = (colorscale.positions[i] - min) / (max - min);
        gradient.addColorStop(value, colorscale.colors[i]);
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 1);
      data = new Uint8ClampedArray(ctx.getImageData(0, 0, 256, 1).data);
    }
    if (Object.prototype.toString.call(colorscale) === '[object Uint8Array]') {
      data = ctx.createImageData(256, 1);
    }

    return new ImageData(data, 16, 16);

  }
  // 生成纹理
  _getTexture(image, filter) {
    const texture = new THREE.Texture(image);
    texture.magFilter = filter;
    texture.minFilter = filter;
    texture.needsUpdate = true;
    return texture;
  }

}
