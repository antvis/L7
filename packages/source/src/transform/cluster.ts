import { IClusterOptions, IParserData } from '@antv/l7-core';
// @ts-ignore
// tslint:disable-next-line:no-submodule-imports
import Supercluster from 'supercluster/dist/supercluster';
export function cluster(
  data: IParserData,
  option: Partial<IClusterOptions>,
): IParserData {
  const { radius = 40, maxZoom = 18, minZoom = 0, zoom = 2 } = option;
  if (data.pointIndex) {
    const clusterData = data.pointIndex.getClusters(
      data.extent,
      Math.floor(zoom),
    );
    data.dataArray = formatData(clusterData);
    return data;
  }
  const pointIndex = new Supercluster({
    radius,
    minZoom,
    maxZoom,
  });
  const geojson: {
    type: string;
    features: any[];
  } = {
    type: 'FeatureCollection',
    features: [],
  };
  geojson.features = data.dataArray.map((item) => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: item.coordinates,
      },
      properties: {
        ...item,
      },
    };
  });
  pointIndex.load(geojson.features);
  return pointIndex;
}
export function formatData(clusterPoint: any[]) {
  return clusterPoint.map((point, index) => {
    return {
      coordinates: point.geometry.coordinates,
      _id: index + 1,
      ...point.properties,
    };
  });
}
