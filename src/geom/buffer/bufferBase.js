import Base from '../../core/base';
// import * as from '../../core/three';
import { Vector3 } from 'three/src/math/Vector3';
import { Texture } from 'three/src/textures/Texture';
import { faceNormals } from '../normals';
import extrude from '../extrude';

export default class BufferBase extends Base {
  constructor(cfg) {
    super(cfg);
    this.bufferStruct = {
    };

    this.geometryBuffer();
  }
  geometryBuffer() {
  }
  _normals() {
    const { position, indices, normals = [] } = this.bufferStruct;

    indices.forEach((index, i) => {
      normals.push(faceNormals(index, position[i]));
    });
    this.bufferStruct.normals = normals;
  }
  _extrude(coordinate, heightValue) {
    const extrudeData = extrude(coordinate, heightValue);
    return extrudeData;
  }
  _mergeAttributes(attributes) {
    const lengths = {};

    // Find array lengths
    attributes.forEach(_attributes => {
      for (const k in _attributes) {
        if (!lengths[k]) {
          lengths[k] = 0;
        }

        lengths[k] += _attributes[k].length;
      }
    });

    const mergedAttributes = {};

    // Set up arrays to merge into
    for (const k in lengths) {
      mergedAttributes[k] = new Float32Array(lengths[k]);
    }

    const lastLengths = {};

    attributes.forEach(_attributes => {
      for (const k in _attributes) {
        if (!lastLengths[k]) {
          lastLengths[k] = 0;
        }

        mergedAttributes[k].set(_attributes[k], lastLengths[k]);

        lastLengths[k] += _attributes[k].length;
      }
    });

    return mergedAttributes;
  }
  _toPolygonAttributes(polygon) {
  // Three components per vertex per face (3 x 3 = 9)
    const { style, indices, position, indexCount } = polygon;
    const vertices = new Float32Array(indexCount * 3);
    const normals = new Float32Array(indexCount * 3);
    const colors = new Float32Array(indexCount * 4);
    const pickingIds = new Float32Array(indexCount);
    const pA = new Vector3();
    const pB = new Vector3();
    const pC = new Vector3();

    const cb = new Vector3();
    const ab = new Vector3();
    let lastIndex = 0;
    indices.forEach((indice, pIndex) => {
      for (let i = 0; i < indice.length / 3; i++) {
        let index = indice[i * 3];
        const color = style[pIndex].color;
        const _pickingId = style[pIndex].id;
        const ax = position[pIndex][index][0];
        const ay = position[pIndex][index][1];
        const az = position[pIndex][index][2];
        index = indice[i * 3 + 1];
        const bx = position[pIndex][index][0];
        const by = position[pIndex][index][1];
        const bz = position[pIndex][index][2];
        index = indice[i * 3 + 2];
        const cx = position[pIndex][index][0];
        const cy = position[pIndex][index][1];
        const cz = position[pIndex][index][2];

        pA.set(ax, ay, az);
        pB.set(bx, by, bz);
        pC.set(cx, cy, cz);

        cb.subVectors(pC, pB);
        ab.subVectors(pA, pB);
        cb.cross(ab);

        cb.normalize();

        const nx = cb.x;
        const ny = cb.y;
        const nz = cb.z;

        vertices[lastIndex * 9 + 0] = ax;
        vertices[lastIndex * 9 + 1] = ay;
        vertices[lastIndex * 9 + 2] = az;

        normals[lastIndex * 9 + 0] = nx;
        normals[lastIndex * 9 + 1] = ny;
        normals[lastIndex * 9 + 2] = nz;

        colors[lastIndex * 12 + 0] = color[0];
        colors[lastIndex * 12 + 1] = color[1];
        colors[lastIndex * 12 + 2] = color[2];
        colors[lastIndex * 12 + 3] = color[3];


        vertices[lastIndex * 9 + 3] = bx;
        vertices[lastIndex * 9 + 4] = by;
        vertices[lastIndex * 9 + 5] = bz;

        normals[lastIndex * 9 + 3] = nx;
        normals[lastIndex * 9 + 4] = ny;
        normals[lastIndex * 9 + 5] = nz;

        colors[lastIndex * 12 + 4] = color[0];
        colors[lastIndex * 12 + 5] = color[1];
        colors[lastIndex * 12 + 6] = color[2];
        colors[lastIndex * 12 + 7] = color[3];

        vertices[lastIndex * 9 + 6] = cx;
        vertices[lastIndex * 9 + 7] = cy;
        vertices[lastIndex * 9 + 8] = cz;

        normals[lastIndex * 9 + 6] = nx;
        normals[lastIndex * 9 + 7] = ny;
        normals[lastIndex * 9 + 8] = nz;

        colors[lastIndex * 12 + 8] = color[0];
        colors[lastIndex * 12 + 9] = color[1];
        colors[lastIndex * 12 + 10] = color[2];
        colors[lastIndex * 12 + 11] = color[3];

        pickingIds[lastIndex * 3 + 0] = _pickingId;
        pickingIds[lastIndex * 3 + 1] = _pickingId;
        pickingIds[lastIndex * 3 + 2] = _pickingId;

        lastIndex++;
      }
    });

    const attributes = {
      vertices,
      normals,
      colors,
      pickingIds,
      faceUv: new Float32Array(polygon.faceUv),
      sizes: new Float32Array(polygon.sizes)

    };

    return attributes;
  }
  _toPointShapeAttributes(polygon) {
    // Three components per vertex per face (3 x 3 = 9)
    const { style, indices, position, indexCount, shapes, sizes } = polygon;
    const vertices = new Float32Array(indexCount * 3);
    const shapePositions = new Float32Array(indexCount * 3);
    const a_size = new Float32Array(indexCount * 3);
    const normals = new Float32Array(indexCount * 3);
    const colors = new Float32Array(indexCount * 4);
    const pickingIds = new Float32Array(indexCount);
    const pA = new Vector3();
    const pB = new Vector3();
    const pC = new Vector3();

    const cb = new Vector3();
    const ab = new Vector3();
    let lastIndex = 0;
    indices.forEach((indice, pIndex) => {
      for (let i = 0; i < indice.length / 3; i++) {
        let index = indice[i * 3];
        const color = style[pIndex].color;
        const coor1 = position[pIndex];
        const size = sizes[pIndex];
        const _pickingId = style[pIndex].id;
        const ax = shapes[pIndex][index][0];
        const ay = shapes[pIndex][index][1];
        const az = shapes[pIndex][index][2];
        index = indice[i * 3 + 1];
        const bx = shapes[pIndex][index][0];
        const by = shapes[pIndex][index][1];
        const bz = shapes[pIndex][index][2];
        index = indice[i * 3 + 2];
        const cx = shapes[pIndex][index][0];
        const cy = shapes[pIndex][index][1];
        const cz = shapes[pIndex][index][2];

        pA.set(ax, ay, az);
        pB.set(bx, by, bz);
        pC.set(cx, cy, cz);

        cb.subVectors(pC, pB);
        ab.subVectors(pA, pB);
        cb.cross(ab);

        cb.normalize();

        const nx = cb.x;
        const ny = cb.y;
        const nz = cb.z;

        vertices[lastIndex * 9 + 0] = coor1[0];
        vertices[lastIndex * 9 + 1] = coor1[1];
        vertices[lastIndex * 9 + 2] = coor1[2];

        shapePositions[lastIndex * 9 + 0] = ax;
        shapePositions[lastIndex * 9 + 1] = ay;
        shapePositions[lastIndex * 9 + 2] = az;

        a_size[lastIndex * 9 + 0] = size[0];
        a_size[lastIndex * 9 + 1] = size[1];
        a_size[lastIndex * 9 + 2] = size[2];

        normals[lastIndex * 9 + 0] = nx;
        normals[lastIndex * 9 + 1] = ny;
        normals[lastIndex * 9 + 2] = nz;

        colors[lastIndex * 12 + 0] = color[0];
        colors[lastIndex * 12 + 1] = color[1];
        colors[lastIndex * 12 + 2] = color[2];
        colors[lastIndex * 12 + 3] = color[3];


        vertices[lastIndex * 9 + 3] = coor1[0];
        vertices[lastIndex * 9 + 4] = coor1[1];
        vertices[lastIndex * 9 + 5] = coor1[2];

        shapePositions[lastIndex * 9 + 3] = bx;
        shapePositions[lastIndex * 9 + 4] = by;
        shapePositions[lastIndex * 9 + 5] = bz;

        a_size[lastIndex * 9 + 3] = size[0];
        a_size[lastIndex * 9 + 4] = size[1];
        a_size[lastIndex * 9 + 5] = size[2];

        normals[lastIndex * 9 + 3] = nx;
        normals[lastIndex * 9 + 4] = ny;
        normals[lastIndex * 9 + 5] = nz;

        colors[lastIndex * 12 + 4] = color[0];
        colors[lastIndex * 12 + 5] = color[1];
        colors[lastIndex * 12 + 6] = color[2];
        colors[lastIndex * 12 + 7] = color[3];

        vertices[lastIndex * 9 + 6] = coor1[0];
        vertices[lastIndex * 9 + 7] = coor1[1];
        vertices[lastIndex * 9 + 8] = coor1[2];


        a_size[lastIndex * 9 + 6] = size[0];
        a_size[lastIndex * 9 + 7] = size[1];
        a_size[lastIndex * 9 + 8] = size[2];

        shapePositions[lastIndex * 9 + 6] = cx;
        shapePositions[lastIndex * 9 + 7] = cy;
        shapePositions[lastIndex * 9 + 8] = cz;

        normals[lastIndex * 9 + 6] = nx;
        normals[lastIndex * 9 + 7] = ny;
        normals[lastIndex * 9 + 8] = nz;

        colors[lastIndex * 12 + 8] = color[0];
        colors[lastIndex * 12 + 9] = color[1];
        colors[lastIndex * 12 + 10] = color[2];
        colors[lastIndex * 12 + 11] = color[3];

        pickingIds[lastIndex * 3 + 0] = _pickingId;
        pickingIds[lastIndex * 3 + 1] = _pickingId;
        pickingIds[lastIndex * 3 + 2] = _pickingId;

        lastIndex++;
      }
    });

    const attributes = {
      vertices,
      normals,
      colors,
      pickingIds,
      shapePositions,
      a_size,
      faceUv: new Float32Array(polygon.faceUv)

    };

    return attributes;
  }
  _toPolygonLineAttributes(polygonline) {
    const { style, indices, position, indexCount } = polygonline;
    const vertices = new Float32Array(indexCount * 3);
    const colors = new Float32Array(indexCount * 4);
    const pickingIds = new Float32Array(indexCount);
    let lastIndex = 0;
    indices.forEach((indice, pIndex) => {
      for (let i = 0; i < indice.length; i++) {
        const index = indice[i];
        const color = style[pIndex].color;
        const _pickingId = style[pIndex].id;
        vertices[lastIndex * 3] = position[pIndex][index][0];
        vertices[lastIndex * 3 + 1] = position[pIndex][index][1];
        vertices[lastIndex * 3 + 2] = position[pIndex][index][2];
        colors[lastIndex * 4] = color[0];
        colors[lastIndex * 4 + 1] = color[1];
        colors[lastIndex * 4 + 2] = color[2];
        colors[lastIndex * 4 + 3] = color[3];
        pickingIds[lastIndex] = _pickingId;
        lastIndex++;
      }
    });
    const attributes = {
      vertices,
      colors,
      pickingIds
    };

    return attributes;
  }

