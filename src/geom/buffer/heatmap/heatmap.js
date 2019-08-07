// import BufferBase from '../bufferBase';
import { colorScales } from '../../../attr/colorscales';
import * as THREE from '../../../core/three';
import Base from '../../../core/base';

export default class HeatmapBuffer extends Base {
  constructor(cfg) {
    super(cfg);
    this.init();
  }
  init() {
    const data = this.get('data');
    const positions = [];
    const dirs = [];
    const weights = [];
    // const indices = [];

    // 组织顶点数据
    data.forEach(d => {
      // const totalIndex = index * 4;
      const coord = d.coordinates;
      const weight = d.size;
      const dir = this._addDir(-1, 1);
      const dir1 = this._addDir(1, 1);
      const dir2 = this._addDir(-1, -1);
      const dir3 = this._addDir(1, -1);
      positions.push(...coord, ...coord, ...coord, ...coord, ...coord, ...coord);
      dirs.push(...dir, ...dir2, ...dir3, ...dir1, ...dir, ...dir3);
      weights.push(weight, weight, weight, weight, weight, weight);
      // indices.push(totalIndex, totalIndex + 2, totalIndex + 3, totalIndex, totalIndex + 3, totalIndex + 1);
    });

    this.attributes = {
      vertices: positions,
      // indices,
      dirs,
      weights
    };
  }

  _addVertex(position, dirX, dirY) {
    const x = (position[0] * 2) + ((dirX + 1) / 2);
    const y = (position[1] * 2) + ((dirY + 1) / 2);
    const z = position[2];
    return [ x, y, z ];
  }

  _addDir(dirX, dirY) {
    const x = (dirX + 1) / 2;
    const y = (dirY + 1) / 2;
    return [ x, y ];
  }

}

export function createColorRamp(colors) {
  const colorImageData = getColorRamp(colors);
  const colorTexture = getTexture(colorImageData);
  return colorTexture;
}

function getColorRamp(name) {
  let colorscale = name;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 1;
  canvas.height = 256;
  const gradient = ctx.createLinearGradient(0, 0, 0, 256);
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
    ctx.fillRect(0, 0, 1, 256);
    data = new Uint8ClampedArray(ctx.getImageData(0, 0, 1, 256).data);
  }
  if (Object.prototype.toString.call(colorscale) === '[object Uint8Array]') {
    data = ctx.createImageData(1, 256);
  }

  return new ImageData(data, 1, 256);

}

function getTexture(image) {
  const texture = new THREE.Texture(image);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.format = THREE.RGBAFormat;
  texture.type = THREE.UnsignedByteType;
  texture.needsUpdate = true;
  return texture;
}

