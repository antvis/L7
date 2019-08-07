export const LAYER_MAP = {};
export const getLayer = type => {
  return LAYER_MAP[type.toLowerCase()];
};
export const registerLayer = (type, layer) => {
  if (getLayer(type)) {
    throw new Error(`Layer type '${type}' existed.`);
  }
  // 存储到 map 中
  LAYER_MAP[type] = layer;
};
