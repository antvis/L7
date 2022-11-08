import { DEFAULT_EXTENT } from '../const';
import { TileBounds } from '../types';

// // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29
export function osmLonLat2TileXY(lon: number, lat: number, zoom: number) {
  const x = Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
  const y = Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180),
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoom),
  );
  return [x, y];
}

// https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29
export function osmTileXY2LonLat(x: number, y: number, zoom: number) {
  const lon = (x / Math.pow(2, zoom)) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, zoom);
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return [lon, lat];
}

/**
 * 获取当前瓦片的经纬度边界
 */
export const tileToBounds = (x: number, y: number, z: number) => {
  const [minLng, maxLat] = osmTileXY2LonLat(x, y, z);
  const [maxLng, minLat] = osmTileXY2LonLat(x + 1, y + 1, z);
  return [minLng, minLat, maxLng, maxLat] as TileBounds;
};

/**
 * 获取当前视野层级瓦片的所有索引
 * latLonBounds          => pixelBounds           => tileRange             => tileIndices
 * {topLeft,bottomRight} => {topLeft,bottomRight} => {topLeft,bottomRight} => {x, y, z}[]
 * 如果当前 zoom 层级小于 minZoom 则返回空数组
 * 如果当前 zoom 层级大于 maxZoom 则返回最大的瓦片索引
 */
export function getTileIndices({
  zoom,
  latLonBounds,
  maxZoom = Infinity,
  minZoom = 0,
  zoomOffset = 0,
  extent = DEFAULT_EXTENT,
}: {
  zoom: number;
  latLonBounds: TileBounds;
  maxZoom: number;
  minZoom: number;
  zoomOffset: number;
  extent: TileBounds;
  tileSize: number;
}) {
  let z = Math.ceil(zoom) + zoomOffset;
  // 如果当前 zoom 层级小于 minZoom
  if (Number.isFinite(minZoom) && z < minZoom) {
    return [];
  }

  // 如果当前 zoom 层级大于 maxZoom
  if (Number.isFinite(maxZoom) && z > maxZoom) {
    z = maxZoom;
  }

  const [minLng, minLat, maxLng, maxLat] = latLonBounds;
  const bounds = [
    Math.max(minLng, extent[0]),
    Math.max(minLat, extent[1]),
    Math.min(maxLng, extent[2]),
    Math.min(maxLat, extent[3]),
  ];

  const indices = [];

  const [minX, maxY] = osmLonLat2TileXY(bounds[0], bounds[1], z);
  const [maxX, minY] = osmLonLat2TileXY(bounds[2], bounds[3], z);

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      indices.push({ x, y, z });
    }
  }

  // 计算中心瓦片索引
  const centerX = (maxX + minX) / 2;
  const centerY = (maxY + minY) / 2;
  const distance = (x: number, y: number) =>
    Math.abs(x - centerX) + Math.abs(y - centerY);
  // 通过离中心瓦片距离排序，越近的排在前面
  indices.sort((a, b) => distance(a.x, a.y) - distance(b.x, b.y));

  return indices;
}

/**
 * Warp 瓦片索引，支持对称子午线瓦片连续
 */
export const getTileWarpXY = (
  x: number,
  y: number,
  z: number,
  wrap: boolean = true,
) => {
  const scale = Math.pow(2, z);
  const maxIndex = scale - 1;
  const distance = scale;

  let warpX = x;
  const warpY = y;
  if (wrap) {
    if (warpX < 0) {
      warpX = warpX + distance;
    } else if (warpX > maxIndex) {
      warpX = warpX % distance;
    }
  }

  return { warpX, warpY };
};
