import Source from '../core/source';
import * as turfMeta from '@turf/meta';
import { default as cleanCoords } from '@turf/clean-coords';
import { getCoords } from '@turf/invariant';
import FeatureIndex from '../geo/featureIndex';

export default class GeojsonSource extends Source {
  prepareData() {
    this.type = 'geojson';
    const data = this.get('data');
    this.propertiesData = [];
    this.geoData = [];
    turfMeta.flattenEach(data, (currentFeature, featureIndex) => {
      const coord = getCoords(cleanCoords(currentFeature));
      this.geoData.push(this._coordProject(coord));
      currentFeature.properties._id = featureIndex + 1;
      this.propertiesData.push(currentFeature.properties);
    });
  }
  featureIndex() {
    const data = this.get('data');
    this.featureIndex = new FeatureIndex(data);
  }
  getSelectFeatureId(featureId) {
    const data = this.get('data');
    const selectFeatureIds = [];
    let featureStyleId = 0;
     /* eslint-disable */
    turfMeta.flattenEach(data, (currentFeature, featureIndex, multiFeatureIndex) => {
      /* eslint-disable */
        if (featureIndex === (featureId)) {
          selectFeatureIds.push(featureStyleId);
        }
        featureStyleId++;
        if (featureIndex > featureId) {
          return;
        }
      });
    return selectFeatureIds;
    
  }
  getSelectFeature(featureId){
    const data = this.get('data');
    return  data.features[featureId];
  }

}
