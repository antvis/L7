import {
  Bounds,
  ICRS,
  ILngLat,
  IPoint,
  IProjection,
  LngLat,
  LngLatBounds,
  LngLatLike,
  Point,
  Transformation,
  TypeCRS,
} from '@antv/l7-core';
import { wrap } from '@antv/l7-utils';

export default class BaseCRS implements ICRS {
  private tileSize: number = 512;
  public transformation: Transformation;
  public projection: IProjection;
  public wrapLng: [number, number];
  public wrapLat: [number, number];
  public code: TypeCRS;
  // 空间是否限制
  public infinite: boolean = false;
  // 经纬度转地图像素坐标
  public lngLatToPoint(lngLat: LngLatLike, zoom: number): Point {
    const projectedPoint = this.projection.project(lngLat);
    const scale = this.scale(zoom);
    return this.transformation.transform(projectedPoint, scale);
  }
  public pointToLngLat(point: IPoint, zoom: number): LngLat {
    const scale = this.scale(zoom);
    const untransformedPoint = this.transformation.untransform(point, scale);
    return this.projection.unproject(untransformedPoint);
  }
  // 经纬度转平面坐标
  public project(lngLat: ILngLat): Point {
    return this.projection.project(lngLat);
  }

  public unproject(point: IPoint): LngLat {
    return this.projection.unproject(point);
  }

  public scale(zoom: number): number {
    return this.tileSize * Math.pow(2, zoom);
  }

  public zoom(scale: number): number {
    return Math.log(scale / this.tileSize) / Math.LN2;
  }

  public getProjectedBounds(zoom: number): Bounds | null {
    if (this.infinite) {
      return null;
    }
    const b = this.projection.bounds;
    const scale = this.scale(zoom);
    const min = this.transformation.transform(b.min, scale);
    const max = this.transformation.transform(b.max, scale);
    return new Bounds(min, max);
  }

  public wrapLnglat(lngLat: LngLat): LngLat {
    const lng = this.wrapLng
      ? wrap(lngLat.lng, this.wrapLng[0], this.wrapLng[1])
      : lngLat.lng;

    const lat = this.wrapLat
      ? wrap(lngLat.lat, this.wrapLat[0], this.wrapLat[1])
      : lngLat.lat;

    return new LngLat(lat, lng);
  }
  public wrapLnglatBounds(lngLatBounds: LngLatBounds): LngLatBounds {
    const sw = this.wrapLnglat(lngLatBounds.getSouthWest());
    const ne = this.wrapLnglat(lngLatBounds.getNorthEast());
    return new LngLatBounds(sw, ne);
  }
}
