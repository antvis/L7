export default function ImageBuffer(coordinates, properties, opt) {
  const attributes = {
    vertices: [],
    colors: [],
    sizes: [],
    shapes: [],
    pickingIds: [],
    uv: []
  };
  coordinates.forEach((pos, index) => {
    const { color, size, id, shape } = properties[index];
    const { x, y } = opt.imagePos[shape];
    attributes.vertices.push(...pos);
    attributes.colors.push(...color);
    attributes.pickingIds.push(id);
    attributes.sizes.push(size * window.devicePixelRatio); //
    attributes.uv.push(x, y);
    attributes.shapes.push(shape);
  });


  return attributes;
}
