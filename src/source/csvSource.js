import Source from '../core/source';
import FeatureIndex from '../geo/featureIndex';
import { csvParse } from 'd3-dsv';
export default class CSVSource extends Source {
  prepareData() {
    this.type = 'csv';
    const data = this.get('data');
    const x = this.get('x');
    const y = this.get('y');
    const x1 = this.get('x1');
    const y1 = this.get('y1');
    const coords = this.get('coordinates');
    this.propertiesData = [];// 临时使用
    this.geoData = [];
    let csvdata = data;
    Array.isArray(csvdata) || (csvdata = csvParse(data));
    this.propertiesData = csvdata;
    csvdata.forEach((col, featureIndex) => {
      let coordinates = [];
      if (col.coordinates) {
        coordinates = col.coordinates;
      }
      if (x && y) { coordinates = [ col[x], col[y] ]; } // 点数据
      if (x1 && y1) { // 弧线 或者线段
        coordinates = [[ col[x], col[y] ], [ col[x1], col[y1] ]];
      }
      if (coords && col.coords) { coordinates = col.coords; }
      col._id = featureIndex + 1;
      this._coordProject(coordinates);
      this.geoData.push(this._coordProject(coordinates));
    });
  }

  featureIndex() {
    const data = this.get('data');
    this.featureIndex = new FeatureIndex(data);
  }
  getSelectFeatureId(featureId) {
    return [ featureId ];
  }
  getSelectFeature(featureId) {
    return this.propertiesData[featureId];

  }
  _getCoord(geo) {
    if (geo.geometry) {
      // GeoJSON feature
      geo = geo.geometry.coordinates;
    } else if (geo.coordinates) {
      // GeoJSON geometry
      geo = geo.coordinates;
    }
    return geo;
  }
  _coordProject(geo) {
    if (Array.isArray(geo[0][0])) {
      return geo.map(coor => {
        return this._coordProject(coor);
      });
    }
    if (!Array.isArray(geo[0])) {
      return this._coorConvert(geo);
    }
    return geo.map(coor => {
      return this._coorConvert(coor);
    });
  }

}
