import BufferBase from './bufferBase';
import { regularShape } from '../shape/index';
import Util from '../../util';
import * as THREE from '../../core/three';
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
        this._sdfRegularBuffer();

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
  _sdfRegularBuffer() {
    const coordinates = this.get('coordinates');
    const properties = this.get('properties');
    this.bufferStruct.position = coordinates;
    this.bufferStruct.style = properties;
    this.attributes = this._toPointsAttributes(this.bufferStruct);
  }
  _3dRegularBuffer() {
    const coordinates = this.get('coordinates');
    const properties = this.get('properties');
    const type = this.get('type');
    const positions = [];
    const shapes = [];
    const sizes =[];
    const uvs=[];
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
      } else{
         Util.isArray(size) || (size = [ size, size, size ]);
      }
      if(regularShape[shape]==null) {
        uvs.push(0,0,1,0,1,1,1,1,0,1,0,0)
        shape='square';
      }
      const vert = regularShape[shape](shapeType);
      shapes.push(vert.positions);
      positions.push(geo);
      sizes.push(size);
      positionsIndex.push(vert.positionsIndex);
      indexCount += vert.positionsIndex.length;
    });
    this.bufferStruct.indices = positionsIndex;
    this.bufferStruct.position = positions;
    this.bufferStruct.indexCount = indexCount;
    this.bufferStruct.shapes = shapes;
    this.bufferStruct.sizes = sizes;
    this.bufferStruct.faceUv = uvs;
    this.attributes = this._toPointShapeAttributes(this.bufferStruct);
  }

}
