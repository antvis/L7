import Bounds from '../bounds';
import LngLat, { LngLatLike } from '../lng_lat';
import Point, { IPoint } from '../point';
import { IProjection } from './interface';
const earthRadius = 6378137;
export default class SphericalMercator implements IProjection {
  public bounds: Bounds = (() => {
    const d = earthRadius * Math.PI;
    return new Bounds([-d, -d, d, d]);
  })();
  public static R: number = earthRadius;
  private maxLatitude: number = 85.0511287798;

  public project(ll: LngLatLike): Point {
    const lngLat = LngLat.convert(ll);
    const d = Math.PI / 180;
    const max = this.maxLatitude;
    const lat = Math.max(Math.min(max, lngLat.lat), -max);
    const sin = Math.sin(lat * d);
    return new Point(
      earthRadius * lngLat.lng * d,
      (earthRadius * Math.log((1 + sin) / (1 - sin))) / 2,
    );
  }

  public unproject(point: IPoint): LngLat {
    const d = 180 / Math.PI;
    return new LngLat(
      (point.x * d) / earthRadius,
      (2 * Math.atan(Math.exp(point.y / earthRadius)) - Math.PI / 2) * d,
    );
  }
}
