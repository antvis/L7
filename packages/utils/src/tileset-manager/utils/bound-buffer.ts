import { bBoxToBounds, boundsContains, padBounds } from '../../geo';

/**
 * 获取经纬度边界的缓存后的边界
 */
export const getLatLonBoundsBuffer = (
  latLonBounds: [number, number, number, number],
  bufferRatio: number,
) => {
  const bounds = bBoxToBounds(latLonBounds);
  const newBounds = padBounds(bounds, bufferRatio);
  // 地图对称子午线最多重复三次
  const maxLngExtent = 360 * 3 - 180;
  const maxLatExtent = 85.0511287798065;

  const latLonBoundsBuffer = [
    Math.max(newBounds[0][0], -maxLngExtent),
    Math.max(newBounds[0][1], -maxLatExtent),
    Math.min(newBounds[1][0], maxLngExtent),
    Math.min(newBounds[1][1], maxLatExtent),
  ] as [number, number, number, number];

  return latLonBoundsBuffer;
};

/**
 * 边界是否包含在内
 */
export const isLatLonBoundsContains = (
  latLonBoundsBuffer: [number, number, number, number],
  latLonBounds: [number, number, number, number],
) => {
  const boundsBuffer = bBoxToBounds(latLonBoundsBuffer);
  const bounds = bBoxToBounds(latLonBounds);
  const isContains = boundsContains(boundsBuffer, bounds);

  return isContains;
};
