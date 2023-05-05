import {
  IPoint,
  IProjection,
  LngLat,
  LngLatBounds,
  LngLatBoundsLike,
  LngLatLike,
  Point,
} from '@antv/l7-core';

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
