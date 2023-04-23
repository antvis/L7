// https://github.com/Leaflet/Leaflet/blob/f0ca5bc9cf/src/geo/crs/CRS.Earth.js
import LngLat from '../lng_lat';
import BaseCRS, { ICRS } from './crs';

export default class Earth extends BaseCRS implements ICRS {
  public wrapLng: [-180, 180];
  private R: number = 6378137;
  public distance(lnglat1: LngLat, lnglat2: LngLat) {
    const rad = Math.PI / 180;
    const lat1 = lnglat1.lat * rad;
    const lat2 = lnglat2.lat * rad;
    const sinDLat = Math.sin(((lnglat2.lat - lnglat1.lat) * rad) / 2);
    const sinDLon = Math.sin(((lnglat2.lng - lnglat1.lng) * rad) / 2);
    const a =
      sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return this.R * c;
  }
}
