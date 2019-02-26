export default function NormalBuffer(layerData) {
  const attributes = {
    vertices: [],
    colors: [],
    sizes: [],
    pickingIds: []
  };
  layerData.forEach(item => {
    const { color, size, id, coordinates} = item;
    attributes.vertices.push(...coordinates);
    attributes.colors.push(...color);
    attributes.pickingIds.push(id);
    attributes.sizes.push(size);

  });


  return attributes;
}
