import BufferBase from '../buffer';
import { fill, extrude } from '../../shape/polygon';
import { fillPolygon, extrude_Polygon } from '../../extrude';
import { polygonPath } from '../../shape/path';
export default class Grid3D extends BufferBase {
  _buildFeatures() {
    const layerData = this.get('layerData');
    this._offset = 0;

    layerData.forEach(feature => {

    });
  }
  _initAttributes() {
    super._initAttributes();
    this.attributes.miters = new Float32Array(this.verticesCount * 3);
    this.attributes.normals = new Float32Array(this.verticesCount * 3);
  }
  _calculateFeatures() {
    const hexgonPoints = polygonPath(6);
    const hexgonFill = fillPolygon([ hexgonPoints ]);
    const layerData = this.get('layerData');
    this.verticesCount = hexgonFill.positions.length / 3 * layerData.length;
    this.indexCount = hexgonFill.indexArray * layerData.length;
    this.featureBuffer = hexgonFill;
  }
  _calculatefill(feature) {
    // this.
  }
  _getPoints(num) {
    return polygonPath(num);
  }
}
