import BufferBase from './bufferBase';
import { regularShape } from '../shape/index';
import Util from '../../util';
import * as THREE from '../../core/three';
const shapeObj = {
  circle: 30,
  square: 4,
  triangle: 3,
  hexagon: 6
};

export default class PointBuffer extends BufferBase {

  geometryBuffer() {
    const type = this.get('type');
    switch (type) {
      case 'image' : this._imageBuffer();
        break;
      case '2d': this._3dRegularBuffer();
        break;
      case '3d': this._3dRegularBuffer();
        break;
      case 'Model':this._ModelBuffer();
        break;
      default:
        this._2dRegularBuffer();

    }
  }
  _imageBuffer() {
    const coordinates = this.get('coordinates');
    const properties = this.get('properties');
    const imagePos = this.get('imagePos');
    const uv = new Float32Array(properties.length * 2);

    for (let i = 0; i < properties.length; i++) {
      const { x, y } = imagePos[properties[i].shape];
      uv[i * 2] = x;
      uv[i * 2 + 1] = y;

    }
    this.bufferStruct.position = coordinates;
    this.bufferStruct.uv = uv;
    this.bufferStruct.style = properties;
    this.attributes = this._toPointsAttributes(this.bufferStruct);
    this.attributes.uvs = uv;
  }
  _2dRegularBuffer() {
    const coordinates = this.get('coordinates');
    const properties = this.get('properties');

    const shapes = [];
    for (let i = 0; i < properties.length; i++) {
      const shape = shapeObj[properties[i].shape];
      properties[i].shape = shape;
    }
    this.bufferStruct.position = coordinates;
    properties.shapes = shapes;
    this.bufferStruct.style = properties;
    this.attributes = this._toPointsAttributes(this.bufferStruct);
  }
  _3dRegularBuffer() {
    const coordinates = this.get('coordinates');
    const properties = this.get('properties');
    const type = this.get('type');
    const positions = [];
    const positionsIndex = [];
    let indexCount = 0;
    this.bufferStruct.style = properties;
    coordinates.forEach((geo, index) => {
      const m1 = new THREE.Matrix4();
      let { size, shape } = properties[index];
      let shapeType = 'extrude';
      if (type === '2d' || (type === '3d' && size[2] === 0)) {
        shapeType = 'fill';
        Util.isArray(size) || (size = [ size, size, 0 ]);
        geo[2] += Math.random() * 100;
      }
      const vert = regularShape[shape](shapeType);
      m1.setPosition(new THREE.Vector3(...geo));
      m1.scale(new THREE.Vector3(...size));
      vert.positions = vert.positions.map(coor => {
        const vector = new THREE.Vector4(...coor, 1);
        vector.applyMatrix4(m1);
        return vector.toArray();
      });// 旋转矩阵
      positions.push(vert.positions);

      positionsIndex.push(vert.positionsIndex);
      indexCount += vert.positionsIndex.length;
    });
    this.bufferStruct.indices = positionsIndex;
    this.bufferStruct.position = positions;
    this.bufferStruct.indexCount = indexCount;
    this.attributes = this._toPolygonAttributes(this.bufferStruct);

  }
  _ModelBuffer() {

  }
  _textBuffer() {

  }


}
