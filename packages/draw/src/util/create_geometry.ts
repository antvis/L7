import turfCircle from '@turf/circle';
import turfDistance from '@turf/distance';
import {
  Feature,
  featureCollection,
  FeatureCollection,
  lineString,
  point,
  polygon,
} from '@turf/helpers';
import { unitsType } from './constant';

export function createCircle(
  center: [number, number],
  endPoint: [number, number],
  options: {
    units: unitsType;
    steps: number;
    id: string;
    pointFeatures: Feature[];
  },
): Feature {
  const radius = turfDistance(point(center), point(endPoint), options);
  const feature = turfCircle(center, radius, {
    units: options.units,
    steps: options.steps,
    properties: {
      ...options,
      active: true,
      type: 'circle',
      radius,
      startPoint: {
        lng: center[0],
        lat: center[1],
      },
      endPoint: {
        lng: endPoint[0],
        lat: endPoint[1],
      },
    },
  });
  return feature as Feature;
}

export function createRect(
  startPoint: [number, number],
  endPoint: [number, number],
  options: {
    id: string;
    pointFeatures: Feature[];
    [key: string]: any;
  },
): Feature {
  const minX = Math.min(startPoint[0], endPoint[0]);
  const minY = Math.min(startPoint[1], endPoint[1]);
  const maxX = Math.max(startPoint[0], endPoint[0]);
  const maxY = Math.max(startPoint[1], endPoint[1]);
  const feature = {
    type: 'Feature',
    properties: {
      type: 'rect',
      active: true,
      startPoint: {
        lng: startPoint[0],
        lat: startPoint[1],
      },
      endPoint: {
        lng: endPoint[0],
        lat: endPoint[1],
      },
      ...options,
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

export function createPolygon(
  points: Array<{ lng: number; lat: number }>,
  options: {
    id?: string | number;
    pointFeatures: Feature[];
    [key: string]: any;
  },
): any {
  const coords = points.map((p) => [p.lng, p.lat]);
  if (points.length < 2) {
    return point(coords[0], options);
  } else if (points.length < 3) {
    return lineString(coords, options);
  } else {
    coords.push(coords[0]);
    return polygon([coords], options);
  }
}

export function createLine(
  points: Array<{ lng: number; lat: number }>,
  options: any,
): any {
  const coords = points.map((p) => [p.lng, p.lat]);
  if (points.length < 2) {
    return point(coords[0], options);
  } else {
    return lineString(coords, options);
  }
}

export function createPoint(
  points: Array<{ lng: number; lat: number }>,
): FeatureCollection {
  const features = points.map((p, index) =>
    point([p.lng, p.lat], {
      active: true,
      id: index.toString(),
    }),
  );
  return featureCollection(features);
}
