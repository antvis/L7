import turfCircle from '@turf/circle';
import turfDistance from '@turf/distance';
import { Feature, featureCollection, point } from '@turf/helpers';
import { unitsType } from './constant';

export function createCircle(
  center: [number, number],
  endPoint: [number, number],
  options: {
    units: unitsType;
    steps: number;
    id: string;
  },
): Feature {
  const radius = turfDistance(point(center), point(endPoint), options);
  const feature = turfCircle(center, radius, {
    units: options.units,
    steps: options.steps,
    properties: {
      id: options.id,
      active: true,
      radius,
      startPoint: center,
      endPoint,
      path: [center, endPoint],
    },
  });
  return feature as Feature;
}

export function creatRect(
  startPoint: [number, number],
  endPoint: [number, number],
): Feature {
  const minX = Math.min(startPoint[0], endPoint[0]);
  const minY = Math.min(startPoint[1], endPoint[1]);
  const maxX = Math.max(startPoint[0], endPoint[0]);
  const maxY = Math.max(startPoint[1], endPoint[1]);
  const feature = {
    type: 'Feature',
    properties: {
      active: true,
      startPoint,
      endPoint,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [minX, minY],
          [minX, maxY],
          [maxX, maxY],
          [maxX, minY],
          [minX, minY],
        ],
      ],
    },
  };
  return feature as Feature;
}
