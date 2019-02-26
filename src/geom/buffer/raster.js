import BufferBase from './bufferBase';
import { colorScales } from '../../attr/colorscales';
import * as THREE from '../../core/three';
export class RasterBuffer extends BufferBase {
  geometryBuffer() {
    const layerData = this.get('layerData');
    const { coordinates, width, data, height } = layerData.dataArray[0];
    const positions = [
      ...coordinates[0],
      coordinates[1][0], coordinates[0][1], 0,
      ...coordinates[1],
      ...coordinates[0],
      ...coordinates[1],
      coordinates[0][0], coordinates[1][1], 0
    ];
    const imgPosUv = [ 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0 ];
    const size = this.get('size');
    const texture = new THREE.DataTexture(new Float32Array(data), width, height, THREE.LuminanceFormat, THREE.FloatType);
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
    const colors = this.get('rampColors');
    const colorImageData = this.getColorRamp(colors);
    const colorTexture = this._getTexture(colorImageData);
    this.bufferStruct.position = positions;
    this.bufferStruct.uv = imgPosUv;
    this.bufferStruct.u_raster = texture;//
    this.bufferStruct.u_extent = [ coordinates[0][0], coordinates[0][1], coordinates[1][0], coordinates[1][1] ];

    this.bufferStruct.u_colorTexture = colorTexture; // 颜色表‘=
    const triangles = this._buildTriangles(width, height, size, this.bufferStruct.u_extent);
    const attributes = {
      vertices: new Float32Array(triangles.vertices),
      uvs: new Float32Array(triangles.uvs),
      indices: triangles.indices,
      dimension: triangles.dimension

    };
    this.attributes = attributes;
  }
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
  _getTexture(image) {
    const texture1 = new THREE.Texture(image);
    texture1.magFilter = THREE.LinearFilter;
    texture1.minFilter = THREE.LinearFilter;
    texture1.format = THREE.RGBAFormat;
    texture1.type = THREE.UnsignedByteType;
    texture1.needsUpdate = true;
    return texture1;
  }
  _buildTriangles(width, height, size = 1, extent) {
    // const extent = [ 73.482190241, 3.82501784112, 135.106618732, 57.6300459963 ]
    const indices = [];
    const vertices = [];
    const uvs = [];
    const gridX = Math.floor(width / size);
    const gridY = Math.floor(height / size);
    const gridX1 = gridX + 1;
    const gridY1 = gridY + 1;
    const stepX = (extent[2] - extent[0]) / gridX1;
    const stepY = (extent[3] - extent[1]) / gridY1;
    for (let i = 0; i < gridY1; i++) {
      const y = i * size;
      for (let j = 0; j < gridX1; j++) {
        const x = j * size;
        vertices.push(extent[0] + x * stepX, (height - y) * stepY + extent[1], 0);
        uvs.push(j / gridX);
        uvs.push(i / gridY);
      }
    }
    for (let iy = 0; iy < gridY; iy++) {
      for (let ix = 0; ix < gridX; ix++) {
        const a = ix + gridX1 * iy;
        const b = ix + gridX1 * (iy + 1);
        const c = (ix + 1) + gridX1 * (iy + 1);
        const d = (ix + 1) + gridX1 * iy;
        indices.push(a, b, d);
        indices.push(b, c, d);
      }

    }
    return {
      uvs,
      indices,
      vertices,
      dimension: [ gridX, gridY ]
    };

  }

}
