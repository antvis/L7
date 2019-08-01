import { djb2hash } from '../../util/bkdr-hash';
const Extent = 4096;
export default function vector(data, cfg) {
  const tile = cfg.tile;
  const resultdata = [];
  const featureKeys = {};
  const x0 = Extent * tile[0];
  const y0 = Extent * tile[1];
  function covertP20(points) {
    return points.map(point => {
      const x1 = (x0 + point.x << 20 - tile[2] - 4) - 215440491;
      const y2 = (y0 + point.y << 20 - tile[2] - 4) - 106744817;
      return [ x1, -y2, 0 ];
    });
  }
  let index = 0;
  for (let i = 0; i < data.length; i++) {
    const feature = data.feature(i);
    const coords = feature.loadGeometry();
    const properties = feature.properties;
    let id = i + 1;
    if (cfg.idField && properties[cfg.idField]) {
      const value = properties[cfg.idField];
      id = djb2hash(value) % 1000019;
      featureKeys[id] = {
        index,
        idField: value
      };
    }
    const geocoords = classifyRings(coords);
    for (let j = 0; j < geocoords.length; j++) {
      const geo = geocoords[j].map(coord => {
        return covertP20(coord);
      });
      index++;
      resultdata.push({
        ...properties,
        _id: feature.id || id,
        coordinates: geo
      });
    }

  }
  return {
    dataArray: resultdata,
    featureKeys
  };

}
function signedArea(ring) {
  let sum = 0;
  for (let i = 0, len = ring.length, j = len - 1, p1, p2; i < len; j = i++) {
    p1 = ring[i];
    p2 = ring[j];
    sum += (p2.x - p1.x) * (p1.y + p2.y);
  }
  return sum;
}
function classifyRings(rings) {
  const len = rings.length;
  if (len <= 1) return [ rings ];
  const polygons = [];
  let polygon;
  let ccw;

  for (let i = 0; i < len; i++) {
    const area = signedArea(rings[i]);
    if (area === 0) continue;

    if (ccw === undefined) ccw = area < 0;

    if (ccw === area < 0) {
      if (polygon) polygons.push(polygon);
      polygon = [ rings[i] ];

    } else {
      polygon.push(rings[i]);
    }
  }
  if (polygon) polygons.push(polygon);

  return polygons;
}
