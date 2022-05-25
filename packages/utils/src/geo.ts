import {
  BBox,
  Coord,
  degreesToRadians,
  isObject,
  radiansToLength,
  Units,
} from '@turf/helpers';

export type IBounds = [[number, number], [number, number]];
interface ILngLat {
  lng: number;
  lat: number;
}
interface IPoint {
  x: number;
  y: number;
}
const originShift = (2 * Math.PI * 6378137) / 2.0;
type Point = number[];
/**
 * 计算地理数据范围
 * @param {dataArray} data 地理坐标数据
 * @return {Array} dataExtent
 */
export function extent(data: any[]): BBox {
  const dataExtent: BBox = [Infinity, Infinity, -Infinity, -Infinity];
  data.forEach((item) => {
    const { coordinates } = item;
    caculExtent(dataExtent, coordinates);
  });
  return dataExtent;
}
function caculExtent(dataExtent: BBox, coords: any[]) {
  if (Array.isArray(coords[0])) {
    coords.forEach((coord) => {
      caculExtent(dataExtent, coord);
    });
  } else {
    if (dataExtent[0] > coords[0]) {
      dataExtent[0] = coords[0];
    }
    if (dataExtent[1] > coords[1]) {
      dataExtent[1] = coords[1];
    }
    if (dataExtent[2] < coords[0]) {
      dataExtent[2] = coords[0];
    }
    if (dataExtent[3] < coords[1]) {
      dataExtent[3] = coords[1];
    }
  }
  return dataExtent;
}

export function tranfrormCoord(data: any[], cb: (item: any[]) => any) {
  return transform(data, cb);
}
function transform(item: any[], cb: (item: any[]) => any): any {
  if (Array.isArray(item[0])) {
    return item.map((coord) => {
      return transform(coord, cb);
    });
  }
  return cb(item);
}
export function lngLatToMeters(lnglat: Point): Point;
export function lngLatToMeters(
  lnglat: Point,
  validate: boolean = true,
  accuracy = { enable: true, decimal: 1 },
) {
  lnglat = validateLngLat(lnglat, validate);
  const lng = lnglat[0];
  const lat = lnglat[1];
  let x = (lng * originShift) / 180.0;
  let y =
    Math.log(Math.tan(((90 + lat) * Math.PI) / 360.0)) / (Math.PI / 180.0);
  y = (y * originShift) / 180.0;
  if (accuracy.enable) {
    x = Number(x.toFixed(accuracy.decimal));
    y = Number(y.toFixed(accuracy.decimal));
  }
  return lnglat.length === 3 ? [x, y, lnglat[2]] : [x, y];
}

export function metersToLngLat(meters: Point, decimal = 6) {
  const x = meters[0];
  const y = meters[1];
  let lng = (x / originShift) * 180.0;
  let lat = (y / originShift) * 180.0;
  lat =
    (180 / Math.PI) *
    (2 * Math.atan(Math.exp((lat * Math.PI) / 180.0)) - Math.PI / 2.0);
  if (decimal !== undefined && decimal !== null) {
    lng = Number(lng.toFixed(decimal));
    lat = Number(lat.toFixed(decimal));
  }
  return meters.length === 3 ? [lng, lat, meters[2]] : [lng, lat];
}
export function longitude(lng: number) {
  if (lng === undefined || lng === null) {
    throw new Error('lng is required');
  }

  // lngitudes cannot extends beyond +/-90 degrees
  if (lng > 180 || lng < -180) {
    lng = lng % 360;
    if (lng > 180) {
      lng = -360 + lng;
    }
    if (lng < -180) {
      lng = 360 + lng;
    }
    if (lng === 0) {
      lng = 0;
    }
  }
  return lng;
}
export function latitude(lat: number) {
  if (lat === undefined || lat === null) {
    throw new Error('lat is required');
  }

  if (lat > 90 || lat < -90) {
    lat = lat % 180;
    if (lat > 90) {
      lat = -180 + lat;
    }
    if (lat < -90) {
      lat = 180 + lat;
    }
    if (lat === 0) {
      lat = 0;
    }
  }
  return lat;
}
export function validateLngLat(lnglat: Point, validate: boolean): Point {
  if (validate === false) {
    return lnglat;
  }

  const lng = longitude(lnglat[0]);
  let lat = latitude(lnglat[1]);

  // Global Mercator does not support latitudes within 85 to 90 degrees
  if (lat > 85) {
    lat = 85;
  }
  if (lat < -85) {
    lat = -85;
  }
  return lnglat.length === 3 ? [lng, lat, lnglat[2]] : [lng, lat];
}
export function aProjectFlat(lnglat: number[]) {
  const maxs = 85.0511287798;
  const lat = Math.max(Math.min(maxs, lnglat[1]), -maxs);
  const scale = 256 << 20;
  let d = Math.PI / 180;
  let x = lnglat[0] * d;
  let y = lat * d;
  y = Math.log(Math.tan(Math.PI / 4 + y / 2));

  const a = 0.5 / Math.PI;
  const b = 0.5;
  const c = -0.5 / Math.PI;
  d = 0.5;
  x = scale * (a * x + b);
  y = scale * (c * y + d);
  return [Math.floor(x), Math.floor(y)];
}
export function unProjectFlat(px: number[]): [number, number] {
  const a = 0.5 / Math.PI;
  const b = 0.5;
  const c = -0.5 / Math.PI;
  let d = 0.5;
  const scale = 256 << 20;
  let [x, y] = px;
  x = (x / scale - b) / a;
  y = (y / scale - d) / c;
  y = (Math.atan(Math.pow(Math.E, y)) - Math.PI / 4) * 2;
  d = Math.PI / 180;
  const lat = y / d;
  const lng = x / d;
  return [lng, lat];
}

