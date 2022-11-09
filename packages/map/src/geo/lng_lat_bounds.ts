import LngLat, { LngLatLike } from './lng_lat';
export type LngLatBoundsLike =
  | LngLatBounds
  | [LngLatLike, LngLatLike]
  | [number, number, number, number];
export default class LngLatBounds {
  public static convert(input: LngLatBoundsLike): LngLatBounds {
    if (input instanceof LngLatBounds) {
      return input;
    }
    return new LngLatBounds(input);
  }
  private ne: LngLat;
  private sw: LngLat;
  constructor(sw?: any, ne?: any) {
    if (!sw) {
      // noop
    } else if (ne) {
      this.setSouthWest(sw).setNorthEast(ne);
    } else if (sw.length === 4) {
      this.setSouthWest([sw[0], sw[1]]).setNorthEast([sw[2], sw[3]]);
    } else {
      this.setSouthWest(sw[0]).setNorthEast(sw[1]);
    }
  }

  public setNorthEast(ne: LngLatLike) {
    this.ne =
      ne instanceof LngLat ? new LngLat(ne.lng, ne.lat) : LngLat.convert(ne);
    return this;
  }
  public setSouthWest(sw: LngLatLike) {
    this.sw =
      sw instanceof LngLat ? new LngLat(sw.lng, sw.lat) : LngLat.convert(sw);
    return this;
  }

  public extend(obj: LngLatLike | LngLatBoundsLike): this {
    const sw = this.sw;
    const ne = this.ne;
    let sw2: any;
    let ne2: any;

    if (obj instanceof LngLat) {
      sw2 = obj;
      ne2 = obj;
    } else if (obj instanceof LngLatBounds) {
      sw2 = obj.sw;
      ne2 = obj.ne;

      if (!sw2 || !ne2) {
        return this;
      }
    } else {
      if (Array.isArray(obj)) {
        // @ts-ignore
        if (obj.length === 4 || obj.every(Array.isArray)) {
          const lngLatBoundsObj = obj as LngLatBoundsLike;
          return this.extend(LngLatBounds.convert(lngLatBoundsObj));
        } else {
          const lngLatObj = obj as LngLatLike;
          return this.extend(LngLat.convert(lngLatObj));
        }
      }
      return this;
    }

    if (!sw && !ne) {
      this.sw = new LngLat(sw2.lng, sw2.lat);
      this.ne = new LngLat(ne2.lng, ne2.lat);
    } else {
      sw.lng = Math.min(sw2.lng, sw.lng);
      sw.lat = Math.min(sw2.lat, sw.lat);
      ne.lng = Math.max(ne2.lng, ne.lng);
      ne.lat = Math.max(ne2.lat, ne.lat);
    }

    return this;
  }
  public getCenter(): LngLat {
    return new LngLat(
      (this.sw.lng + this.ne.lng) / 2,
      (this.sw.lat + this.ne.lat) / 2,
    );
  }

  public getSouthWest(): LngLat {
    return this.sw;
  }

  public getNorthEast(): LngLat {
    return this.ne;
  }

  public getNorthWest(): LngLat {
    return new LngLat(this.getWest(), this.getNorth());
  }

  public getSouthEast(): LngLat {
    return new LngLat(this.getEast(), this.getSouth());
  }

  public getWest(): number {
    return this.sw.lng;
  }

  public getSouth(): number {
    return this.sw.lat;
  }

  public getEast(): number {
    return this.ne.lng;
  }

  public getNorth(): number {
    return this.ne.lat;
  }

  public toArray(): [[number, number], [number, number]] {
    return [this.sw.toArray(), this.ne.toArray()];
  }

  public toString() {
    return `LngLatBounds(${this.sw.toString()}, ${this.ne.toString()})`;
  }

  public isEmpty() {
    return !(this.sw && this.ne);
  }

  public contains(lnglat: LngLatLike) {
    const { lng, lat } = LngLat.convert(lnglat);

    const containsLatitude = this.sw.lat <= lat && lat <= this.ne.lat;
    let containsLongitude = this.sw.lng <= lng && lng <= this.ne.lng;
    if (this.sw.lng > this.ne.lng) {
      // wrapped coordinates
      containsLongitude = this.sw.lng >= lng && lng >= this.ne.lng;
    }

    return containsLatitude && containsLongitude;
  }
}
