import LngLat, { earthRadius, LngLatLike } from '../geo/lng_lat';

/*
 * The average circumference of the world in meters.
 */
const earthCircumfrence = 2 * Math.PI * earthRadius; // meters

/*
 * The circumference at a line of latitude in meters.
 */
function circumferenceAtLatitude(latitude: number) {
  return earthCircumfrence * Math.cos((latitude * Math.PI) / 180);
}

export function mercatorXfromLng(lng: number) {
  return (180 + lng) / 360;
}

export function mercatorYfromLat(lat: number) {
  return (
    (180 -
      (180 / Math.PI) *
        Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))) /
    360
  );
}

export function mercatorZfromAltitude(altitude: number, lat: number) {
  return altitude / circumferenceAtLatitude(lat);
}

export function lngFromMercatorX(x: number) {
  return x * 360 - 180;
}

export function latFromMercatorY(y: number) {
  const y2 = 180 - y * 360;
  return (360 / Math.PI) * Math.atan(Math.exp((y2 * Math.PI) / 180)) - 90;
}

export function altitudeFromMercatorZ(z: number, y: number) {
  return z * circumferenceAtLatitude(latFromMercatorY(y));
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
export function mercatorScale(lat: number) {
  return 1 / Math.cos((lat * Math.PI) / 180);
}

export default class MercatorCoordinate {
  public static fromLngLat(lngLatLike: LngLatLike, altitude: number = 0) {
    const lngLat = LngLat.convert(lngLatLike);

    return new MercatorCoordinate(
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
    return new LngLat(lngFromMercatorX(this.x), latFromMercatorY(this.y));
  }

  public toAltitude() {
    return altitudeFromMercatorZ(this.z, this.y);
  }

  public meterInMercatorCoordinateUnits() {
    // 1 meter / circumference at equator in meters * Mercator projection scale factor at this latitude
    return (1 / earthCircumfrence) * mercatorScale(latFromMercatorY(this.y));
  }
}

export { MercatorCoordinate };
