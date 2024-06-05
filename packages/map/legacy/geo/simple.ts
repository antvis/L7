import type { LngLatLike } from './lng_lat';
import LngLat, { earthRadius } from './lng_lat';

/*
 * The average circumference of the world in meters.
 */
const earthCircumfrence = 2 * Math.PI * earthRadius; // meters

/*
 * The circumference at a line of latitude in meters.
 */
export function circumferenceAtLatitude(latitude: number) {
  return earthCircumfrence * Math.cos((latitude * Math.PI) / 180);
}

export function mercatorXfromLng(lng: number) {
  return lng;
}

export function mercatorYfromLat(lat: number) {
  return lat;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function mercatorZfromAltitude(altitude: number, lat: number) {
  return altitude;
}

export function lngFromMercatorX(x: number) {
  return x;
}

export function latFromMercatorY(y: number) {
  return y;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function altitudeFromMercatorZ(z: number, y: number) {
  return z;
}

/**
 * Determine the Mercator scale factor for a given latitude, see
 * https://en.wikipedia.org/wiki/Mercator_projection#Scale_factor
 *
 * At the equator the scale factor will be 1, which increases at higher latitudes.
 *
 * @param {number} lat Latitude
 * @returns {number} scale factor
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function mercatorScale(lat: number) {
  return 1;
}

export default class SimpleCoordinate {
  public static fromLngLat(lngLatLike: LngLatLike, altitude: number = 0) {
    const lngLat = LngLat.convert(lngLatLike);

    return new SimpleCoordinate(
      mercatorXfromLng(lngLat.lng),
      mercatorYfromLat(lngLat.lat),
      mercatorZfromAltitude(altitude, lngLat.lat),
    );
  }
  public x: number;
  public y: number;
  public z: number;

  constructor(x: number, y: number, z: number = 0) {
    this.x = +x;
    this.y = +y;
    this.z = +z;
  }
  public toLngLat() {
    return new LngLat(this.x, this.y);
  }

  public toAltitude() {
    return this.z;
  }

  public meterInMercatorCoordinateUnits() {
    // 1 meter / circumference at equator in meters * Mercator projection scale factor at this latitude
    return 1;
  }
}
