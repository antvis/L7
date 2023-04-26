import LngLat, { LngLatLike } from '../lng_lat';
import LngLatBounds, { LngLatBoundsLike } from '../lng_lat_bounds';
import Point, { IPoint } from '../point';
import { IProjection } from './interface';

export default class LngLatProjection implements IProjection {
  public bounds: LngLatBoundsLike = new LngLatBounds([-180, -90], [180, 90]);
  public project(lngLat: LngLatLike): Point {
    const { lng, lat } = LngLat.convert(lngLat);
    return new Point(lng, lat);
  }

  public unproject(point: IPoint): LngLat {
    return new LngLat(point.x, point.y);
  }
}
