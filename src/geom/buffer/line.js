import BufferBase from './bufferBase';
import { lineShape } from '../shape';

export default class LineBuffer extends BufferBase {
  geometryBuffer() {
    const shapeType = this.shapeType = this.get('shapeType');
    if (shapeType === 'line') {
      this.attributes = this._getMeshLineAttributes();
      return;
    } else if (shapeType === 'arc') {
      this.attributes = this._getArcLineAttributes();
      return;
    }
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
    const layerData = this.get('layerData');
    const positions = [];
    const colors = [];
    const indexArray = [];
    const sizes = [];
    const instances = [];
    const pickingIds = [];
    layerData.forEach(item => {
      const props = item;
      const positionCount = positions.length / 3;
      const attrData = this._getShape(item.coordinates, props, positionCount);
      positions.push(...attrData.positions);
      colors.push(...attrData.colors);
      indexArray.push(...attrData.indexArray);
      instances.push(...attrData.instances);
      sizes.push(...attrData.sizes);
      pickingIds.push(...attrData.pickingIds);
    });
    return {
      pickingIds,
      positions,
      colors,
      indexArray,
      sizes,
      instances
    };
  }
  _getMeshLineAttributes() {
    const layerData = this.get('layerData');
    const { dashArray } = this.get('style');
    const imagePos = this.get('imagePos');
    const positions = [];
    const pickingIds = [];
    const normal = [];
    const miter = [];
    const colors = [];
    const indexArray = [];
    const sizes = [];
    const attrDistance = [];
    const attrDashArray = [];
    const textureCoord = [];
    const totalDistance = [];
    layerData.forEach(item => {
      const props = item;
      const positionCount = positions.length / 3;
      let patternPos = { x: 0, y: 0 };
      if (item.pattern && imagePos[item.pattern]) {
        patternPos = imagePos[item.pattern];
      }
      const attr = lineShape.Line(item.coordinates, props, positionCount, dashArray, patternPos);
      positions.push(...attr.positions);
      normal.push(...attr.normal);
      miter.push(...attr.miter);
      colors.push(...attr.colors);
      indexArray.push(...attr.indexArray);
      sizes.push(...attr.sizes);
      attrDistance.push(...attr.attrDistance);
      pickingIds.push(...attr.pickingIds);
      attrDashArray.push(...attr.dashArray);
      textureCoord.push(...attr.textureCoordArray);
      totalDistance.push(...attr.totalDistances);
    });
    return {
      positions,
      normal,
      miter,
      colors,
      indexArray,
      pickingIds,
      sizes,
      attrDistance,
      attrDashArray,
      textureCoord,
      totalDistance
    };
  }
}
