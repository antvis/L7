import BufferBase from '../buffer';
import Global from '../../../global';
import { fillPolygon, extrude_Polygon } from '../../extrude';
import { polygonPath } from '../../shape/path';

export default class Shape_3D extends BufferBase {
  _buildFeatures() {
    const layerData = this.get('layerData');
    this._offset = 0;

    layerData.forEach(feature => {
      this._calculateFill(feature);
    });
  }
  _initAttributes() {
    super._initAttributes();
    this.attributes.miters = new Float32Array(this.verticesCount * 3);
    this.attributes.normals = new Float32Array(this.verticesCount * 3);
  }
  _calculateFeatures() {
    this._calcultateGeometry();
    const layerData = this.get('layerData');
    const { positions, indexArray } = this.instanceGeometry;
    const numFeature = layerData.length;
    this.verticesCount = positions.length * numFeature / 3;
    this.indexCount = indexArray.length * numFeature;
  }
  _calcultateGeometry() {
    const shape = this.get('shapeType');
    const hexgonFill = this.getShapeFunction(shape)([ this._getPoints(6) ]);
    this.instanceGeometry = hexgonFill;
  }
  _calculateFill(feature) {

    feature.bufferInfo = { verticesOffset: this._offset };
    const { coordinates } = feature;
    const numPoint = this.instanceGeometry.positions.length / 3;
    this._encodeArray(feature, numPoint);
    this.attributes.miters.set(this.instanceGeometry.positions, this._offset * 3);
    const indexArray = this.instanceGeometry.indexArray.map(v => { return v + this._offset; });
    this.indexArray.set(indexArray, this._offset);
    if (this.instanceGeometry.normals) {
      this.attributes.normals.set(this.instanceGeometry.normals, this._offset * 3);
    }
    const position = [];
    for (let i = 0; i < numPoint; i++) {
      position.push(...coordinates);
    }
    this.attributes.positions.set(position, this._offset * 3);
    this._offset += numPoint;
  }
  _getPoints(num) {
    return polygonPath(num, 1);
  }
  getShapeFunction(shape) {
    const { pointShape } = Global;
    if (pointShape['3d'].indexOf(shape) !== -1) return extrude_Polygon;
    return fillPolygon;

  }
}
