export default function gridBuffer(layerData) {
  const attribute = {
    vertices: [],
    miter: [],
    colors: [],
    pickingIds: []
  };
  layerData.forEach(element => {
    const { color, id } = element;
    const [ x, y, z ] = element.coordinates;
    attribute.vertices.push(x, y, z);
    attribute.miter.push(-1, -1);
    attribute.vertices.push(x, y, z);
    attribute.miter.push(1, 1);
    attribute.vertices.push(x, y, z);
    attribute.miter.push(-1, 1);
    attribute.vertices.push(x, y, z);
    attribute.miter.push(-1, -1);
    attribute.vertices.push(x, y, z);
    attribute.miter.push(1, -1);
    attribute.vertices.push(x, y, z);
    attribute.miter.push(1, 1);
    attribute.colors.push(...color);
    attribute.colors.push(...color);
    attribute.colors.push(...color);
    attribute.colors.push(...color);
    attribute.colors.push(...color);
    attribute.colors.push(...color);
    attribute.pickingIds.push(id, id, id, id, id, id);
  });
  return attribute;
}
