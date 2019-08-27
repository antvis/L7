import rbush from 'rbush';
import turfBox from '@turf/bbox';
export default class FeatureIndex {
  constructor(data) {
    this.tree = new rbush();
    this.rawData = data;
    data.features.forEach(feature => {
      this.insert(feature);
    });
  }
  insert(feature) {
    const bbox = this.toBBox(feature);
    bbox.feature = feature;
    this.tree.insert(bbox);
  }
  search(feature) {
    return this.tree.search(this.toBBox(feature));
  }
  clear() {
    this.tree.clear();
  }
  all() {
    return this.tree.all();
  }
  toBBox(feature) {
    const bbox = feature.type === 'Point' ? this.pointBBox(feature) : turfBox(feature);
    return {
      minX: bbox[0],
      minY: bbox[1],
      maxX: bbox[2],
      maxY: bbox[3]
    };
  }
  pointBBox(feature) {
    const size = 1 / 1000 / 1000; //  1m
    const [ x, y ] = feature.geometry.coordinates;
    return [ x - size, y - size, x + size, y + size ];

  }
}
