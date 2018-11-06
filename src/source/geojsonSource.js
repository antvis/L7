import Source from '../core/source';
import * as turfMeta from '@turf/meta';
import { default as cleanCoords } from '@turf/clean-coords';
import { getCoords } from '@turf/invariant';
import FeatureIndex from '../geo/featureIndex';

export default class GeojsonSource extends Source {
  prepareData() {
    const data = this.get('data');
    this.propertiesData = [];
    this.geoData = [];
    turfMeta.flattenEach(data, (currentFeature, featureIndex) => {
      const coord = getCoords(cleanCoords(currentFeature));
      this.geoData.push(this._coordProject(coord));
      currentFeature.properties._id = featureIndex+1;
      this.propertiesData.push(currentFeature.properties);
    });
  }
  featureIndex() {
    const data = this.get('data');
    this.featureIndex = new FeatureIndex(data);
  }

}
