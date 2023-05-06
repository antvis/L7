import { LngLat, LngLatLike } from './lng_lat';
import { IPoint, Point } from './point';
export interface IProjection {
  bounds: any;
  project(lngLat: LngLatLike): Point;
  unproject(point: IPoint): LngLat;
}
