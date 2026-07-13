/**
 * 相对坐标系工具
 * 用于在Layer层实现高精度坐标转换
 */

import type { IParseDataItem } from '../interface';

export interface IRelativeCoordinateOptions {
  enableRelativeCoordinates?: boolean;
  relativeOrigin?: [number, number];
}

export interface IRelativeCoordinateResult {
  dataArray: IParseDataItem[];
  relativeOrigin: [number, number];
  originalExtent: [number, number, number, number];
}

/**
 * 计算数据的边界框中心点作为相对坐标原点
 */
export function calculateRelativeOrigin(dataArray: IParseDataItem[]): [number, number] {
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  // 遍历所有坐标点计算边界
  dataArray.forEach((item) => {
    const coordinates = item.coordinates;
    if (!coordinates) return;

    // 递归处理嵌套的坐标数组
    const processCoordinates = (coords: any[]): void => {
      if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
        // 这是一个坐标点 [lng, lat]
        const [lng, lat] = coords;
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
      } else if (Array.isArray(coords[0])) {
        // 这是嵌套数组，递归处理
        coords.forEach(processCoordinates);
      }
    };

    processCoordinates(coordinates);
  });

  // 返回中心点作为相对原点
  const centerLng = (minLng + maxLng) / 2;
  const centerLat = (minLat + maxLat) / 2;

  return [centerLng, centerLat];
}

/**
 * 将坐标转换为相对坐标
 */
export function convertToRelativeCoordinates(
  dataArray: IParseDataItem[],
  relativeOrigin: [number, number],
): IParseDataItem[] {
  const [originLng, originLat] = relativeOrigin;

  return dataArray.map((item) => {
    if (!item.coordinates) return item;

    // 递归处理坐标转换
    const convertCoordinates = (coords: any[]): any[] => {
      if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
        // 这是一个坐标点 [lng, lat]，转换为相对坐标
        const relativeLng = Number((coords[0] - originLng).toPrecision(15));
        const relativeLat = Number((coords[1] - originLat).toPrecision(15));
        return [relativeLng, relativeLat, ...(coords.slice(2) || [])];
      } else if (Array.isArray(coords[0])) {
        // 这是嵌套数组，递归处理
        return coords.map(convertCoordinates);
      }
      return coords;
    };

    return {
      ...item,
      coordinates: convertCoordinates(item.coordinates),
    };
  });
}

/**
 * 将相对坐标转换回绝对坐标（用于交互计算）
 */
export function convertToAbsoluteCoordinates(
  dataArray: IParseDataItem[],
  relativeOrigin: [number, number],
): IParseDataItem[] {
  const [originLng, originLat] = relativeOrigin;

  return dataArray.map((item) => {
    if (!item.coordinates) return item;

    // 递归处理坐标转换
    const convertCoordinates = (coords: any[]): any[] => {
      if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
        // 这是一个相对坐标点，转换为绝对坐标
        const absoluteLng = coords[0] + originLng;
        const absoluteLat = coords[1] + originLat;
        return [absoluteLng, absoluteLat, ...(coords.slice(2) || [])];
      } else if (Array.isArray(coords[0])) {
        // 这是嵌套数组，递归处理
        return coords.map(convertCoordinates);
      }
      return coords;
    };

    return {
      ...item,
      coordinates: convertCoordinates(item.coordinates),
    };
  });
}

/**
 * 处理相对坐标转换的主函数
 */
export function processRelativeCoordinates(
  dataArray: IParseDataItem[],
  options: IRelativeCoordinateOptions = {},
): IRelativeCoordinateResult {
  const { enableRelativeCoordinates = false, relativeOrigin: customOrigin } = options;

  if (!enableRelativeCoordinates) {
    return {
      dataArray,
      relativeOrigin: [0, 0],
      originalExtent: [0, 0, 0, 0],
    };
  }

  // 计算原始数据范围
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  dataArray.forEach((item) => {
    const coordinates = item.coordinates;
    if (!coordinates) return;

    const processCoordinates = (coords: any[]): void => {
      if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
        const [lng, lat] = coords;
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
      } else if (Array.isArray(coords[0])) {
        coords.forEach(processCoordinates);
      }
    };

    processCoordinates(coordinates);
  });

  const originalExtent: [number, number, number, number] = [minLng, minLat, maxLng, maxLat];

  // 使用自定义原点或计算的中心点
  const relativeOrigin = customOrigin || calculateRelativeOrigin(dataArray);

  // 转换为相对坐标
  const relativeDataArray = convertToRelativeCoordinates(dataArray, relativeOrigin);

  return {
    dataArray: relativeDataArray,
    relativeOrigin,
    originalExtent,
  };
}
