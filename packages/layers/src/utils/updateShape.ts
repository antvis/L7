import { ILayer, StyleAttributeField } from '@antv/l7-core';
// TODO: shapeUpdateList 存储一系列的 shape 类型
// 当这一系列的 shape 相互切换的时候需要重构 layer 的 model (顶点数据集)
const shapeUpdateList = [
  // PointLayer
  ['circle', 'cylinder'],
  ['square', 'cylinder'],
  ['triangle', 'cylinder'],
  ['pentagon', 'cylinder'],
  ['hexagon', 'cylinder'],
  ['octogon', 'cylinder'],
  ['hexagram', 'cylinder'],
  ['rhombus', 'cylinder'],
  ['vesica', 'cylinder'],
];
export function updateShape(
  layer: ILayer,
  lastShape: StyleAttributeField | undefined,
  currentShape: StyleAttributeField | undefined,
): void {
  if (
    typeof lastShape === 'string' &&
    typeof currentShape === 'string' &&
    lastShape !== currentShape
  ) {
    if (layer.type === 'PointLayer') {
      layer.dataState.dataSourceNeedUpdate = true;
      return;
    }

    shapeUpdateList.map((shapes) => {
      if (shapes.includes(lastShape) && shapes.includes(currentShape)) {
        // TODO: dataSourceNeedUpdate 借用数据更新时更新 layer model 的工作流
        layer.dataState.dataSourceNeedUpdate = true;
        return;
      }
    });
  }
}
