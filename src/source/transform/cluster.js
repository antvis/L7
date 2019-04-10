import Supercluster from 'supercluster/dist/supercluster';
export function cluster(data, option) {
  const { radius = 80, maxZoom = 18, minZoom = 0, field, zoom = 2 } = option;
  if (data.pointIndex) {
    const clusterPoint = data.pointIndex.getClusters(data.extent, zoom);
    data.dataArray = formatData(clusterPoint);
    return data;
  }
  const pointIndex = new Supercluster({
    radius,
    minZoom,
    maxZoom,
    map: props => ({ sum: props[field] }),
    reduce: (accumulated, props) => { accumulated.sum += props.sum; }
  });
  const geojson = {
    type: 'FeatureCollection'
  };
  geojson.features = data.dataArray.map(item => {
    return {
      type: 'Feature',
      properties: {
        [field]: item[field]
      },
      geometry: {
        type: 'Point',
        coordinates: item.coordinates
      }
    };
  });
  pointIndex.load(geojson.features);
  const clusterPoint = pointIndex.getClusters(data.extent, zoom);
  const resultData = clusterPoint.map((point, index) => {
    return {
      coordinates: point.geometry.coordinates,
      _id: index + 1,
      ...point.properties
    };
  });
  data.dataArray = resultData;
  return { data, pointIndex };
}
export function formatData(clusterPoint) {
  return clusterPoint.map((point, index) => {
    return {
      coordinates: point.geometry.coordinates,
      _id: index + 1,
      ...point.properties
    };
  });
}
