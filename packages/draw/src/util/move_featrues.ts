import { Feature, Geometry, Properties } from '@turf/helpers';
import { FeatureType } from './constant';
interface IDelta {
  lng: number;
  lat: number;
}
type RingType = Array<[number, number]>;
export default function(features: Feature[], delta: IDelta) {
  features.forEach((feature) => {
    const geometry = feature.geometry as Geometry;
    let nextCoord;
    const { type, coordinates } = geometry;
    switch (type) {
      case FeatureType.POINT:
        nextCoord = movePoint(coordinates as [number, number], delta);
        break;
      case FeatureType.LINE_STRING:
      case FeatureType.MULTI_POINT:
        nextCoord = moveRing(coordinates as RingType, delta);
        break;
      case FeatureType.POLYGON:
      case FeatureType.MULTI_LINE_STRING:
        nextCoord = moveMultiPolygon(coordinates as RingType[], delta);
        break;
      case FeatureType.MULTI_POLYGON:
        nextCoord = (coordinates as RingType[][]).map((mult) =>
          moveMultiPolygon(mult as RingType[], delta),
        );
        break;
    }
    if (nextCoord) {
      geometry.coordinates = nextCoord;
    }
  });

  return features;
}

export function movePoint(
  coord: [number, number],
  delta: IDelta,
): [number, number] {
  return [coord[0] + delta.lng, coord[1] + delta.lat];
}

export function moveRing(coords: RingType, delta: IDelta) {
  return coords.map((coord) => movePoint(coord, delta));
}

export function moveMultiPolygon(mult: RingType[], delta: IDelta) {
  return mult.map((ring) => moveRing(ring, delta));
}
