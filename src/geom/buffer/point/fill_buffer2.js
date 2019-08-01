import BufferBase from '../buffer';
import Global from '../../../global';
import { fillPolygon, extrude_Polygon } from '../../extrude';
import { polygonPath } from '../../shape/path';
import * as shapePath from '../../shape/path';
const { pointShape } = Global;
export default class PointFillBuffer extends BufferBase {

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
    this.attributes.miters = new Float32Array(this.verticesCount * 2);
    this.attributes.sizes = new Float32Array(this.verticesCount);
    this.attributes.shapes = new Float32Array(this.verticesCount);
  }
  _calculateFeatures() {
    const layerData = this.get('layerData');
    this.verticesCount = layerData.length * 4;
    this.indexCount = layerData.length * 6;
  }
  _calcultateGeometry() {
    const shape = this.get('shapeType');
    const hexgonFill = this.getShapeFunction(shape)([ this._getPoints(6) ]);
    this.instanceGeometry = hexgonFill;
  }
  _calculateFill(feature) {

    feature.bufferInfo = { verticesOffset: this._offset };
    const { coordinates, shape } = feature;
    const shapeIndex = pointShape['2d'].indexOf(shape) || 0;
    let newCoord = coordinates;
    if (coordinates.length === 1) {
      newCoord = coordinates[0][0];
    }
    feature.bufferInfo = {
      verticesOffset: this._offset
    };
    this._encodeArray(feature, 4);
    this.attributes.shapes.set([ shapeIndex, shapeIndex, shapeIndex, shapeIndex ], this._offset);
    this.attributes.miters.set([ -1, -1, 1, -1, 1, 1, -1, 1 ], this._offset * 2);
    const indexArray = [ 0, 1, 2, 0, 2, 3 ].map(n => n + this._offset);
    this.indexArray.set(indexArray, this._offset * 1.5);

    const position = [];
    for (let i = 0; i < 4; i++) {
      position.push(...newCoord);
    }
    this.attributes.positions.set(position, this._offset * 3);
    this._offset += 4;
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
