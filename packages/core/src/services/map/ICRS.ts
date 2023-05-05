import {
  Bounds,
  ILngLat,
  IPoint,
  IProjection,
  LngLat,
  LngLatBounds,
  LngLatLike,
  Point,
  Transformation,
} from './geo';
export type TypeCRS = 'EPSG:3857' | 'EPSG:4326' | 'Earth' | undefined;
export interface ICRS {
  code: TypeCRS;
  transformation: Transformation;
  projection: IProjection;
  wrapLng: [number, number];
  wrapLat: [number, number];
  infinite: boolean;
  lngLatToPoint(lngLat: LngLatLike, zoom: number): Point;
  pointToLngLat(point: IPoint, zoom: number): LngLat;
  project(lngLat: ILngLat): Point;
  unproject(point: IPoint): LngLat;
  scale(zoom: number): number;
  zoom(scale: number): number;
  getProjectedBounds(zoom: number): Bounds | null;
  wrapLnglat(lngLat: LngLat): LngLat;
  wrapLnglatBounds(lngLatBounds: LngLatBounds): LngLatBounds;
}