  _toPointsAttributes(point) {
    const { style, position } = point;
    const count = position.length;
    const vertices = new Float32Array(count * 3);
    const colors = new Float32Array(count * 4);
    const sizes = new Float32Array(count);
    const shapes = new Float32Array(count);
    const pickingIds = new Float32Array(count);
    position.forEach((pos, index) => {
      vertices[index * 3] = pos[0];
      vertices[index * 3 + 1] = pos[1];
      vertices[index * 3 + 2] = pos[2];
      colors[index * 4] = style[index].color[0];
      colors[index * 4 + 1] = style[index].color[1];
      colors[index * 4 + 2] = style[index].color[2];
      colors[index * 4 + 3] = style[index].color[3];
      pickingIds[index] = style[index].id;
      sizes[index] = style[index].size * window.devicePixelRatio;
      if (style[index].shape) { shapes[index] = style[index].shape; }
    });
    const attributes = {
      vertices,
      colors,
      sizes,
      shapes,
      pickingIds

    };
    return attributes;
  }
  _generateTexture() {
    // build a small canvas 32x64 and paint it in white
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    // plain it in white
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 32, 64);
    // draw the window rows - with a small noise to simulate light variations in each room
    for (let y = 8; y < 64; y += 8) {
      for (let x = 0; x < 32; x += 2) {
        const value = Math.floor(Math.random() * 64);
        context.fillStyle = 'rgb(' + [ value, value, value ].join(',') + ')';
        context.fillRect(x, y, 2, 4);
      }
    }
    context.fillStyle = '#105CB3';
    context.fillRect(0, 60, 32, 64);
    // build a bigger canvas and copy the small one in it
    // This is a trick to upscale the texture without filtering
    const canvas2 = document.createElement('canvas');
    canvas2.width = 512;
    canvas2.height = 1024;
    const context2 = canvas2.getContext('2d');
    // disable smoothing
    context2.imageSmoothingEnabled = false;
    context2.webkitImageSmoothingEnabled = false;
    context2.mozImageSmoothingEnabled = false;
    // then draw the image
    context2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);
    // return the just built canvas2
    const texture = new Texture(canvas2);
    // texture.anisotropy = renderer.getMaxAnisotropy();
    texture.needsUpdate = true;

    return texture;
  }
}
