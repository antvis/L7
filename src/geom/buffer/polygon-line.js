import { polygonShape } from '../shape/index';
import BufferBase from './bufferBase';
export default class polygonLineBuffer extends BufferBase {

  geometryBuffer() {
    const coordinates = this.get('coordinates');
    const properties = this.get('properties');
    const shape = this.get('shape');
    const positions = [];
    const positionsIndex = [];
    let vertsCount = 0;
    this.bufferStruct.style = properties;
    const isExtrude = properties[0].hasOwnProperty('size');
    coordinates.forEach((geo, index) => {
      const heightValue = properties[index].size;
      let extrudeData = [];
      if (isExtrude && shape === 'extrudeline') {
        extrudeData = polygonShape.extrudeline(geo);
        extrudeData.positions = extrudeData.positions.map(pos => {
          pos[2] *= heightValue;
          return pos;
        });
      } else {
        extrudeData = polygonShape.line(geo);
      }
      positions.push(extrudeData.positions);
      positionsIndex.push(...extrudeData.positionsIndex.map(index => { return index + vertsCount; }));

      vertsCount += extrudeData.positions.length;
    });
    this.bufferStruct.indexs = positionsIndex;
    this.bufferStruct.verts = positions;
    this.bufferStruct.vertsCount = vertsCount;
  }
}
