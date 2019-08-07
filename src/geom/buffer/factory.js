export const Buffer_MAP = {};
export const getBuffer = (bufferType, shapeType) => {
  return Buffer_MAP[bufferType.toLowerCase()] && Buffer_MAP[bufferType.toLowerCase()][shapeType.toLowerCase()];
};
export const registerBuffer = (bufferType, shapeType, render) => {
  if (getBuffer(bufferType, shapeType)) {
    throw new Error(`Render shapeType '${shapeType}' existed.`);
  }
  // 存储到 map 中
  if (!Buffer_MAP[bufferType.toLowerCase()]) Buffer_MAP[bufferType.toLowerCase()] = {};
  Buffer_MAP[bufferType.toLowerCase()][shapeType.toLowerCase()] = render;
};