export function amap2Project(lng: number, lat: number): [number, number] {
  const r = 85.0511287798;
  const Rg = Math.PI / 180;
  const Tg = 6378137;

  lat = Math.max(Math.min(r, lat), -r);
  lng *= Rg;
  lat *= Rg;
  lat = Math.log(Math.tan(Math.PI / 4 + lat / 2));
  return [lng * Tg, lat * Tg];
}

export function lnglatDistance(
  coordinates1: [number, number],
  coordinates2: [number, number],
  units?: Units,
): number {
  const dLat = degreesToRadians(coordinates2[1] - coordinates1[1]);
  const dLon = degreesToRadians(coordinates2[0] - coordinates1[0]);
  const lat1 = degreesToRadians(coordinates1[1]);
  const lat2 = degreesToRadians(coordinates2[1]);
  const a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);

  return radiansToLength(
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
    (units = 'meters'),
  );
}

export function project(lnglat: [number, number]) {
  const d = Math.PI / 180;
  const max = 85.0511287798;
  const earthRadius = 6378137;
  const lat = Math.max(Math.min(max, lnglat[1]), -max);
  const sin = Math.sin(lat * d);
  const x = earthRadius * lnglat[0] * d;
  const y = (earthRadius * Math.log((1 + sin) / (1 - sin))) / 2;

  return [x, y];
}

export function padBounds(b: IBounds, bufferRatio: number): IBounds {
  const heightBuffer = Math.abs(b[1][1] - b[0][1]) * bufferRatio;
  const widthBuffer = Math.abs(b[1][0] - b[0][0]) * bufferRatio;

  return [
    [b[0][0] - widthBuffer, b[0][1] - heightBuffer],
    [b[1][0] + widthBuffer, b[1][1] + heightBuffer],
  ];
}
/**
 * b1 包含 b2 返回 true 否则false
 * @param b1 bounds1
 * @param b2 bounds2
 */
export function boundsContains(b1: IBounds, b2: IBounds): boolean {
  return (
    b1[0][0] <= b2[0][0] &&
    b1[0][1] <= b2[0][1] &&
    b1[1][0] >= b2[1][0] &&
    b1[1][1] >= b2[1][1]
  );
}
/**
 * bbox 转换为Bounds
 * @param b1 bbox
 *
 */
export function bBoxToBounds(b1: BBox): IBounds {
  return [
    [b1[0], b1[1]],
    [b1[2], b1[3]],
  ];
}

export function normalize(v: Point) {
  const len = calDistance(v, [0, 0]);
  return [v[0] / len, v[1] / len];
}

export function calDistance(p1: Point, p2: Point) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

function dotMul(v1: Point, v2: Point) {
  return v1[0] * v2[0] + v1[1] * v2[1];
}

function getMod(v: Point) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

export function calAngle(v1: Point, v2: Point) {
  return (
    (Math.acos(dotMul(v1, v2) / (getMod(v1) * getMod(v2))) * 180) / Math.PI
  );
}

export function getAngle(v1: Point, v2: Point) {
  // if(v2[0] < 0) {
  //   return calAngle(v1, v2) + 180
  // } else {
  //   return calAngle(v1, v2)
  // }

  if (v2[0] > 0) {
    if (v2[1] > 0) {
      // 1
      return 90 - (Math.atan(v2[1] / v2[0]) * 180) / Math.PI;
    } else {
      // 2
      return 90 + (Math.atan(-v2[1] / v2[0]) * 180) / Math.PI;
    }
  } else {
    if (v2[1] < 0) {
      // 3
      return 180 + (90 - (Math.atan(v2[1] / v2[0]) * 180) / Math.PI);
    } else {
      // 4
      return 270 + (Math.atan(v2[1] / -v2[0]) * 180) / Math.PI;
    }
  }
}
interface IPathPoint {
  start: Point;
  end: Point;
  dis: number;
  rotation: number;
  duration: number;
}

export function flow(coords: Point[], time: number = 100) {
  if (!coords || coords.length < 2) {
    return;
  }
  const originVec2: Point = [0, 1];
  let totalDis = 0;
  const path: IPathPoint[] = [];
  for (let i = 0; i < coords.length - 1; i++) {
    const p1: Point = coords[i];
    const p2: Point = coords[i + 1];
    const dis = calDistance(p1, p2);
    totalDis += dis;

    const direct: Point = [p1[0] - p2[0], p1[1] - p2[1]];
    // const direct: Point = [p2[0] - p1[0], p2[1] - p1[1]];

    let rotation = getAngle(originVec2, direct);
    if (i > 0) {
      const lastRotation = path[i - 1].rotation;
      if (lastRotation - rotation > 360 - lastRotation + rotation) {
        rotation = rotation + 360;
      }
    }

    path.push({
      start: p1,
      end: p2,
      dis,
      rotation,
      duration: 0,
    });
  }
  path.map((point) => {
    point.duration = time * (point.dis / totalDis);
  });
  return path;
}
