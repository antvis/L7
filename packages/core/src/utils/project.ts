const DEGREES_TO_RADIANS = Math.PI / 180;
const TILE_SIZE = 512;
// Average circumference (40075 km equatorial, 40007 km meridional)
const EARTH_CIRCUMFERENCE = 40.03e6;

interface IDistanceScales {
  pixelsPerMeter: [number, number, number];
  metersPerPixel: [number, number, number];
  pixelsPerDegree: [number, number, number];
  degreesPerPixel: [number, number, number];
  pixelsPerDegree2: [number, number, number];
  pixelsPerMeter2: [number, number, number];
}

/**
 * Calculate distance scales in meters around current lat/lon, both for
 * degrees and pixels.
 * In mercator projection mode, the distance scales vary significantly
 * with latitude.
 */
export function getDistanceScales({
  latitude = 0,
  zoom = 0,
  scale,
  highPrecision = false,
  flipY = false,
}: Partial<{
  latitude: number;
  zoom: number;
  scale: number | undefined;
  highPrecision: boolean;
  flipY: boolean;
}>): IDistanceScales {
  // Calculate scale from zoom if not provided
  scale = scale !== undefined ? scale : Math.pow(2, zoom);

  // @ts-ignore
  const result: IDistanceScales = {};
  const worldSize = TILE_SIZE * scale;
  const latCosine = Math.cos(latitude * DEGREES_TO_RADIANS);

  /**
   * Number of pixels occupied by one degree longitude around current lat/lon:
   *  pixelsPerDegreeX = d(lngLatToWorld([lng, lat])[0])/d(lng)
   *     = scale * TILE_SIZE * DEGREES_TO_RADIANS / (2 * PI)
   *   pixelsPerDegreeY = d(lngLatToWorld([lng, lat])[1])/d(lat)
   *     = -scale * TILE_SIZE * DEGREES_TO_RADIANS / cos(lat * DEGREES_TO_RADIANS)  / (2 * PI)
   */
  const pixelsPerDegreeX = worldSize / 360;
  const pixelsPerDegreeY = pixelsPerDegreeX / latCosine;

  /**
   * Number of pixels occupied by one meter around current lat/lon:
   */
  const altPixelsPerMeter = worldSize / EARTH_CIRCUMFERENCE / latCosine;

  /**
   * LngLat: longitude -> east and latitude -> north (bottom left)
   * UTM meter offset: x -> east and y -> north (bottom left)
   * World space: x -> east and y -> south (top left)
   *
   * Y needs to be flipped when converting delta degree/meter to delta pixels
   */
  result.pixelsPerMeter = [altPixelsPerMeter, -altPixelsPerMeter, altPixelsPerMeter];
  result.metersPerPixel = [1 / altPixelsPerMeter, -1 / altPixelsPerMeter, 1 / altPixelsPerMeter];

  result.pixelsPerDegree = [pixelsPerDegreeX, -pixelsPerDegreeY, altPixelsPerMeter];
  result.degreesPerPixel = [1 / pixelsPerDegreeX, -1 / pixelsPerDegreeY, 1 / altPixelsPerMeter];

  /**
   * Taylor series 2nd order for 1/latCosine
   *  f'(a) * (x - a)
   *     = d(1/cos(lat * DEGREES_TO_RADIANS))/d(lat) * dLat
   *     = DEGREES_TO_RADIANS * tan(lat * DEGREES_TO_RADIANS) / cos(lat * DEGREES_TO_RADIANS) * dLat
   */
  if (highPrecision) {
    const latCosine2 = (DEGREES_TO_RADIANS * Math.tan(latitude * DEGREES_TO_RADIANS)) / latCosine;
    const pixelsPerDegreeY2 = (pixelsPerDegreeX * latCosine2) / 2;

    const altPixelsPerDegree2 = (worldSize / EARTH_CIRCUMFERENCE) * latCosine2;
    const altPixelsPerMeter2 = (altPixelsPerDegree2 / pixelsPerDegreeY) * altPixelsPerMeter;

    result.pixelsPerDegree2 = [0, -pixelsPerDegreeY2, altPixelsPerDegree2];
    result.pixelsPerMeter2 = [altPixelsPerMeter2, 0, altPixelsPerMeter2];

    if (flipY) {
      result.pixelsPerDegree2[1] = -result.pixelsPerDegree2[1];
      result.pixelsPerMeter2[1] = -result.pixelsPerMeter2[1];
    }
  }

  if (flipY) {
    result.pixelsPerMeter[1] = -result.pixelsPerMeter[1];
    result.metersPerPixel[1] = -result.metersPerPixel[1];
    result.pixelsPerDegree[1] = -result.pixelsPerDegree[1];
    result.degreesPerPixel[1] = -result.degreesPerPixel[1];
  }

  // Main results, used for converting meters to latlng deltas and scaling offsets
  return result;
}
