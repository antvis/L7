import LngLat, { LngLatLike } from '../lng_lat';
import Point, { IPoint } from '../point';
export interface IProjection {
  bounds: any;
  project(lngLat: LngLatLike): Point;
  unproject(point: IPoint): LngLat;
}
