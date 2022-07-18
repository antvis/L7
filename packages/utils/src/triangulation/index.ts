import { IModelType } from '../worker/interface';
import { IEncodeFeature } from './interface';
import { calculateCentroid } from './utils';
/**
 * 计算2D 填充点图顶点
 * @param feature 映射feature
 */

export function PointFillTriangulation(feature: IEncodeFeature) {
  const coordinates = calculateCentroid(feature.coordinates);
  return {
    vertices: [...coordinates, ...coordinates, ...coordinates, ...coordinates],
    indices: [0, 1, 2, 2, 3, 0],
    size: coordinates.length,
  };
}

export function getTriangulation(modelType: IModelType) {
  switch (modelType) {
    case 'PointFill':
      return PointFillTriangulation;
    default:
      return PointFillTriangulation;
  }
}
