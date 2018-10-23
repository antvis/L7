import BufferBase from './bufferBase';
import { lineShape } from '../shape';

export default class LineBuffer extends BufferBase {
  geometryBuffer() {
    const self = this;
    const coordinates = self.get('coordinates');
    const properties = self.get('properties');
    const propertiesData = self.get('propertiesData');
    const positions = [];
    const positionsIndex = [];
    const instances = [];
    coordinates.forEach((geo, index) => {
      const props = properties[index];
      const attrData = self._getShape(geo, props, index);
      positions.push(...attrData.positions);
      positionsIndex.push(...attrData.indexes);
      if (attrData.hasOwnProperty('instances')) {
        instances.push(...attrData.instances);
      }
    });
    self.bufferStruct.style = properties;
    self.bufferStruct.verts = positions;
    self.bufferStruct.indexs = positionsIndex;
    self.shape = properties[0].shape || 'default';
    if (instances.length > 0) {
      self.bufferStruct.instances = instances;
    }
    self.attributes = this._toAttributes(self.bufferStruct, propertiesData);
  }

  _getShape(geo, props, index) {
    if (!props.hasOwnProperty('shape')) {
      return lineShape.defaultLine(geo, index);
    }
    const shape = props.shape;
    if (shape === 'meshLine') {
      return lineShape[shape](geo, props, index);
    } else if (shape === 'tubeLine') {
      return lineShape[shape](geo, props, index);
    } else if (shape === 'arc') {
      return lineShape[shape](geo, index);
    }
  }
  _toAttributes(bufferStruct, propertiesData) {
    const vertCount = bufferStruct.verts.length;
    const vertices = new Float32Array(vertCount * 3);
    const inposs = new Float32Array(vertCount * 4);
    const colors = new Float32Array(vertCount * 4);
    const times = new Float32Array(vertCount);
    for (let i = 0; i < vertCount; i++) {
      const index = bufferStruct.indexs[i];
      const color = bufferStruct.style[index].color;
      vertices[i * 3] = bufferStruct.verts[i][0];
      vertices[i * 3 + 1] = bufferStruct.verts[i][1];
      vertices[i * 3 + 2] = bufferStruct.verts[i][2];
      colors[i * 4] = color[0];
      colors[i * 4 + 1] = color[1];
      colors[i * 4 + 2] = color[2];
      colors[i * 4 + 3] = color[3];
      if (bufferStruct.instances) {
        inposs[i * 4] = bufferStruct.instances[i][0];
        inposs[i * 4 + 1] = bufferStruct.instances[i][1];
        inposs[i * 4 + 2] = bufferStruct.instances[i][2];
        inposs[i * 4 + 3] = bufferStruct.instances[i][3];
      }
      if (propertiesData) {
        const time = propertiesData[index].time;
        times[i] = time;
      }
    }
    return {
      vertices,
      colors,
      inposs,
      times
    };
  }
}
