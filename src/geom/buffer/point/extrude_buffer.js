/**
 * bufferGeometry的顶点组装方式
 */
import BufferBase from '../buffer';
import Global from '../../../global';
import { fillPolygon, extrude_Polygon } from '../../extrude';
import { polygonPath } from '../../shape/path';
import * as shapePath from '../../shape/path';
export default class ExtrudeBuffer extends BufferBase {

  _buildFeatures() {
    const layerData = this.get('layerData');
    this._offset = 0;
    this._indexOffset = 0;

    layerData.forEach(feature => {
      this._calculateFill(feature);
    });
  }
  _initAttributes() {
    super._initAttributes();
    this.attributes.miters = new Float32Array(this.verticesCount * 3);
    this.attributes.normals = new Float32Array(this.verticesCount * 3);
    this.attributes.sizes = new Float32Array(this.verticesCount * 3);
  }
  _calculateFeatures() {
    const layerData = this.get('layerData');
    this.geometryMap = {};
    layerData.forEach(feature => {
      const { shape } = feature;
      const { positions, indexArray } = this.getShape(shape);
      this.verticesCount += positions.length / 3;
      this.indexCount += indexArray.length;
    });
  }
  _calcultateGeometry() {
    const shape = this.get('shapeType');
    const hexgonFill = this.getShapeFunction(shape)([ this._getPoints(6) ]);
    this.instanceGeometry = hexgonFill;
  }
  _calculateFill(feature) {

    feature.bufferInfo = { verticesOffset: this._offset };
    const { coordinates, shape } = feature;
    const instanceGeometry = this.getShape(shape);
    const numPoint = instanceGeometry.positions.length / 3;
    this._encodeArray(feature, numPoint);
    this.attributes.miters.set(instanceGeometry.positions, this._offset * 3);
    const indexArray = instanceGeometry.indexArray.map(v => { return v + this._offset; });
    this.indexArray.set(indexArray, this._indexOffset);
    if (instanceGeometry.normals) {
      this.attributes.normals.set(instanceGeometry.normals, this._offset * 3);
    }
    const position = [];
    for (let i = 0; i < numPoint; i++) {
      position.push(...coordinates);
    }
    this.attributes.positions.set(position, this._offset * 3);
    this._offset += numPoint;
    this._indexOffset += indexArray.length;
  }
  _getPoints(num) {
    return polygonPath(num, 1);
  }
  getShape(shape) {
    const { pointShape } = Global;

    if (this.geometryMap[shape]) {
      return this.geometryMap[shape];
    }
    let geometry = null;
    if (pointShape['3d'].indexOf(shape) !== -1) {
      geometry = extrude_Polygon([ shapePath[shape]() ]);
    } else if (pointShape['2d'].indexOf(shape) !== -1) {
      geometry = fillPolygon([ shapePath[shape]() ]);
    } else {
      geometry = fillPolygon([ shapePath[shape]() ]);
    }
    this.geometryMap[shape] = geometry;
    return geometry;
  }
}
