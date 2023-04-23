import LngLat, { ILngLat } from '../lng_lat';
import Point, { IPoint } from '../point';
export interface IProjection {
  bounds: any;
  project(lngLat: ILngLat): Point;
  unproject(point: IPoint): LngLat;
}
