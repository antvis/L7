import PBF from 'pbf';
import * as VectorParser from '@mapbox/vector-tile';
import geojson from './geojson';
export default function mvt(data, cfg) {
  const tile = new VectorParser.VectorTile(new PBF(data));
  // CHN_Cities_L   CHN_Cities   CHN_L
  const layerName = cfg.sourceLayer;
  const features = [];
  const vectorLayer = tile.layers[layerName];
  for (let i = 0; i < vectorLayer.length; i++) {
    const feature = vectorLayer.feature(i);
    features.push(feature.toGeoJSON(cfg.tile[0], cfg.tile[1], cfg.tile[2]));
  }
  const geodata = {
    type: 'FeatureCollection',
    features
  };
  return geojson(geodata, cfg);
}
