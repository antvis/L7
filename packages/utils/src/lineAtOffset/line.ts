import { Point } from './interface';

export function pathLineAtOffset(coords: Point[], offset: number) {
  let totalDistance = 0;
  const cachePoints = [];
  for (let i = 0; i < coords.length - 1; i++) {
    const p1 = coords[i] as [number, number];
    const p2 = coords[i + 1] as [number, number];
    const distance = calDistance(p1, p2);
    const lastTotalDistance = totalDistance;
    totalDistance += distance;
    cachePoints.push({
      p1,
      p2,
      totalDistance,
      distance,
      lastTotalDistance,
    });
  }
  const offsetDistance = totalDistance * offset;
  let _lng, _lat;
  for (let i = 0; i < cachePoints.length; i++) {
    const currentDistance = cachePoints[i].totalDistance;
    if (currentDistance > offsetDistance) {
      const p1 = cachePoints[i].p1;
      const p2 = cachePoints[i].p2;
      const radius =
        (offsetDistance - cachePoints[i].lastTotalDistance) /
        cachePoints[i].distance;
      const offsetPoint = mixPoint(p2, p1, radius);
      _lng = offsetPoint[0];
      _lat = offsetPoint[1];
      break;
    }
  }
  return {
    _lng,
    _lat,
    _height: 0,
  };
}

function mixPoint(p1: Point, p2: Point, r: number) {
  return [p1[0] * r + p2[0] * (1 - r), p1[1] * r + p2[1] * (1 - r)];
}

function calDistance(p1: Point, p2: Point) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}
