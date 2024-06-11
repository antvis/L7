export type Padding =
  | number
  | [number, number, number, number]
  | {
      top?: number;
      bottom?: number;
      right?: number;
      left?: number;
    };

export function toPaddingOptions(padding: Padding = {}) {
  const defaultPadding = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
  if (typeof padding === 'number') {
    return {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding,
    };
  }
  if (Array.isArray(padding)) {
    if (padding.length === 4) {
      return {
        top: padding[0],
        right: padding[1],
        bottom: padding[2],
        left: padding[3],
      };
    }
    if (padding.length === 2) {
      return {
        top: padding[0],
        right: padding[1],
        bottom: padding[0],
        left: padding[1],
      };
    }
  }

  return { ...defaultPadding, ...padding };
}

export function lngLatToMercator(lnglat: [number, number], altitude: number) {
  const mercatorXfromLng = (lng: number) => {
    return (180 + lng) / 360;
  };

  const mercatorYfromLat = (lat: number) => {
    return (180 - (180 / Math.PI) * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))) / 360;
  };

  const mercatorZfromAltitude = (altitude: number, lat: number) => {
    /*
     * The circumference at a line of latitude in meters.
     */
    const circumferenceAtLatitude = (latitude: number) => {
      const earthRadius = 6371008.8;
      /*
       * The average circumference of the world in meters.
       */
      const earthCircumfrence = 2 * Math.PI * earthRadius; // meters
      return earthCircumfrence * Math.cos((latitude * Math.PI) / 180);
    };

    return altitude / circumferenceAtLatitude(lat);
  };

  const x = mercatorXfromLng(lnglat[0]);
  const y = mercatorYfromLat(lnglat[1]);
  const z = mercatorZfromAltitude(altitude, lnglat[1]);

  return { x, y, z };
}
