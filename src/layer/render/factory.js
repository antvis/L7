export const Render_MAP = {};
export const getRender = (layerType, shapeType) => {
  return Render_MAP[layerType.toLowerCase()] && Render_MAP[layerType.toLowerCase()][shapeType.toLowerCase()];
};
export const registerRender = (layerType, shapeType, render) => {
  if (getRender(layerType, shapeType)) {
    throw new Error(`Render shapeType '${shapeType}' existed.`);
  }
  // 存储到 map 中
  if (!Render_MAP[layerType.toLowerCase()]) Render_MAP[layerType.toLowerCase()] = {};
  Render_MAP[layerType.toLowerCase()][shapeType.toLowerCase()] = render;
};
