import PBF from 'pbf';
import * as VectorParser from '@mapbox/vector-tile';
import geojson from './geojson';
export default function mvt(data, cfg) {
  const tile = new VectorParser.VectorTile(new PBF(data));
  // CHN_Cities_L   CHN_Cities   CHN_L
  const layerName = cfg.sourceLayer;
  const features = [];
  const vectorLayer = tile.layers[layerName];
  if (vectorLayer === undefined) {
    return null;
  }
  for (let i = 0; i < vectorLayer.length; i++) {
    const feature = vectorLayer.feature(i);
    const geofeature = feature.toGeoJSON(cfg.tile[0], cfg.tile[1], cfg.tile[2]);
    if (geofeature.geometry.type === 'Polygon' && geofeature.geometry.coordinates[0].length < 20) {
      continue;
    }
    // const newfc = {
    //   geometry: geofeature.geometry,
    //   type: 'Feature',
    //   properties: {
    //     total: geofeature.properties.total,
    //     province: geofeature.properties.province,
    //     bc_grade: geofeature.properties.bc_grade,
    //     code: geofeature.properties.code || geofeature.properties.adcode
    //   }

    // };
    features.push(geofeature);
  }
  // console.log(features);
  const geodata = {
    type: 'FeatureCollection',
    features
  };
  return features.length === 0 ? null : geojson(geodata, cfg);
}
