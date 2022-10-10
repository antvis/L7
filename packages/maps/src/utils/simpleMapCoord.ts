export interface ISimpleMapCoord {
  setSize(size: number): void;
  getSize(): [number, number];
  project(lnglat: [number, number]): [number, number];
  unproject(xy: [number, number]): [number, number];
}
export class SimpleMapCoord implements ISimpleMapCoord {
  private size: number = 10000;
  constructor(size?: number) {
    this.size = size ? size : 10000;
  }

  public setSize(size: number) {
    this.size = size;
  }

  public getSize(): [number, number] {
    return [this.size, this.size];
  }

  /**
   * coord
   * ^ y (y > 0)
   * |
   * |
   * |
   * |(x = 0, y = 0)
   * ---------------> x (x > 0)
   */

  /***
   * lng: [-180, 180] 360
   * lat: [-85.05112877980659, 85.05112877980659] 170.10225755961318
   */

  public mercatorXfromLng(lng: number): number {
    // (0 - 1) * this.size
    return ((180 + lng) / 360) * this.size;
  }

  public mercatorYfromLat(lat: number): number {
    // (0 - 1) * this.size
    return (
      (1 -
        (180 -
          (180 / Math.PI) *
            Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))) /
          360) *
      this.size
    );
  }

  public lngFromMercatorX(x: number): number {
    return (x / this.size) * 360 - 180;
  }

  public latFromMercatorY(y: number): number {
    const y2 = 180 - (1 - y / this.size) * 360;
    return (360 / Math.PI) * Math.atan(Math.exp((y2 * Math.PI) / 180)) - 90;
  }

  public project(lnglat: [number, number]): [number, number] {
    const x = this.mercatorXfromLng(lnglat[0]);
    const y = this.mercatorYfromLat(lnglat[1]);
    return [x, y];
  }

  public unproject(xy: [number, number]): [number, number] {
    const lng = this.lngFromMercatorX(xy[0]);
    const lat = this.latFromMercatorY(xy[1]);
    return [lng, lat];
  }
}
