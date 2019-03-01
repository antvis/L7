import { polygonShape } from '../shape';
import BufferBase from './bufferBase';
export default class PolygonBuffer extends BufferBase {

  geometryBuffer() {
    const layerData = this.get('layerData');
    const shape = this.get('shape');
    const positions = [];
    const faceUv = [];
    const sizes = [];
    const positionsIndex = [];
    let indexCount = 0;
    this.bufferStruct.style = layerData;
    const isExtrude = layerData[0].hasOwnProperty('size');
    // indices, normals, colors, UVs
    layerData.forEach(item => {
      const heightValue = item.size;
      let extrudeData = polygonShape[shape](item.coordinates);
      if (isExtrude && shape === 'extrude') {
        extrudeData = polygonShape.extrude(item.coordinates);
        extrudeData.positions = extrudeData.positions.map(pos => {
          pos[2] *= heightValue;
          return pos;
        });
      }
      positions.push(extrudeData.positions);

      if (shape !== 'line') {
        // faceUv.push(...extrudeData.faceUv);
        const count = extrudeData.faceUv.length / 2;
        for (let i = 0; i < count; i++) {
          // uv 系数生成等大小的窗户
          let x = extrudeData.faceUv[i * 2];
          let y = extrudeData.faceUv[i * 2 + 1];
          if (x !== -1) {
            x = x * 0.1;
            y = y * heightValue / 2000;
          }
          faceUv.push(x, y);
          sizes.push((1.0 - extrudeData.faceUv[i * 2 + 1]) * heightValue);
        }

      }
      indexCount += extrudeData.positionsIndex.length;
      positionsIndex.push(extrudeData.positionsIndex);
    });
    this.bufferStruct.indices = positionsIndex;
    this.bufferStruct.position = positions;
    this.bufferStruct.indexCount = indexCount;
    this.bufferStruct.style = layerData;
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
