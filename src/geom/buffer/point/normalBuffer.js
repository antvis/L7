export default function NormalBuffer(coordinates, properties) {
  const attributes = {
    vertices: [],
    colors: [],
    sizes: [],
    pickingIds: []
  };
  coordinates.forEach((pos, index) => {
    const { color, size, id } = properties[index];
    attributes.vertices.push(...pos);
    attributes.colors.push(...color);
    attributes.pickingIds.push(id);
    attributes.sizes.push(size);

  });


  return attributes;
}
