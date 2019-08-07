/**
 * instantcebufferGeometry的组装方式
 */
import BufferBase from '../buffer';
import { fillPolygon, extrude_Polygon } from '../../extrude';
import Global from '../../../global';
import * as shapePath from '../../shape/path';

export default class Hexagon3D extends BufferBase {
  _buildFeatures() {
    const layerData = this.get('layerData');
    this._offset = 0;

    layerData.forEach(feature => {
      this._calculateFill(feature);
    });
  }
  _calculateFeatures() {
    const shape = this.get('shapeType');
    const hexgonFill = this.getShape(shape);
    const layerData = this.get('layerData');
    this.verticesCount = layerData.length;
    this.indexCount = 0;
    this.instanceGeometry = hexgonFill;
  }
  _calculateFill(feature) {

    feature.bufferInfo = { verticesOffset: this._offset };
    const { coordinates } = feature;
    this._encodeArray(feature, 1);
    this.attributes.positions.set(coordinates, this._offset * 3);
    this._offset++;
  }
  getShape(shape) {
    const { pointShape } = Global;
    if (pointShape['3d'].indexOf(shape) !== -1) return extrude_Polygon([ shapePath[shape]() ]);
    if (pointShape['2d'].indexOf(shape) !== -1) return fillPolygon([ shapePath[shape]() ]);
    return fillPolygon([ shapePath[shape]() ]);
  }
}
