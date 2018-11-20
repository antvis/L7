import BufferBase from './bufferBase';
import { lineShape } from '../shape';

export default class LineBuffer extends BufferBase {
  geometryBuffer() {
    const coordinates = this.get('coordinates');
    const properties = this.get('properties');
    const shapeType = this.shapeType = this.get('shapeType');
    const positions = [];
    const positionsIndex = [];
    const instances = [];
    if (shapeType === 'line') {
      this.attributes = this._getMeshLineAttributes();
      return;
    } else if (shapeType === 'arc') {
      this.attributes = this._getArcLineAttributes();
      return;
    }
    coordinates.forEach((geo, index) => {
      const props = properties[index];
      const attrData = this._getShape(geo, props, index);
      positions.push(...attrData.positions);
      positionsIndex.push(...attrData.indexes);
      if (attrData.hasOwnProperty('instances')) {
        instances.push(...attrData.instances);
      }
    });
    this.bufferStruct.style = properties;
    this.bufferStruct.verts = positions;
    this.bufferStruct.indexs = positionsIndex;
    if (instances.length > 0) {
      this.bufferStruct.instances = instances;
    }
    this.attributes = this._toAttributes(this.bufferStruct);
  }

  _getShape(geo, props, index) {
    if (!this.shapeType) {
      return lineShape.defaultLine(geo, index);
    }
    const shape = this.shapeType;
    if (shape === 'meshLine') {
      return lineShape[shape](geo, props, index);
    } else if (shape === 'tubeLine') {
      return lineShape[shape](geo, props, index);
    } else if (shape === 'arc') {
      return lineShape[shape](geo, props, index);
    }
    return lineShape.Line(geo, props, index);

  }
  _getArcLineAttributes() {
    const coordinates = this.get('coordinates');
    const properties = this.get('properties');
    const positions = [];
    const colors = [];
    const indexArray = [];
    const sizes = [];
    const instances = [];
    coordinates.forEach((geo, index) => {
      const props = properties[index];
      const positionCount = positions.length / 3;
      const attrData = this._getShape(geo, props, positionCount);
      positions.push(...attrData.positions);
      colors.push(...attrData.colors);
      indexArray.push(...attrData.indexArray);
      instances.push(...attrData.instances);
      sizes.push(...attrData.sizes);
    });
    return {
      positions,
      colors,
      indexArray,
      sizes,
      instances
    };
  }
  _getMeshLineAttributes() {
    const coordinates = this.get('coordinates');
    const properties = this.get('properties');
    const { lineType } = this.get('style');
    const positions = [];
    const pickingIds = [];
    const normal = [];
    const miter = [];
    const colors = [];
    const indexArray = [];
    const sizes = [];
    const attrDistance = [];
    coordinates.forEach((geo, index) => {
      const props = properties[index];
      const positionCount = positions.length / 3;
      const attr = lineShape.Line(geo, props, positionCount, (lineType !== 'soild'));
      positions.push(...attr.positions);
      normal.push(...attr.normal);
      miter.push(...attr.miter);
      colors.push(...attr.colors);
      indexArray.push(...attr.indexArray);
      sizes.push(...attr.sizes);
      attrDistance.push(...attr.attrDistance);
      pickingIds.push(...attr.pickingIds);
    });
    return {
      positions,
      normal,
      miter,
      colors,
      indexArray,
      pickingIds,
      sizes,
      attrDistance
    };
  }

  _toAttributes(bufferStruct) {
    const vertCount = bufferStruct.verts.length;
    const vertices = new Float32Array(vertCount * 3);
    const inposs = new Float32Array(vertCount * 4);
    const colors = new Float32Array(vertCount * 4);
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
      if (bufferStruct.instances) { // 弧线
        inposs[i * 4] = bufferStruct.instances[i][0];
        inposs[i * 4 + 1] = bufferStruct.instances[i][1];
        inposs[i * 4 + 2] = bufferStruct.instances[i][2];
        inposs[i * 4 + 3] = bufferStruct.instances[i][3];
      }

    }
    return {
      vertices,
      colors,
      inposs
    };
  }
}
