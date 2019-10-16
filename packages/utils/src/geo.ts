import { BBox } from '@turf/helpers';
const originShift = (2 * Math.PI * 6378137) / 2.0;
export type Point = [number, number] | [number, number, number];
/**
 * 计算地理数据范围
 * @param {dataArray} data 地理坐标数据
 * @return {Array} dataExtent
 */
export function extent(data: any[]) {
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
  x = scale * (a * x + b) - 215440491;
  y = scale * (c * y + d) - 106744817;
  return [parseInt(x.toString(), 10), parseInt(y.toString(), 10)];
}
