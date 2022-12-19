import { ILayer, StyleAttributeField } from '@antv/l7-core';
// shapeUpdateList 存储一系列的 shape 类型
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
export async function updateShape(
  layer: ILayer,
  lastShape: StyleAttributeField | undefined,
  currentShape: StyleAttributeField | undefined,
) {
  if (
    typeof lastShape === 'string' &&
    typeof currentShape === 'string' &&
    lastShape !== currentShape
  ) {
    if (layer.type === 'PointLayer') {
      layer.dataState.dataSourceNeedUpdate = true;
      await layer.hooks.beforeRenderData.promise();
      layer.renderLayers();
      return;
    }

    shapeUpdateList.map(async (shapes) => {
      if (shapes.includes(lastShape) && shapes.includes(currentShape)) {
        // dataSourceNeedUpdate 借用数据更新时更新 layer model 的工作流
        layer.dataState.dataSourceNeedUpdate = true;
        await layer.hooks.beforeRenderData.promise();
        layer.renderLayers();
        return;
      }
    });
  }
}
