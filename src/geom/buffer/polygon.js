import { polygonShape } from '../shape';
import BufferBase from './bufferBase';
export default class PolygonBuffer extends BufferBase {

  geometryBuffer() {
    const coordinates = this.get('coordinates');
    const properties = this.get('properties');
    const shape = this.get('shape');
    const positions = [];
    const faceUv = [];
    const sizes = [];
    const positionsIndex = [];
    let indexCount = 0;
    this.bufferStruct.style = properties;
    const isExtrude = properties[0].hasOwnProperty('size');
    // indices, normals, colors, UVs
    coordinates.forEach((geo, index) => {
      const heightValue = properties[index].size;
      let extrudeData = polygonShape[shape](geo);
      if (isExtrude && shape === 'extrude') {
        extrudeData = polygonShape.extrude(geo);
        extrudeData.positions = extrudeData.positions.map(pos => {
          pos[2] *= heightValue;
          return pos;
        });
      }
      positions.push(extrudeData.positions);

      if (shape !== 'line') { 
       // faceUv.push(...extrudeData.faceUv);
        const count = extrudeData.faceUv.length /2;
        for(let i=0;i<count;i++){
          faceUv.push(extrudeData.faceUv[i*2]*0.1,extrudeData.faceUv[i*2+1] * heightValue/3000);
          sizes.push((1.0 - extrudeData.faceUv[i*2+1]) * heightValue)
        }

       }
      indexCount += extrudeData.positionsIndex.length;
      positionsIndex.push(extrudeData.positionsIndex);
    });
    this.bufferStruct.indices = positionsIndex;
    this.bufferStruct.position = positions;
    this.bufferStruct.indexCount = indexCount;
    this.bufferStruct.style = properties;
    this.bufferStruct.faceUv = faceUv;
    this.bufferStruct.sizes = sizes;
    if (shape !== 'line') {
      this.attributes = this._toPolygonAttributes(this.bufferStruct);
      this.faceTexture = this._generateTexture();
    } else {
      this.attributes = this._toPolygonLineAttributes(this.bufferStruct);


    }
  }


}
