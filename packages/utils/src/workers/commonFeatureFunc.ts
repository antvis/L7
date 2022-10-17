import { IEncodeFeature } from './interface';

export function a_Color(feature: IEncodeFeature) {
  const { color } = feature;
  return !color || !color.length ? [1, 1, 1, 1] : color;
}

export function a_Position(
  feature: IEncodeFeature,
  featureIdx: number,
  vertex: number[],
) {
  return vertex.length === 2
    ? [vertex[0], vertex[1], 0]
    : [vertex[0], vertex[1], vertex[2]];
}

export function a_filter(feature: IEncodeFeature) {
  const { filter } = feature;
  return filter ? [1] : [0];
}

export function a_vertexId(feature: IEncodeFeature, featureIdx: number) {
  return [featureIdx];
}
